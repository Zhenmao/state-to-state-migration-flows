function processData(csv, us) {
  const idByName = new Map(
    us.objects.states.geometries.map((d) => [d.properties.name, d.id])
  );

  // prettier-ignore
  const abbrById = {
    "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", 10: "DE", 11: "DC", 12: "FL", 13: "GA", 15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA", 23: "ME", 24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE", 32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH", 40: "OK", 41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD", 47: "TN", 48: "TX", 49: "UT", 50: "VT", 51: "VA", 53: "WA", 54: "WV", 55: "WI", 56: "WY",
  };
  us.objects.states.geometries.forEach(
    (d) => (d.properties.abbr = abbrById[d.id])
  );

  const links = [];
  csv.forEach((d) => {
    const target = d.name;
    Object.keys(d)
      .filter((key) => key !== "name")
      .forEach((source) => {
        const value = d[source];
        if (value !== "N/A" && +value > 0) {
          links.push({
            source: idByName.get(source),
            target: idByName.get(target),
            value: +value,
          });
        }
      });
  });

  const inbounds = d3.group(links, (d) => d.target);
  const outbounds = d3.group(links, (d) => d.source);

  const nodes = csv.map((d) => {
    const name = d.name;
    const id = idByName.get(name);
    return {
      name,
      id,
      inbounds: inbounds
        .get(id)
        .sort((a, b) => d3.descending(a.value, b.value)),
      inboundsTotal: d3.sum(inbounds.get(id), (d) => d.value),
      outbounds: outbounds
        .get(id)
        .sort((a, b) => d3.descending(a.value, b.value)),
      outboundsTotal: d3.sum(outbounds.get(id), (d) => d.value),
    };
  });

  return { nodes, links };
}
