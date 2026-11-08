export function collectCatalogTexts(products) {
  const texts = new Set();
  const add = value => { if (typeof value === "string" && value.trim()) { texts.add(value); texts.add(value.trim()); } };
  for (const product of products) {
    [product.name, product.shortDescription, product.description].forEach(add);
    for (const category of product.categories ?? []) {
      add(category);
      category.split(">").map(part => part.trim()).forEach(add);
    }
    for (const [name, value] of Object.entries(product.attributes ?? {})) { add(name); add(value); }
    for (const line of (product.description ?? "").split(/\n+/)) {
      const pair = line.match(/^([^:：]{2,55})\s*[:：]\s*(.{1,500})$/);
      if (pair) { add(pair[1].trim()); add(pair[2].trim()); }
    }
  }
  return [...texts];
}
