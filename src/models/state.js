export const appState = (() => {
  const s = {
    q: "",
    themeBrand: "All",
    brand: "All",
    category: "All",
    size: "All",
    sort: "relevance",
    products: [],
    posterIndex: 0,
    brands: ["All"],
    posterMap: { All: [] }
  };

  const listeners = new Set();
  const notify = (type="all") => listeners.forEach(fn => fn({...s}, type));

  return {
    get: () => ({...s}),
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    setProducts: (products) => { s.products = products; notify("grid"); },
    setBrands: (brands) => { s.brands = ["All", ...brands.filter(Boolean)]; notify("theme"); },
    setPosterMap: (posterMap) => { s.posterMap = posterMap || { All: [] }; notify("poster"); },
    setQuery: (q) => { s.q = q; notify("grid"); },
    setThemeBrand: (b) => {
      s.themeBrand = b;
      s.posterIndex = 0;
      s.brand = (b === "All") ? "All" : b;
      notify("theme");
    },
    posterNext: (dir=1) => {
      s.posterIndex = (s.posterIndex + dir + 3) % 3;
      notify("poster");
    },
    set: (patch, type="grid") => {
      Object.assign(s, patch);
      notify(type);
    }
  };
})();