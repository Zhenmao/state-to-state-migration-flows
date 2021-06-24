class RadiosControl {
  constructor({ container, label, name, options, initialValue, onChange }) {
    this.container = container;
    this.label = label;
    this.name = name;
    this.options = options;
    this.initialValue = initialValue;
    this.onChange = onChange;
    this.init();
  }

  init() {
    const fieldset = this.container.append("fieldset");
    fieldset
      .append("legend")
      .attr("class", "col-form-label col-form-label-sm")
      .text(this.label);
    const formCheck = fieldset
      .selectChildren(".form-check")
      .data(this.options)
      .join("div")
      .attr("class", "form-check form-check-inline py-1");
    formCheck
      .append("input")
      .attr("class", "form-check-input")
      .attr("type", "radio")
      .attr("name", this.name)
      .attr("id", (d) => d.id)
      .attr("value", (d) => d.value)
      .attr("checked", (d) => (d.value === this.initialValue ? "" : null))
      .on("change", (event) => {
        this.onChange(event.currentTarget.value);
      });
    formCheck
      .append("label")
      .attr("class", "form-check-label")
      .attr("for", (d) => d.id)
      .text((d) => d.text);
  }
}
