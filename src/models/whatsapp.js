import { WHATSAPP_NUMBERS } from "./config.js";

export function waLink(product, size){
  const phone = WHATSAPP_NUMBERS[product.brand] || WHATSAPP_NUMBERS.default;

  const lines = [
    "Hola, quiero información / comprar:",
    `${product.brand} - ${product.name}`,
    `SKU: ${product.sku}`,
    `Precio: S/ ${Number(product.finalPrice ?? product.price).toFixed(2)}`
  ];

  if(size) lines.splice(3, 0, `Talla: ${size}`);

  lines.push("Disponibilidad: ¿Tienes stock?");
  if(size) lines.push("Si tienes stock en esa talla, por favor confirma para separar.");

  const msg = lines.join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}