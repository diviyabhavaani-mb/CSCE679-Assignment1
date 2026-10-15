/**
 * colorScale.js
 * ---------------------------------------------------------------------------
 * Builds the temperature -> color mapping shared by both levels and the legend.
 */

import { COLOR_SCALE_SETTINGS } from "./config.js";

/**
 * Create a quantized color scale for temperatures.
 *
 * d3.schemeSpectral runs dark red -> purple, so it is reversed to make
 * cold temperatures purple/blue and hot temperatures dark red.
 *
 * @returns {d3.ScaleQuantize} scale(temperature) -> color string
 */
export function createTemperatureColorScale(settings = COLOR_SCALE_SETTINGS) {
  const colors = [...d3.schemeSpectral[settings.numberOfColorSteps]].reverse();
  return d3
    .scaleQuantize()
    .domain(settings.temperatureDomain)
    .range(colors);
}
