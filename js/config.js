/**
 * config.js
 * ---------------------------------------------------------------------------
 * Central place for every tunable setting used by the visualizations.
 * Change values here (data path, sizes, colors, number of years, ...) instead
 * of editing the drawing code. No other module contains hard-coded numbers
 * for layout or styling.
 */

/** Location of the daily temperature data (relative to index.html). */
export const DATA_PATH = "data/temperature_daily.csv";

/** Full month names, index 0 = January. Used for the y-axis labels. */
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * The two temperature views the user can switch between by clicking a cell.
 * - key:    property name on each monthly record that holds the value
 * - label:  text shown in the chart caption
 */
export const TEMPERATURE_MODES = {
  max: { key: "maxTemperature", label: "Monthly maximum temperature" },
  min: { key: "minTemperature", label: "Monthly minimum temperature" },
};

/** Mode shown when the page first loads. */
export const DEFAULT_MODE = "max";

/**
 * Color scale settings.
 * The reference images use the "Spectral" color scheme quantized into 11
 * buckets: purple/blue for cold (0 °C) through dark red for hot (40 °C).
 */
export const COLOR_SCALE_SETTINGS = {
  // °C range split evenly into the color buckets. [0, 39] reproduces the
  // bucket boundaries seen in the reference images (e.g. 35 °C = red,
  // 36 °C = dark red; 21 °C = pale yellow, 22 °C = light orange).
  temperatureDomain: [0, 39],
  numberOfColorSteps: 11,     // number of discrete color buckets
  legendEndLabels: [0, 40],   // values printed at the legend's top / bottom
  unitLabel: "Celsius",       // text appended to the legend end labels
};

/** Settings for the color legend drawn to the right of each matrix. */
export const LEGEND_SETTINGS = {
  offsetFromMatrix: 25, // horizontal gap between matrix and legend (px)
  swatchWidth: 20,      // width of each color block (px)
  swatchHeight: 22,     // height of each color block (px)
  labelOffset: 4,       // gap between swatch column and labels (px)
  fontSize: 12,         // label font size (px)
};

/** Styling for the two mini line charts drawn inside Level 2 cells. */
export const MINI_LINE_CHART_SETTINGS = {
  maxLineColor: "#31a354",  // green line = daily maximum
  minLineColor: "#a6bddb",  // light blue line = daily minimum
  lineWidth: 1.6,           // stroke width (px)
  innerPadding: 4,          // padding between cell border and lines (px)
  daysInLongestMonth: 31,   // x-axis domain end for every mini chart
};

/** Timing used for the color transition when switching max/min. */
export const TRANSITION_DURATION_MS = 400;

/** Pixel offset of the tooltip from the mouse pointer. */
export const TOOLTIP_OFFSET = { x: 12, y: -28 };

/**
 * Layout for Level 1: the year/month heatmap over ALL years.
 * yearsToShow = null means "use every year in the data".
 */
export const LEVEL1_LAYOUT = {
  containerSelector: "#level1-chart",
  yearsToShow: null,
  cellWidth: 41,
  cellHeight: 37,
  cellPadding: 0.12,          // fraction of each band left empty (gap)
  cornerRadius: 1,
  margin: { top: 30, right: 140, bottom: 20, left: 80 },
  showDailyLines: false,
  tooltipSeparator: "; ",     // matches "Date: 2002-03; max: 28 min: 14"
};

/**
 * Layout for Level 2: the same matrix restricted to the most recent years,
 * with a mini line chart of daily max/min temperatures inside each cell.
 */
export const LEVEL2_LAYOUT = {
  containerSelector: "#level2-chart",
  yearsToShow: 10,
  cellWidth: 97,
  cellHeight: 72,
  cellPadding: 0.2,
  cornerRadius: 0,
  margin: { top: 30, right: 140, bottom: 20, left: 80 },
  showDailyLines: true,
  tooltipSeparator: ", ",     // matches "Date: 2012-04, max: 31 min: 28"
};
