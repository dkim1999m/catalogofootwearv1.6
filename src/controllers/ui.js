import { appState } from "../models/state.js";
import { CATEGORIES, SIZES } from "../models/config.js";
import { playEffect } from "./poster_effects.js";
import { renderGridOnly, renderPosterOnly, render } from "../views/render.js";
import { closeModal } from "./modal.js";
import { themeForBrand } from "../views/theme.js";

const $ = (id)=>document.getElementById(id);
let posterTimer = null;

function brandsInSystem(){
  return appState.get().brands || ["All"];
}
function brandColor(brand){
  const cfg = themeForBrand(brand);
  return cfg.accent || "#16a34a";
}

function paintBrandControls(){
  const allBrands = brandsInSystem();
  const themeBrand = appState.get().themeBrand;
  const filterBrands = themeBrand === "All" ? allBrands : [themeBrand];

  $("brand").innerHTML = filterBrands.map(b => `<option value="${b}">${b==="All"?"Marca: Todas":b}</option>`).join("");
  $("brand").disabled = themeBrand !== "All";
  $("brand").value = themeBrand === "All" ? (appState.get().brand || "All") : themeBrand;

  const tabs = $("brandTabs");
  tabs.innerHTML = allBrands.map(b => {
    const label = b === "All" ? "General" : b;
    const isActive = appState.get().themeBrand === b;
    return `<button class="tab ${isActive ? "active" : ""}" type="button" data-brand="${b}"><span class="sw" style="--sw:${brandColor(b)}"></span>${label}</button>`;
  }).join("");

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const themeBrand = btn.getAttribute("data-brand");
      appState.setThemeBrand(themeBrand);
      const host = $("posterSlide");
      const cfg = themeForBrand(themeBrand);
      playEffect(host, cfg.effect || "bubbles");
      startPosterLoop();
    });
  });
}

export function initUI(){
  paintBrandControls();

  $("cat").innerHTML = CATEGORIES.map(c => `<option value="${c}">${c==="All"?"Categoría: Todas":c}</option>`).join("");
  $("size").innerHTML = SIZES.map(s => `<option value="${s}">${s==="All"?"Talla: Todas":s}</option>`).join("");

  $("posterPrev").addEventListener("click", ()=>{ appState.posterNext(-1); startPosterLoop(); });
  $("posterNext").addEventListener("click", ()=>{ appState.posterNext(1); startPosterLoop(); });

  $("q").addEventListener("input", e => appState.setQuery(e.target.value));
  $("apply").addEventListener("click", syncFromUI);
  $("brand").addEventListener("change", syncFromUI);
  $("cat").addEventListener("change", syncFromUI);
  $("size").addEventListener("change", syncFromUI);
  $("sort").addEventListener("change", syncFromUI);

  $("home").addEventListener("click", () => {
    $("q").value = "";
    $("cat").value = "All";
    $("size").value = "All";
    $("sort").value = "relevance";
    appState.set({ q:"", themeBrand:"All", brand:"All", category:"All", size:"All", sort:"relevance", posterIndex:0 }, "theme");
    const cfg = themeForBrand("All");
    playEffect($("posterSlide"), cfg.effect || "bubbles");
    window.scrollTo({top:0, behavior:"smooth"});
  });

  $("reset").addEventListener("click", () => {
    $("q").value = "";
    $("cat").value = "All";
    $("size").value = "All";
    $("sort").value = "relevance";
    const themeBrand = appState.get().themeBrand;
    appState.set({ q:"", brand: themeBrand==="All" ? "All" : themeBrand, category:"All", size:"All", sort:"relevance" }, "grid");
  });

  $("modal").addEventListener("click", (e)=>{ if(e.target?.getAttribute && e.target.getAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });

  appState.subscribe(async (_state, type) => {
    if(type === "poster") await renderPosterOnly();
    else if(type === "grid") renderGridOnly();
    else if(type === "theme"){ paintBrandControls(); renderGridOnly(); await renderPosterOnly(); }
    else await render();
  });

  const firstCfg = themeForBrand(appState.get().themeBrand || "All");
  playEffect($("posterSlide"), firstCfg.effect || "bubbles");
  startPosterLoop();
}

function syncFromUI(){
  const themeBrand = appState.get().themeBrand;
  appState.set({
    brand: themeBrand === "All" ? $("brand").value : themeBrand,
    category: $("cat").value,
    size: $("size").value,
    sort: $("sort").value
  }, "grid");
}

function startPosterLoop(){
  if(posterTimer) clearInterval(posterTimer);
  posterTimer = setInterval(()=> appState.posterNext(1), 4500);
}