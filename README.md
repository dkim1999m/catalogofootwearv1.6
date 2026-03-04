# Catálogo PRO (MVC) — 20 productos (JPG)

Este proyecto está basado en tu estilo original de catálogo (misma UI/UX, poster, filtros, grid, modal) pero **modularizado** en MVC y preparado para **20 productos**.

## Ejecutar
1) Abre la carpeta en VS Code
2) Usa **Live Server** sobre `index.html`

> Importante: abre con servidor (Live Server o `python -m http.server`). Si abres por doble click, `fetch` de `products.json` puede bloquearse.

## WhatsApp (botones funcionando)
Edita el número en:
`src/models/config.js`

Formato: **internacional sin +**
Ejemplo Perú: `51927137867`

Los botones generan link:
`https://wa.me/<numero>?text=<mensaje codificado>`

## Dónde poner tus imágenes (JPG)

### A) Fotos del producto (3 imágenes por SKU)
Convención:
`assets/images/products/<brandLower>/<SKU>/1.jpg`
`assets/images/products/<brandLower>/<SKU>/2.jpg`
`assets/images/products/<brandLower>/<SKU>/3.jpg`

Ejemplo Elude:
`assets/images/products/caterpillar/P724341/1.jpg`
`assets/images/products/caterpillar/P724341/2.jpg`
`assets/images/products/caterpillar/P724341/3.jpg`

> Si falta una foto, se muestra placeholder (no se rompe).

### B) Posters del inicio (carrusel)
`assets/images/posters/poster-1.jpg`
`assets/images/posters/poster-2.jpg`
`assets/images/posters/poster-3.jpg`

## Editar los 20 productos
Archivo:
`src/data/products.json`

Cambia:
- `sku` (debe coincidir con la carpeta)
- `name`
- `price`, `discount`, `isNew`, `rating`
- `sizes` (incluye intermedias como 40.5)

## Secuencia perfecta (1→2→3→1…)
- En el modal, el carrusel hace loop con `idx = (idx+1)%3`
- Precarga la siguiente imagen para que el cambio sea fluido


## Nota importante (si no ves productos)
- Esta versión ya no espera la carga de imágenes en el grid (porque `loading=lazy` puede bloquear el render).
- Verás los 20 productos incluso si aún no subiste ninguna foto.


## Cambio importante (según tu pedido)
- Los botones General/Caterpillar/Columbia ARRIBA solo cambian el **POSTER + COLORES + EFECTO**.
- Para filtrar productos por marca usa el selector **Marca: Todas**.
- En "Ver" debes seleccionar una talla para habilitar el botón WhatsApp (envía talla + consulta de disponibilidad).


## "Ver" (Detalle)
- El botón **Ver** abre el detalle del producto.
- En el detalle puedes seleccionar **talla (opcional)**.
- Si seleccionas una talla, el botón WhatsApp envía el mensaje incluyendo la talla.
- Si NO seleccionas talla, envía el mensaje sin talla (como en tu versión original).

## Carpetas por producto (ya creadas)
- En `assets/images/products/` ya están creadas carpetas por **marca/SKU** y dentro hay `IMAGENES-LEEME.txt` con los nombres.
- También tienes `MAPA-CARPETAS.txt` en la raíz con todas las rutas.


## Subir fotos desde el navegador (Admin)
En un **sitio estático** (ej. GitHub Pages) el navegador NO puede guardar archivos en carpetas del proyecto.
Para que puedas subir y que se guarde dentro de `assets/`, esta versión trae un **servidor Node**.

### Ejecutar (VS Code)
1) Abre la carpeta del proyecto.
2) En terminal:
```bash
npm install
npm start
```
3) Abre:
- Catálogo: http://localhost:5173/index.html
- Admin: http://localhost:5173/admin.html

### Login demo
- Usuario: `admin`
- Contraseña: `123456`

### Rutas donde se guardan
- Producto: `assets/images/products/<marca>/<SKU>/<slot>.jpg`
- Poster: `assets/images/posters/poster-<slot>.jpg`

> Para publicarlo: después de subir fotos, haz commit/push de los nuevos JPG a tu repo.


## Error corregido en Admin
Si abrías `admin.html` con Live Server (`127.0.0.1:5500`) salía:
`Unexpected end of JSON input`.

Ahora el panel muestra un mensaje claro explicando que debes usar:
```bash
npm install
npm start
```

Y abrir:
- `http://localhost:5173/index.html`
- `http://localhost:5173/admin.html`


## Mejoras de esta versión
- El admin ya no muestra usuario/contraseña en pantalla.
- Puedes **reemplazar 1 imagen exacta** por slot (1 principal, 2 lateral, 3 suela/extra).
- Puedes **subir 3 imágenes de una vez** y el sistema las guarda como 1 / 2 / 3 en orden.
- Para posters también puedes:
  - reemplazar 1 exacto, o
  - subir los 3 de una vez.
- Si antes había `.png`, `.jpg`, `.webp` mezclados, el sistema elimina duplicados del mismo slot para dejar **una sola imagen correcta**.
- La web ahora prueba automáticamente: `.jpg`, `.jpeg`, `.png`, `.webp`.
- Si la imagen no aparece al instante, usa **Ctrl + F5** (caché).

## Credenciales
Las credenciales ya no se muestran en la interfaz.
Se validan en el servidor:
- usuario por defecto: `admin`
- contraseña por defecto: `123456`

Puedes cambiarlas en:
- `server.js`
o usando variables de entorno:
- `ADMIN_USER`
- `ADMIN_PASS`


## Escalabilidad desde esta versión
- Puedes cambiar qué foto se usa como portada del catálogo (`coverSlot` 1/2/3) sin mover archivos.
- El detalle del producto ahora muestra miniaturas + imagen grande principal.
- Puedes agregar o modificar productos desde el Admin:
  - guarda en `products.json`
  - crea su carpeta automáticamente en `assets/images/products/<marca>/<SKU>/`
  - genera `IMAGENES-LEEME.txt`
- Ya no necesitas rehacer todo para cada producto nuevo.


## Cambios de esta versión
- El carrusel del poster ya no vuelve a renderizar los productos: solo cambia esa zona superior.
- General muestra todo; Caterpillar solo Caterpillar; Columbia solo Columbia.
- Las tarjetas usan colores suaves según la marca.
- Puedes marcar tallas agotadas y se verán tachadas/bloqueadas en la ficha.


## Ajuste de sincronización de marcas y edición
- Cuando creas una marca nueva desde Admin, se sincroniza para:
  - formulario de producto
  - filtros y tabs públicas
  - posters por marca
- Si escribes un SKU existente en Admin, el formulario se rellena automáticamente para editarlo sin volver a escribir todo.


## Mejoras de esta versión
- Las marcas ahora son dinámicas:
  - se leen desde `src/data/brands.json`
  - pueden agregarse desde Admin
  - aparecen en el catálogo público y en sus posters propios
- Cada marca nueva crea su base en:
  - `assets/images/products/<marca>/`
  - `assets/images/posters/<marca>/`
- El poster se separa por marca:
  - General
  - una carpeta propia por cada marca
- En el catálogo público:
  - General muestra todas las marcas
  - si entras a una marca específica, el filtro de marca ya no deja otras marcas


## Nueva mejora incluida
- El panel Admin ahora permite:
  - crear marcas nuevas
  - asignar colores de marca
  - asignar fondo
  - asignar título
  - asignar efecto visual del poster
- La configuración se guarda en:
  - `src/data/brand-settings.json`
- Marcas nuevas como Salomon, Merrell o Hi tec ya no quedan verdes por defecto si les asignas sus colores en Admin.


## Poster inteligente
- Configura modo contain/cover y enfoque X/Y desde Admin (se guarda en src/data/posters.json).


## Fase 1 incluida
- Pedidos básicos desde la ficha del producto.
- Stock numérico por talla (`stockBySize`).
- Admin para ver pedidos y cambiar estado.
- Al marcar `vendido` o `entregado`, descuenta 1 unidad de stock de la talla elegida.
- Si luego cambias a `cancelado`, repone esa unidad.


## Fase 2 · Versión 1
Incluye:
- stock numérico por talla
- pedidos con cambio de estado
- clientes automáticos generados desde pedidos
- dashboard comercial en admin
- notas por cliente
- admin con barra lateral profesional y secciones completas

## Admin
Abre:
- `http://localhost:5173/admin.html`

Credenciales demo:
- usuario: `admin`
- contraseña: `123456`


## Fase 3 · Versión 1
- Métricas por mes: /api/metrics?month=YYYY-MM
- Exportar CSV: /api/export/orders.csv y /api/export/customers.csv
- Admin: edición de pedidos (qty + nota)


## Corrección aplicada
- Se eliminó la duplicación de funciones en `server.js` que impedía iniciar Node.


## Corrección admin inputs
- Se reforzó `z-index`, `pointer-events` e `isolation` en `admin.html` para evitar capas invisibles que bloqueaban selects e inputs.


## Corrección inputs marca / sku
- Los campos de marca y SKU del admin usan input + datalist.
- Ahora puedes escribir manualmente o elegir desde sugerencias.


## Versión v1.0
- Crear marca ahora tiene sección propia.
- Crear/editar producto usa listas desplegables para marca y productos existentes.
- Puedes buscar por nombre/SKU y luego modificar el producto cargado.
- Stock & producto vuelve a usar selects rápidos para marca y SKU.


## Versión v1.1
- Corregidas listas desplegables del admin.
- Crear marca en módulo separado.
- Crear/editar producto usa marca por select + búsqueda por nombre/SKU + lista de productos existentes.
- Stock & producto vuelve a usar selects robustos y filtro rápido por nombre/SKU.
- Se preserva la selección al recargar datos.


## Versión v1.2
- Corregida la lista desplegable de marcas creadas.
- Gestión de marcas ahora usa dropdown estable con búsqueda rápida.
- Seleccionar una marca sincroniza Crear marca, Estilo de marca, Crear/editar y Stock.
- Se optimizó el flujo para editar marcas ya creadas más rápido.


## Versión v1.3
- Corregida de forma completa la lista desplegable de marcas en Crear / editar producto.
- Reescrita la lógica del admin para poblar selects de marcas y productos de forma robusta.
- Seleccionar una marca ahora actualiza correctamente productos, stock, estilos y gestión de marca.


## Versión v1.4
- Se simplificó la carga de marcas y SKUs para evitar listas vacías.
- El admin ahora usa fallback desde JSON locales si la API falla.
- Si no hay marcas en brands.json, las deriva automáticamente desde products.json.


## Versión v1.5
- En estilo de marca ya no necesitas escribir colores a mano.
- Se agregaron selectores visuales de color (color picker).
- Se agregaron presets rápidos de tema.
- Vista previa del tema en el admin.


## Versión v1.6
- Corregida la carga y vista previa de posters en admin.
- El upload ahora guarda mejor la ruta del poster y conserva configuración visual.
- Se reforzó la actualización del poster tanto en admin como en la página principal.
