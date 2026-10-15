/**
 * legend.js
 * ---------------------------------------------------------------------------
 * Draws the vertical color legend: a column of color swatches with the
 * coldest value labelled at the top and the hottest at the bottom,
 * as in the reference image ("0 Celsius" ... "40 Celsius").
 */

import { COLOR_SCALE_SETTINGS, LEGEND_SETTINGS } from "./config.js";

/**
 * @param {d3.Selection} parentGroup - <g> to draw the legend into
 * @param {d3.ScaleQuantize} colorScale - temperature color scale
 * @param {number} xPosition - x coordinate of the legend's left edge
 */
export function drawColorLegend(
  parentGroup,
  colorScale,
  xPosition,
  settings = LEGEND_SETTINGS,
  scaleSettings = COLOR_SCALE_SETTINGS
) {
  const legendColors = colorScale.range();
  const [lowestValue, highestValue] = scaleSettings.legendEndLabels;
  const legendHeight = legendColors.length * settings.swatchHeight;

  const legendGroup = parentGroup
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${xPosition}, 0)`);

  // One swatch per color bucket, coldest first (top).
  legendGroup
    .selectAll("rect")
    .data(legendColors)
    .join("rect")
    .attr("x", 0)
    .attr("y", (_, index) => index * settings.swatchHeight)
    .attr("width", settings.swatchWidth)
    .attr("height", settings.swatchHeight)
    .attr("fill", (color) => color);

  // End labels: lowest value at the top, highest value at the bottom.
  const labelX = settings.swatchWidth + settings.labelOffset;
  legendGroup
    .append("text")
    .attr("class", "legend-label")
    .attr("x", labelX)
    .attr("y", 0)
    .attr("dominant-baseline", "hanging")
    .style("font-size", `${settings.fontSize}px`)
    .text(`${lowestValue} ${scaleSettings.unitLabel}`);

  legendGroup
    .append("text")
    .attr("class", "legend-label")
    .attr("x", labelX)
    .attr("y", legendHeight)
    .attr("dominant-baseline", "hanging")
    .style("font-size", `${settings.fontSize}px`)
    .text(`${highestValue} ${scaleSettings.unitLabel}`);

  return legendGroup;
}
