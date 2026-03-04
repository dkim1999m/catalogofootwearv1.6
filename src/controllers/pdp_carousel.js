import { productImageBase, placeholderSVGDataURI, setResolvedImg } from "../models/assets.js";

export function createCarousel(product){
  const wrap = document.createElement("div");
  wrap.className = "pdpGallery";

  const thumbs = document.createElement("div");
  thumbs.className = "pdpThumbs";

  const stage = document.createElement("div");
  stage.className = "pdpStage";

  const main = document.createElement("img");
  main.alt = product.name;
  main.loading = "eager";
  stage.appendChild(main);

  const fallback = placeholderSVGDataURI(product.brand);
  let idx = Math.max(0, (Number(product.coverSlot||1)-1));
  const sources = [1,2,3].map(n => ({ slot:n, base: productImageBase(product.brand, product.sku, n) }));
  const thumbBtns = [];

  async function show(i){
    idx = (i+3)%3;
    thumbBtns.forEach(x => x.classList.remove("active"));
    thumbBtns[idx].classList.add("active");
    await setResolvedImg(main, sources[idx].base, fallback);
  }

  sources.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pdpThumb";
    const im = document.createElement("img");
    im.alt = `${product.name} mini ${i+1}`;
    im.loading = "lazy";
    setResolvedImg(im, src.base, fallback);
    btn.appendChild(im);
    btn.addEventListener("click", (e)=>{ e.stopPropagation(); show(i); });
    thumbBtns.push(btn);
    thumbs.appendChild(btn);
  });

  const prev = document.createElement("button");
  prev.className = "navBtn prev"; prev.type = "button"; prev.textContent = "‹";
  prev.addEventListener("click", (e)=>{ e.stopPropagation(); show(idx-1); });
  const next = document.createElement("button");
  next.className = "navBtn next"; next.type = "button"; next.textContent = "›";
  next.addEventListener("click", (e)=>{ e.stopPropagation(); show(idx+1); });

  stage.appendChild(prev); stage.appendChild(next);
  wrap.appendChild(thumbs); wrap.appendChild(stage);

  let auto = setInterval(()=>show(idx+1), 3400);
  wrap.addEventListener("mouseenter", ()=>clearInterval(auto));
  wrap.addEventListener("mouseleave", ()=> auto = setInterval(()=>show(idx+1), 3400));

  show(idx);
  return wrap;
}