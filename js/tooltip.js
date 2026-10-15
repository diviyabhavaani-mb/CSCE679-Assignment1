/**
 * tooltip.js
 * ---------------------------------------------------------------------------
 * A small reusable tooltip: one absolutely-positioned <div> that follows the
 * mouse. Charts call show()/move()/hide() from their mouse event handlers.
 */

import { TOOLTIP_OFFSET } from "./config.js";

/**
 * Create a tooltip attached to <body>.
 * @returns {{show: Function, move: Function, hide: Function}}
 */
export function createTooltip(offset = TOOLTIP_OFFSET) {
  const tooltipElement = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /** Place the tooltip next to the mouse pointer. */
  function move(event) {
    tooltipElement
      .style("left", `${event.pageX + offset.x}px`)
      .style("top", `${event.pageY + offset.y}px`);
  }

  /** Display `text` near the pointer. */
  function show(event, text) {
    tooltipElement.text(text).style("opacity", 1);
    move(event);
  }

  /** Hide the tooltip. */
  function hide() {
    tooltipElement.style("opacity", 0);
  }

  return { show, move, hide };
}
