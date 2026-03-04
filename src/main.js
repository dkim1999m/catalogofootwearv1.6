import { appState } from "./models/state.js";
import { loadProducts } from "./models/products.js";
import { loadBrands, loadPosterMap } from "./models/meta.js";
import { loadBrandTheme } from "./views/theme.js";
import { initUI } from "./controllers/ui.js";
import { render } from "./views/render.js";

async function boot(){
  await loadBrandTheme();

  const [products, brands, posterMap] = await Promise.all([
    loadProducts(),
    loadBrands(),
    loadPosterMap()
  ]);

  appState.setProducts(products);
  appState.setBrands(brands);
  appState.setPosterMap(posterMap);

  initUI();
  render();
}

boot();