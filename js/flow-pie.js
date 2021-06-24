class FlowPie {
  constructor({ container, color }) {
    this.container = container;
    this.color = color;
    this.init();
  }

  init() {
    this.margin = 1;
    this.width = 64;
    this.height = 52;
    this.radius = (this.width - this.margin * 2) / 2;

    this.x = d3
      .scaleLinear()
      .domain([0, 1])
      .range([-0.7 * Math.PI, 0.7 * Math.PI]);

    this.arcFill = d3
      .arc()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius)
      .startAngle(this.x(0))
      .endAngle((d) => this.x(d));

    this.arcOutline = d3
      .arc()
      .innerRadius(this.radius)
      .outerRadius(this.radius)
      .startAngle(this.x(0))
      .endAngle(this.x(1));

    this.svg = this.container
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [
        -this.width / 2,
        -this.width / 2,
        this.width,
        this.height,
      ]);

    this.fill = this.svg
      .append("path")
      .attr("class", "flow-pie__fill")
      .attr("fill", this.color);

    this.outline = this.svg
      .append("path")
      .attr("class", "flow-pie__outline")
      .attr("d", this.arcOutline());

    this.label = this.svg
      .append("text")
      .attr("class", "flow-pie__label")
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle");
  }

  formatValue(value) {
    if (value === 0) {
      return "0%";
    } else if (value < 0.001) {
      return "<0.1%";
    } else if (value < 0.1) {
      return d3.format(".1~%")(value);
    } else {
      return d3.format(".0%")(value);
    }
  }

  onValueChange(value) {
    this.fill.attr("d", this.arcFill(value));
    this.label.text(this.formatValue(value));
  }
}
