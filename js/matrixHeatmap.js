/**
 * matrixHeatmap.js
 * ---------------------------------------------------------------------------
 * The Year/Month matrix view used by BOTH levels.
 *   x direction = year, y direction = month, one cell per (year, month).
 *   Cell color  = monthly max or min temperature (click a cell to switch).
 *   Hover       = tooltip with the date and the max/min temperature.
 *   Legend      = color -> temperature mapping, right of the matrix.
 *
 * Level 2 reuses this exact renderer with `showDailyLines: true`, which adds a
 * mini line chart of daily temperatures inside each cell.
 */

import {
  MONTH_NAMES,
  TEMPERATURE_MODES,
  DEFAULT_MODE,
  TRANSITION_DURATION_MS,
  LEGEND_SETTINGS,
} from "./config.js";
import { drawColorLegend } from "./legend.js";
import { drawMiniLineCharts, computeDailyTemperatureExtent } from "./miniLineChart.js";

/* ----------------------------- helpers ---------------------------------- */

/** Format a monthly record's date as "YYYY-MM". */
function formatYearMonth(record) {
  return `${record.year}-${String(record.month + 1).padStart(2, "0")}`;
}

/** Tooltip text, e.g. "Date: 2002-03; max: 28 min: 14". */
function buildTooltipText(record, separator) {
  return (
    `Date: ${formatYearMonth(record)}${separator}` +
    `max: ${record.maxTemperature} min: ${record.minTemperature}`
  );
}

/** Return the next mode in TEMPERATURE_MODES (max -> min -> max ...). */
function getNextMode(currentMode) {
  const modeNames = Object.keys(TEMPERATURE_MODES);
  return modeNames[(modeNames.indexOf(currentMode) + 1) % modeNames.length];
}

/* --------------------------- drawing steps ------------------------------ */

/** Create the <svg> and the inner <g> already shifted by the margins. */
function createSvgCanvas(container, matrixWidth, matrixHeight, margin) {
  const svg = container
    .append("svg")
    .attr("width", matrixWidth + margin.left + margin.right)
    .attr("height", matrixHeight + margin.top + margin.bottom);

  return svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

/** Band scales that place each year (x) and month (y) in its own cell. */
function createMatrixScales(years, matrixWidth, matrixHeight, cellPadding) {
  const xScale = d3
    .scaleBand()
    .domain(years)
    .range([0, matrixWidth])
    .padding(cellPadding);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(MONTH_NAMES.length))
    .range([0, matrixHeight])
    .padding(cellPadding);

  return { xScale, yScale };
}

/** Year axis on top, month-name axis on the left (as in the reference). */
function drawAxes(chartGroup, xScale, yScale) {
  chartGroup
    .append("g")
    .attr("class", "axis axis-year")
    .call(d3.axisTop(xScale).tickFormat(d3.format("d")));

  chartGroup
    .append("g")
    .attr("class", "axis axis-month")
    .call(d3.axisLeft(yScale).tickFormat((monthIndex) => MONTH_NAMES[monthIndex]));
}

/** One <g> per month, holding the colored background rectangle. */
function drawCells(chartGroup, monthlyRecords, xScale, yScale, cornerRadius) {
  const cellGroups = chartGroup
    .append("g")
    .attr("class", "cells")
    .selectAll("g.month-cell")
    .data(monthlyRecords)
    .join("g")
    .attr("class", "month-cell")
    .attr("transform", (d) => `translate(${xScale(d.year)}, ${yScale(d.month)})`);

  cellGroups
    .append("rect")
    .attr("class", "cell-background")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("rx", cornerRadius)
    .attr("ry", cornerRadius);

  return cellGroups;
}

/** Caption above the chart telling the user which value is shown. */
function createModeCaption(container) {
  return container.insert("p", ":first-child").attr("class", "mode-caption");
}

/* ---------------------------- public API -------------------------------- */

/**
 * Render a Year/Month temperature matrix.
 *
 * @param {Object}   options
 * @param {Array}    options.monthlyRecords - records from aggregateByMonth
 * @param {Object}   options.layout         - LEVEL1_LAYOUT or LEVEL2_LAYOUT
 * @param {Function} options.colorScale     - temperature -> color
 * @param {Object}   options.tooltip        - object from createTooltip
 */
export function renderTemperatureMatrix({ monthlyRecords, layout, colorScale, tooltip }) {
  const container = d3.select(layout.containerSelector);
  const years = [...new Set(monthlyRecords.map((d) => d.year))].sort(d3.ascending);

  const matrixWidth = years.length * layout.cellWidth;
  const matrixHeight = MONTH_NAMES.length * layout.cellHeight;

  const modeCaption = createModeCaption(container);
  const chartGroup = createSvgCanvas(container, matrixWidth, matrixHeight, layout.margin);
  const { xScale, yScale } = createMatrixScales(
    years, matrixWidth, matrixHeight, layout.cellPadding
  );

  drawAxes(chartGroup, xScale, yScale);
  const cellGroups = drawCells(
    chartGroup, monthlyRecords, xScale, yScale, layout.cornerRadius
  );

  // Level 2: add daily max/min mini line charts inside each cell.
  if (layout.showDailyLines) {
    drawMiniLineCharts(
      cellGroups,
      xScale.bandwidth(),
      yScale.bandwidth(),
      computeDailyTemperatureExtent(monthlyRecords)
    );
  }

  drawColorLegend(chartGroup, colorScale, matrixWidth + LEGEND_SETTINGS.offsetFromMatrix);

  /* --------------------- state + interactions --------------------------- */

  let currentMode = DEFAULT_MODE;

  /** Recolor every cell for the current mode and update the caption. */
  function applyMode(animate) {
    const valueKey = TEMPERATURE_MODES[currentMode].key;
    const backgrounds = cellGroups.select("rect.cell-background");
    (animate ? backgrounds.transition().duration(TRANSITION_DURATION_MS) : backgrounds)
      .attr("fill", (record) => colorScale(record[valueKey]));

    modeCaption.html(
      `Showing: <strong>${TEMPERATURE_MODES[currentMode].label}</strong>` +
        ` &mdash; click any cell to switch between max and min.`
    );
  }

  cellGroups
    .on("mouseover", (event, record) =>
      tooltip.show(event, buildTooltipText(record, layout.tooltipSeparator)))
    .on("mousemove", (event) => tooltip.move(event))
    .on("mouseout", () => tooltip.hide())
    .on("click", () => {
      currentMode = getNextMode(currentMode);
      applyMode(true);
    });

  applyMode(false);
}
