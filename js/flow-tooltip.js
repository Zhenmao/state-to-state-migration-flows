class FlowTooltip {
  constructor({ container, color }) {
    this.container = container;
    this.color = color;
    this.init();
  }

  init() {
    this.tooltip = this.container
      .append("div")
      .attr("class", "tooltip-container card shadow");
    this.row = this.tooltip
      .append("div")
      .attr("class", "card-body")
      .append("div")
      .attr("class", "row gx-2 gy-1");
    this.outboundName = this.row
      .append("div")
      .attr("class", "col-6 location-name text-start");
    this.inboundName = this.row
      .append("div")
      .attr("class", "col-6 location-name text-end");
    this.renderArrowMaker();
    this.outboundPie = new FlowPie({
      container: this.row.append("div").attr("class", "col-4 text-start"),
      color: this.color("outbound"),
    });
    this.value = this.row
      .append("div")
      .attr(
        "class",
        "col-4 flow-value d-flex justify-content-center align-items-center"
      );
    this.inboundPie = new FlowPie({
      container: this.row.append("div").attr("class", "col-4 text-end"),
      color: this.color("inbound"),
    });
    this.row
      .append("div")
      .attr("class", "col-6 text-start direction-name")
      .text("of outbounds");
    this.row
      .append("div")
      .attr("class", "col-6 text-end direction-name")
      .text("of inbounds");
  }

  renderArrowMaker() {
    const container = this.row
      .append("div")
      .attr("class", "col-12")
      .append("div");
    const width = container.node().clientWidth;
    container
      .append("svg")
      .style("display", "block")
      .attr("width", width)
      .attr("height", 6)
      .call((svg) =>
        svg
          .append("defs")
          .append("marker")
          .attr("id", "tooltip-arrowhead")
          .attr("viewBox", "0 0 10 10")
          .attr("refX", 10)
          .attr("refY", 5)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .attr("markerUnits", "userSpaceOnUse")
          .append("path")
          .attr("d", "M0,0L10,5L0,10")
      )
      .call((svg) =>
        svg
          .append("line")
          .attr("x1", 0)
          .attr("y1", 3)
          .attr("x2", width)
          .attr("y2", 3)
          .attr("stroke", "currentColor")
          .attr("marker-end", "url(#tooltip-arrowhead)")
      );
  }

  show(d) {
    this.outboundName.text(d.source.name);
    this.inboundName.text(d.target.name);
    this.value.text(d3.format(",")(d.value));
    this.outboundPie.onValueChange(d.value / d.source.outboundsTotal);
    this.inboundPie.onValueChange(d.value / d.target.inboundsTotal);

    this.tooltipBox = this.tooltip.node().getBoundingClientRect();
    this.containerBox = this.container.node().getBoundingClientRect();

    this.tooltip.classed("is-visible", true);
  }

  hide() {
    this.tooltip.classed("is-visible", false);
  }

  move(event) {
    const [x0, y0] = d3.pointer(event, this.container.node());

    let x = x0 - this.tooltipBox.width / 2;
    if (x < 0) {
      x = 0;
    } else if (x + this.tooltipBox.width > this.containerBox.width) {
      x = this.containerBox.width - this.tooltipBox.width;
    }

    let y = y0 - this.tooltipBox.height - 8;
    if (y < 0) {
      y = y0 + 8;
    }

    this.tooltip.style("transform", `translate(${x}px,${y}px)`);
  }
}
