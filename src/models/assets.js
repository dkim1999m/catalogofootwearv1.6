export function productImageBase(brand, sku, n){
  return `assets/images/products/${brand.toLowerCase()}/${sku}/${n}`;
}
export function placeholderSVGDataURI(label="Imagen"){
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
      <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#e5e7eb"/><stop offset="1" stop-color="#f8fafc"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="60" y="120" font-family="Arial" font-size="48" font-weight="800" fill="#111827" opacity="0.85">${label}</text>
      <text x="60" y="180" font-family="Arial" font-size="22" fill="#111827" opacity="0.55">Falta la imagen o la ruta no coincide</text>
    </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}
async function tryLoad(url){
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
  });
}
export async function resolveImage(baseOrUrl){
  if(/\.(jpg|jpeg|png|webp)$/i.test(baseOrUrl)){
    return await tryLoad(baseOrUrl);
  }
  const exts = [".jpg",".jpeg",".png",".webp"];
  for(const ext of exts){
    const found = await tryLoad(baseOrUrl + ext);
    if(found) return found;
  }
  return null;
}
export async function setResolvedImg(imgEl, baseOrUrl, fallbackUrl){
  const url = await resolveImage(baseOrUrl);
  imgEl.decoding = "async";
  imgEl.loading = imgEl.loading || "lazy";
  imgEl.src = url || fallbackUrl;
  return !!url;
}
export function setResolvedImgNoWait(imgEl, baseOrUrl, fallbackUrl){
  setResolvedImg(imgEl, baseOrUrl, fallbackUrl);
}