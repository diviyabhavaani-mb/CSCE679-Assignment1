/**
 * main.js
 * ---------------------------------------------------------------------------
 * Entry point: load the data once, then render Level 1 and Level 2.
 * To add another view, define a layout in config.js and call
 * renderTemperatureMatrix with it here.
 */

import { DATA_PATH, LEVEL1_LAYOUT, LEVEL2_LAYOUT } from "./config.js";
import { loadDailyTemperatures, aggregateByMonth, filterToRecentYears } from "./dataLoader.js";
import { createTemperatureColorScale } from "./colorScale.js";
import { createTooltip } from "./tooltip.js";
import { renderTemperatureMatrix } from "./matrixHeatmap.js";

async function main() {
  const dailyRecords = await loadDailyTemperatures(DATA_PATH);
  const monthlyRecords = aggregateByMonth(dailyRecords);

  // Shared by both charts so the same color always means the same temperature.
  const colorScale = createTemperatureColorScale();
  const tooltip = createTooltip();

  for (const layout of [LEVEL1_LAYOUT, LEVEL2_LAYOUT]) {
    renderTemperatureMatrix({
      monthlyRecords: filterToRecentYears(monthlyRecords, layout.yearsToShow),
      layout,
      colorScale,
      tooltip,
    });
  }
}

main().catch((error) => {
  console.error("Failed to build the visualizations:", error);
  d3.select("body")
    .append("p")
    .attr("class", "error-message")
    .text("Could not load data. Serve this folder over HTTP (see README).");
});
