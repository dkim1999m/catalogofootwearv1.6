import { appState } from "../models/state.js";
import { themeForBrand } from "./theme.js";
import { placeholderSVGDataURI, setResolvedImg, setResolvedImgNoWait, productImageBase } from "../models/assets.js";
import { waLink } from "../models/whatsapp.js";
import { openModal } from "../controllers/modal.js";

const $ = (id) => document.getElementById(id);

function money(n){ return "S/ " + Number(n).toFixed(2); }
function finalPrice(p){ return p.discount>0 ? Math.round((p.price*(1-p.discount/100))*100)/100 : p.price; }

function applyTheme(){
  const { themeBrand, brand } = appState.get();
  const t = themeForBrand(themeBrand);
  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--accent2", t.accent2);
  document.documentElement.style.setProperty("--wash", t.wash);

  $("posterTitle").textContent = t.title;
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  const active = document.querySelector(`.tab[data-brand="${themeBrand}"]`);
  if(active) active.classList.add("active");

  const brandSel = $("brand");
  if(brandSel){
    if(themeBrand === "All"){
      brandSel.disabled = false;
      brandSel.value = brand || "All";
    } else {
      brandSel.disabled = true;
      brandSel.value = themeBrand;
    }
  }
}

function passes(p, st){
  const q = (st.q||"").trim().toLowerCase();
  const qOk = (!q) || (
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q)
  );
  const bOk = (st.brand==="All") || (p.brand===st.brand);
  const cOk = (st.category==="All") || (p.category===st.category);
  const sOk = (st.size==="All") || ((p.sizes||[]).includes(Number(st.size)));
  return qOk && bOk && cOk && sOk;
}

function sortList(list, sort){
  const arr = list.slice();
  if(sort === "priceAsc") arr.sort((a,b)=>a.finalPrice-b.finalPrice);
  if(sort === "priceDesc") arr.sort((a,b)=>b.finalPrice-a.finalPrice);
  if(sort === "newest") arr.sort((a,b)=>(b.isNew?1:0)-(a.isNew?1:0));
  if(sort === "discount") arr.sort((a,b)=>(b.discount||0)-(a.discount||0));
  return arr;
}
function el(tag, cls){ const n=document.createElement(tag); if(cls) n.className=cls; return n; }

function brandClass(brand){
  return `brand-${String(brand||"").toLowerCase().replace(/[^a-z0-9]+/g,"-")}`;
}

export async function renderPosterOnly(){
  applyTheme();
  const { posterIndex, posterMap, themeBrand } = appState.get();
  const host = $("posterSlide");
  host.innerHTML = "";

  const list = posterMap[themeBrand] || posterMap.All || [];
  const entry = list[(posterIndex%3+3)%3] || list[0] || "";
  let src = "";
  let fit = "contain";
  let x = 50, y = 50;
  let bg = "";

  if(typeof entry === "string"){
    src = entry;
  } else if(entry && typeof entry === "object"){
    src = entry.src || "";
    fit = entry.fit || "contain";
    x = Number(entry.x ?? 50);
    y = Number(entry.y ?? 50);
    bg = entry.bg || "";
  }

  host.style.background = bg || "transparent";

  const img = document.createElement("img");
  img.alt = `Poster ${themeBrand}`;
  img.loading = "eager";
  img.style.objectFit = fit;
  img.style.objectPosition = `${x}% ${y}%`;

  const fallback = placeholderSVGDataURI(themeBrand === "All" ? "Poster General" : `Poster ${themeBrand}`);
  await setResolvedImg(img, src || "", fallback);
  host.appendChild(img);
}

function buildCard(p){
  const cls = brandClass(p.brand);
  const cfg = themeForBrand(p.brand);
  const card = el("article", `card brandCard ${cls}`);
  card.style.background = `linear-gradient(180deg, ${cfg.wash || "rgba(2,6,23,.04)"} 0%, rgba(255,255,255,.98) 100%)`;

  const imgWrap = el("div","img");
  const img = document.createElement("img");
  img.alt = p.name;
  img.loading = "lazy";
  const fallback = placeholderSVGDataURI(p.brand);
  setResolvedImgNoWait(img, productImageBase(p.brand, p.sku, p.coverSlot || 1), fallback);
  imgWrap.appendChild(img);

  const body = el("div","body");
  const badges = el("div","badges");
  const brandBadgeStyle = `background:${cfg.wash || "rgba(2,6,23,.05)"};border-color:${cfg.accent || "#16a34a"}44;color:#1f2937`;
  badges.innerHTML = `<span class="badge badge-brand ${cls}" style="${brandBadgeStyle}">${p.brand}</span><span class="badge">${p.category}</span>` +
    (p.isNew ? `<span class="badge badge--new">NEW</span>` : "") +
    (p.discount>0 ? `<span class="badge badge--sale">-${p.discount}%</span>` : "");

  const name = el("h3","name"); name.textContent = p.name;
  const meta = el("div","meta"); meta.innerHTML = `SKU: <b>${p.sku}</b> &nbsp; | &nbsp; ★ <b>${Number(p.rating).toFixed(1)}</b>`;

  const priceRow = el("div","priceRow");
  const price = el("div","price");
  price.innerHTML = money(p.finalPrice) + (p.discount>0 ? ` <span class="old">${money(p.price)}</span>` : "");
  const sizesTxt = el("div","meta");
  const available = (p.sizes||[]).filter(s => !(p.soldOutSizes||[]).includes(Number(s)));
  sizesTxt.innerHTML = `Tallas: <b>${available.slice(0,4).join(" ")}</b>...`;
  priceRow.appendChild(price);
  priceRow.appendChild(sizesTxt);

  const actions = el("div","actions");
  const btnView = el("button","btn");
  btnView.type = "button";
  btnView.textContent = "Ver";
  btnView.addEventListener("click", (e)=>{ e.stopPropagation(); openModal(p.id || p.sku); });

  const aWa = el("a","btn btn--primary");
  aWa.href = waLink(p, null);
  aWa.target = "_blank";
  aWa.rel = "noopener";
  aWa.textContent = "WhatsApp";

  actions.appendChild(btnView);
  actions.appendChild(aWa);

  body.appendChild(badges);
  body.appendChild(name);
  body.appendChild(meta);
  body.appendChild(priceRow);
  body.appendChild(actions);

  card.appendChild(imgWrap);
  card.appendChild(body);

  card.addEventListener("click", (e)=>{ if(e.target?.tagName==="A" || e.target?.tagName==="BUTTON") return; openModal(p.id || p.sku); });
  return card;
}

export function renderGridOnly(){
  applyTheme();
  const st = appState.get();
  const products = st.products.map(p => ({...p, finalPrice: finalPrice(p)}));
  let list = products.filter(p => passes(p, st));
  list = sortList(list, st.sort);

  const grid = $("grid");
  grid.innerHTML = "";
  if(!list.length){
    const empty = el("div","empty");
    empty.innerHTML = "<b>No hay resultados.</b>";
    grid.appendChild(empty);
  } else {
    const frag = document.createDocumentFragment();
    for(const p of list) frag.appendChild(buildCard(p));
    grid.appendChild(frag);
  }
  $("fab").href = `https://wa.me/51927137867?text=${encodeURIComponent("Hola, quiero información del catálogo de calzado.")}`;
}

export async function render(){
  renderGridOnly();
  await renderPosterOnly();
}