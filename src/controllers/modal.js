import { appState } from "../models/state.js";
import { waLink } from "../models/whatsapp.js";
import { createCarousel } from "./pdp_carousel.js";

const $=(id)=>document.getElementById(id);
function findProduct(key){
  const { products } = appState.get();
  return products.find(x=>x.id===key) || products.find(x=>x.sku===key) || null;
}
function selectedQty(product, size){
  const map = product.stockBySize || {};
  return Number(map[String(size)] || 0);
}
export function openModal(productKey){
  const p=findProduct(productKey);
  if(!p) return;
  const modalBody=$("modalBody");
  modalBody.innerHTML="";

  const pdp=document.createElement("div");
  pdp.className="pdp";

  const left=document.createElement("div");
  left.className="left";
  const gallery=document.createElement("div");
  gallery.className="gallery";
  gallery.appendChild(createCarousel(p));
  left.appendChild(gallery);

  const right=document.createElement("div");
  right.className="right";

  const badges=document.createElement("div");
  badges.className="badges";
  badges.innerHTML=`<span class="badge">${p.brand}</span><span class="badge">${p.category}</span>` + (p.isNew?`<span class="badge badge--new">NEW</span>`:"") + (p.discount>0?`<span class="badge badge--sale">-${p.discount}%</span>`:"");

  const pname=document.createElement("h3");
  pname.className="pname";
  pname.textContent=p.name;

  const sub=document.createElement("div");
  sub.className="sub";
  sub.innerHTML=`SKU: <b>${p.sku}</b> &nbsp; | &nbsp; ★ <b>${Number(p.rating).toFixed(1)}</b>`;

  const hr1=document.createElement("div"); hr1.className="hr";
  const final=Number(p.finalPrice ?? p.price).toFixed(2);
  const priceLine=document.createElement("div");
  priceLine.className="price";
  priceLine.style.fontSize="28px";
  priceLine.innerHTML=`S/ ${final}` + (p.discount>0 ? ` <span class="old" style="font-size:13px">S/ ${Number(p.price).toFixed(2)}</span>` : "");

  const hr2=document.createElement("div"); hr2.className="hr";
  const sizeLabel=document.createElement("div");
  sizeLabel.className="sub";
  sizeLabel.style.marginTop="0";
  sizeLabel.innerHTML="Talla: <b id='selSize'>—</b> &nbsp; | &nbsp; Stock: <b id='selStock'>—</b>";

  const sizes=document.createElement("div");
  sizes.className="sizes";

  let chosenSize = null;
  const buy=document.createElement("a");
  buy.className="btn btn--primary";
  buy.target="_blank";
  buy.rel="noopener";
  buy.style.flex="1";
  buy.style.minWidth="220px";
  buy.textContent="Comprar por WhatsApp";
  buy.href=waLink(p,null);

  const setBuy=(size)=>{
    chosenSize = size || null;
    buy.href=waLink(p,size);
    const elSize=right.querySelector("#selSize");
    const elStock=right.querySelector("#selStock");
    if(elSize) elSize.textContent=size?String(size):"—";
    if(elStock) elStock.textContent=size?String(selectedQty(p,size)):"—";
    if(typeof syncLinks === "function") syncLinks(size);
  };

  const soldOut=(p.soldOutSizes||[]).map(Number);
  for(const size of (p.sizes||[])){
    const qty = selectedQty(p, size);
    const b=document.createElement("button");
    b.type="button";
    b.className="size";
    b.textContent=String(size);
    b.title = qty > 0 ? `Stock: ${qty}` : "Agotado";
    if(soldOut.includes(Number(size)) || qty <= 0){
      b.classList.add("size--out");
      b.disabled=true;
    } else {
      b.addEventListener("click",()=>{
        const isActive=b.classList.contains("active");
        sizes.querySelectorAll(".size").forEach(x=>x.classList.remove("active"));
        if(isActive) setBuy(null);
        else {
          b.classList.add("active");
          setBuy(size);
        }
      });
    }
    sizes.appendChild(b);
  }

const hr3=document.createElement("div"); hr3.className="hr";

const publicBox=document.createElement("div");
publicBox.className="orderForm";
publicBox.innerHTML = `
  <div class="orderForm__title">Catálogo público</div>
  <div class="orderMsg ok" style="display:block">
    Esta versión está lista para publicarse en GitHub Pages u otro hosting estático.
    Para consultar disponibilidad o separar, usa los botones de WhatsApp.
  </div>
`;

const row=document.createElement("div");
row.style.display="flex";
row.style.gap="10px";
row.style.flexWrap="wrap";

const askStock=document.createElement("a");
askStock.className="btn";
askStock.target="_blank";
askStock.rel="noopener";
askStock.textContent="Consultar stock";
askStock.href=waLink(p,chosenSize);

const closeBtn=document.createElement("button");
closeBtn.className="btn";
closeBtn.type="button";
closeBtn.textContent="Cerrar";
closeBtn.setAttribute("data-close","1");

const syncLinks = (size)=>{
  buy.href = waLink(p,size);
  askStock.href = waLink(p,size);
};
syncLinks(chosenSize);

row.appendChild(buy);
row.appendChild(askStock);
row.appendChild(closeBtn);

  right.appendChild(badges);
  right.appendChild(pname);
  right.appendChild(sub);
  right.appendChild(hr1);
  right.appendChild(priceLine);
  right.appendChild(hr2);
  right.appendChild(sizeLabel);
  right.appendChild(sizes);
  right.appendChild(hr3);
  right.appendChild(publicBox);
  right.appendChild(row);

  pdp.appendChild(left);
  pdp.appendChild(right);
  modalBody.appendChild(pdp);
  const modal=$("modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}
export function closeModal(){
  const modal=$("modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
}
