function normalizeStockBySize(sizes, stockBySize={}, soldOutSizes=[]){
  const sold = new Set((soldOutSizes||[]).map(x => Number(x)));
  const out = {};
  for(const size of (sizes||[])){
    const key = String(size);
    let value = 0;
    if(stockBySize && typeof stockBySize === "object" && stockBySize[key] !== undefined) value = Number(stockBySize[key] || 0);
    else value = sold.has(Number(size)) ? 0 : 5;
    out[key] = Math.max(0, Number.isFinite(value) ? value : 0);
  }
  return out;
}

export async function loadProducts(){
  const res = await fetch("src/data/products.json", { cache: "no-store" });
  if(!res.ok) throw new Error("No se pudo cargar products.json");
  const data = await res.json();
  return data.map(p => {
    const sizes = Array.isArray(p.sizes) ? p.sizes.map(Number) : [];
    const soldOutSizes = Array.isArray(p.soldOutSizes) ? p.soldOutSizes.map(Number) : [];
    const stockBySize = normalizeStockBySize(sizes, p.stockBySize || {}, soldOutSizes);
    const derivedSoldOut = Object.entries(stockBySize)
      .filter(([,qty]) => Number(qty) <= 0)
      .map(([size]) => Number(size));
    return {
      id: p.id || `${p.brand}:${p.sku}`,
      brand: p.brand,
      sku: String(p.sku).trim(),
      name: p.name,
      category: p.category,
      price: Number(p.price),
      discount: Number(p.discount||0),
      isNew: !!p.isNew,
      rating: Number(p.rating||0),
      sizes,
      soldOutSizes: derivedSoldOut,
      stockBySize,
      coverSlot: Number(p.coverSlot || 1)
    };
  });
}
