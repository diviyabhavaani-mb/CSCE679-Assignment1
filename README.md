# CSCE 679 Data Visualization — Assignment 1
## Hong Kong Temperature: Year/Month Matrix View (Level 1 & Level 2)

Interactive D3.js (v7) visualizations of daily Hong Kong temperatures (1997–2017) from `data/temperature_daily.csv`.

| Level 1 — monthly heatmap (all years) | Level 2 — last 10 years + daily lines |
|---|---|
| ![Level 1](screenshots/level1.png) | ![Level 2](screenshots/level2.png) |

### Features
**Level 1 – Year/Month Heatmap**
- x direction = year, y direction = month; one cell per month of each year.
- Cell color = monthly **maximum** temperature (highest daily max) by default.
- **Click any cell** to switch between maximum and minimum (lowest daily min) temperature; the caption above the chart shows the current mode.
- **Hover** a cell to see a tooltip with the date and values, e.g. `Date: 2002-03; max: 28 min: 14`.
- A **color legend** (0–40 °C, Spectral scheme, 11 steps) maps colors to temperatures.

**Level 2 – Improved Heatmap (2008–2017)**
- Same matrix, tooltip, click-to-switch and legend, limited to the last 10 years.
- Each cell contains a **mini line chart**: x = day of month, y = temperature. The **green** line is the daily maximum, the **light-blue** line the daily minimum. All mini charts share one y-scale so they are comparable across cells.

### Project structure
```
├── index.html            # Page layout; loads D3 and js/main.js
├── css/style.css         # Presentation styles (fonts, tooltip, axes)
├── data/temperature_daily.csv
├── js/
│   ├── config.js         # ALL settings: data path, sizes, colors, years shown, ...
│   ├── dataLoader.js     # Load CSV, aggregate daily -> monthly, filter recent years
│   ├── colorScale.js     # Temperature -> color scale (shared by charts + legend)
│   ├── legend.js         # Vertical color legend
│   ├── tooltip.js        # Reusable hover tooltip
│   ├── miniLineChart.js  # Level 2 daily max/min lines inside each cell
│   ├── matrixHeatmap.js  # Year/Month matrix renderer used by both levels
│   └── main.js           # Entry point: load data once, render both levels
└── screenshots/          # Images used in this README
```

**Design notes (maintainability)**
- Level 1 and Level 2 use the **same renderer** (`renderTemperatureMatrix`); they differ only by their layout objects (`LEVEL1_LAYOUT`, `LEVEL2_LAYOUT`) in `config.js`.
- No magic numbers in drawing code — cell sizes, margins, padding, colors, number of years, legend sizes and transition timing are all constants in `config.js`.
- Examples: change `LEVEL2_LAYOUT.yearsToShow` to `5` to show 5 years; change `COLOR_SCALE_SETTINGS.numberOfColorSteps` for more/fewer color buckets; add a new view by defining a new layout and passing it to `renderTemperatureMatrix` in `main.js`.

### How to run
The page loads the CSV with `fetch`, so it must be served over HTTP (opening `index.html` directly from disk will not work).

```bash
# from the repository folder
python -m http.server 8000
# then open http://localhost:8000
```
Or enable **GitHub Pages** (Settings → Pages → Deploy from branch `main`, root) and open the published URL.

### Data notes
- The color of a cell uses the monthly extreme: max mode = highest daily maximum in the month, min mode = lowest daily minimum.
- The dataset ends on 2017-10-28 and has some missing days (e.g. parts of 2000); months without data are left blank and mini lines simply connect the available days.
