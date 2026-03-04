let BRAND_THEME = {};

export async function loadBrandTheme() {
  const res = await fetch("src/data/brand-settings.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar brand-settings.json");
  BRAND_THEME = await res.json();
  return BRAND_THEME;
}

export function themeForBrand(brand){
  return BRAND_THEME[brand] || {
    bg:"#f5f7fb",
    accent:"#16a34a",
    accent2:"#60a5fa",
    wash:"rgba(2,6,23,.04)",
    title:`Catálogo ${brand}`,
    effect:"bubbles"
  };
}