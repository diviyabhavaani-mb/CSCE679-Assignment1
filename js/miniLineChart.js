/**
 * miniLineChart.js
 * ---------------------------------------------------------------------------
 * Level 2 enhancement: draws two small line charts inside every matrix cell,
 * one for the daily maximum and one for the daily minimum temperature.
 *   x direction = day of the month (1..31)
 *   y direction = temperature (shared scale across all cells so lines are
 *                 comparable between months and years)
 */

import { MINI_LINE_CHART_SETTINGS } from "./config.js";

/**
 * Compute the overall temperature range of all days in the given months.
 * Used as the shared y-domain of every mini chart.
 */
export function computeDailyTemperatureExtent(monthlyRecords) {
  const allDays = monthlyRecords.flatMap((record) => record.dailyRecords);
  return [
    d3.min(allDays, (day) => day.minTemperature),
    d3.max(allDays, (day) => day.maxTemperature),
  ];
}

/**
 * Append max/min line paths to every cell group.
 *
 * @param {d3.Selection} cellGroups - one <g> per monthly record (bound data)
 * @param {number} cellWidth  - inner width of a cell (px)
 * @param {number} cellHeight - inner height of a cell (px)
 * @param {[number, number]} temperatureExtent - shared y-domain
 */
export function drawMiniLineCharts(
  cellGroups,
  cellWidth,
  cellHeight,
  temperatureExtent,
  settings = MINI_LINE_CHART_SETTINGS
) {
  const padding = settings.innerPadding;

  const dayScale = d3
    .scaleLinear()
    .domain([1, settings.daysInLongestMonth])
    .range([padding, cellWidth - padding]);

  const temperatureScale = d3
    .scaleLinear()
    .domain(temperatureExtent)
    .range([cellHeight - padding, padding]);

  /** Build a line generator for one temperature field. */
  const createLineGenerator = (temperatureKey) =>
    d3
      .line()
      .x((day) => dayScale(day.day))
      .y((day) => temperatureScale(day[temperatureKey]));

  const lineDefinitions = [
    { key: "maxTemperature", color: settings.maxLineColor, className: "line-max" },
    { key: "minTemperature", color: settings.minLineColor, className: "line-min" },
  ];

  for (const { key, color, className } of lineDefinitions) {
    const lineGenerator = createLineGenerator(key);
    cellGroups
      .append("path")
      .attr("class", `mini-line ${className}`)
      .attr("d", (monthRecord) => lineGenerator(monthRecord.dailyRecords))
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", settings.lineWidth);
  }
}
