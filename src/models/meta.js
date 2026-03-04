export async function loadBrands(){
  const res = await fetch("src/data/brands.json", { cache: "no-store" });
  if(!res.ok) throw new Error("No se pudo cargar brands.json");
  return await res.json();
}

export async function loadPosterMap(){
  const res = await fetch("src/data/posters.json", { cache: "no-store" });
  if(!res.ok) throw new Error("No se pudo cargar posters.json");
  return await res.json();
}