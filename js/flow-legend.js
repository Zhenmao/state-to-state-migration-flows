class FlowLegend {
  constructor({ container, color, x, flowValues, tickValues }) {
    this.container = container;
    this.color = color;
    this.x = x;
    this.flowValues = flowValues;
    this.tickValues = tickValues;
    this.flowPath = this.flowPath.bind(this);
    this.init();
  }

  init() {
    this.margin = {
      top: 0,
      right: 56,
      bottom: 16,
      left: 1,
    };
    this.width = 160;
    this.rowHeight = 24;
    this.height =
      this.rowHeight * this.flowValues.length +
      this.margin.top +
      this.margin.bottom;

    this.y = d3
      .scalePoint()
      .domain(this.flowValues)
      .range([this.margin.top, this.height - this.margin.bottom])
      .padding(0.5);

    this.container.classed("flow-legend", true);

    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.defs = this.svg.append("defs");
    this.defineGradient();
    this.defineMarker();

    this.render();
  }

  defineGradient() {
    this.defs
      .append("linearGradient")
      .attr("id", "flow-legend-gradient")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 1)
      .attr("y2", 0)
      .selectAll("stop")
      .data(this.color.domain())
      .join("stop")
      .attr("stop-color", (d) => this.color(d))
      .attr("offset", (d, i) => (i ? "100%" : "25%"));
  }

  defineMarker() {
    this.defs
      .append("marker")
      .attr("id", "flow-legend-arrowhead")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,0L10,5L0,10");
  }

  render() {
    const tick = this.svg
      .selectAll(".flow-legend__tick")
      .data(this.tickValues)
      .join("g")
      .attr("class", "flow-legend__tick")

      .attr(
        "transform",
        (d, i) =>
          `translate(${
            i ? this.width - this.margin.right : this.margin.left
          },0)`
      );
    tick.append("line").attr("y1", this.margin.top).attr("y2", this.height);
    tick
      .append("text")
      .attr("x", 4)
      .attr("y", this.height - 4)
      .text((d) => d);

    const flow = this.svg
      .selectAll(".flow-legend__flow")
      .data(this.flowValues)
      .join("g")
      .attr("class", "flow-legend__flow")
      .attr("transform", (d) => `translate(0,${this.y(d)})`);
    flow
      .append("path")
      .attr("d", this.flowPath)
      .attr("fill", "url(#flow-legend-gradient)");
    flow
      .append("line")
      .attr("x1", this.margin.left)
      .attr("x2", this.width - this.margin.right)
      .attr("marker-end", "url(#flow-legend-arrowhead)");
    flow
      .append("text")
      .attr("x", this.width - this.margin.right + 4)
      .attr("dy", "0.32em")
      .text((d) => d3.format(",")(d));
  }

  flowPath(d) {
    const h = this.x(d);
    const x0 = this.margin.left;
    const x1 = this.width - this.margin.right;
    return `M${x0},0L${x1},${-h / 2}L${x1},${h / 2}Z`;
  }
}
