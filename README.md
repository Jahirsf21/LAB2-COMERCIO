# Laboratorio 2: Búsqueda Instantánea y Filtros Avanzados en React
**Institución:** Tecnológico de Costa Rica Centro Académico de Limón  
**Curso:** Comercio electrónico
**Grupo:** 60  
**Profesor:** Ing. Joss Rayn Pecou Johnson  
**Semestre:** II Semestre 2026  
**Grupo de trabajo:** 04
 
## Estudiantes
| Nombre                   | Carnet      |
|--------------------------|-------------|
| Natalia Granados Rosales | 2021144286  |
| Owen Smith Cerdas        | 2024083328  |
| Deislher Sanchez Funez   | 2023032794  |
 
---
 
## Decisiones de Diseño (UI)
 
El proyecto 1 ya cumplía con los requisitos del laboratorio. Por lo tanto, para esta entrega se construyó una versión simplificada que conserva el diseño implementado para el proyecto junto con el sistema de búsqueda, filtros y la paginación mediante los [hooks de Algolia](https://www.algolia.com/doc/api-reference/widgets/react). Algolia se encarga del estado y las operaciones de búsqueda, mientras que la interfaz se construyó con los componentes de Shadcn UI para no depender de los estilos visuales predeterminados de Algolia y mantener una coherencia visual de tipografía y estilos en toda la aplicación.
 
| Componente del catálogo | Hook de Algolia | Componente de Shadcn | Integración |
| --- | --- | --- | --- |
| `SearchInput` | `useSearchBox` | `Input` | El valor mostrado proviene de `query`; cada cambio ejecuta `refine` para actualizar la búsqueda. |
| `RefinementFilter` | `useRefinementList` | `Checkbox` y `Label` | Muestra las facetas y sus cantidades; el estado marcado viene de `isRefined` y el cambio llama a `refine`. |
| `PriceRangeFilter` | `useRange` | `Slider` | Usa los límites de Algolia y aplica el intervalo seleccionado al terminar de mover el control. |
| `HitsPerPageSelect` | `useHitsPerPage` | `Select` | Ofrece el número de resultados por página y actualiza la opción activa con `refine`. |
| `PaginationControls` | `usePagination` | `Pagination` | Presenta las páginas disponibles, anterior y siguiente; cada acción llama a `refine`. |
| `ProductGrid` | `useHits`, `useInstantSearch` | Tarjetas propias | Renderiza los productos devueltos, resalta coincidencias con `Highlight` e informa cuando no hay resultados. |
 
`InstantSearch` envuelve el catálogo y comparte el estado de Algolia con todos estos hooks. Por eso, escribir una consulta, activar una faceta, ajustar el precio o cambiar de página actualiza los resultados de manera simultánea.
 
Dado que los componentes se construyeron sobre Shadcn UI en lugar de los estilos predeterminados de Algolia, cada elemento como: checkboxes de categoría, slider de precio, tarjetas de producto, botones de paginación hereda automáticamente las variables CSS de color, tipografía y radio de bordes ya definidas en el sistema de diseño del Proyecto I. Esto se refleja en la interfaz resultante: los filtros de Categorías, Marca, Género y Talla comparten la misma paleta neutra y tipografía que el encabezado y los botones "Ampliar foto", sin necesidad de sobreescribir estilos propios de Algolia. De esta manera, el catálogo no se percibe como un widget externo insertado en la página, sino como una extensión natural del diseño visual ya establecido en el resto de la aplicación.
 
## Experiencia de Usuario (UX)
 
En escritorio, la interfaz se organiza en **cuatro contenedores funcionales**:
 
1. El encabezado contiene la barra de búsqueda.
2. La columna lateral izquierda contiene los filtros y tiene su propio desplazamiento.
3. El panel principal contiene, en su parte superior, el selector de cantidad de productos por página y la cuadrícula con su propia área de desplazamiento.
4. El pie del panel de resultados contiene la paginación.
Esta distribución mantiene separadas las acciones de control y el contenido que cambia. La búsqueda permanece en el encabezado. Los filtros se conservan visibles en la columna lateral mientras se recorren los productos. El selector de cantidad por página se mantiene sobre la cuadrícula. Y la paginación queda fuera del área desplazable. Así, el usuario puede ajustar la búsqueda, la cantidad de productos mostrados, los filtros y la página sin perder los controles principales.
 
Los desplazamientos de la columna de filtros y del panel de resultados son independientes entre sí, por lo tanto, recorrer la cuadrícula de productos no desplaza la columna de filtros, y viceversa. Esto con el fin de que el usuario pueda explorar los productos sin perder de vista los filtros aplicados, y ajustar los filtros sin perder el punto donde se encontraba dentro de la cuadrícula de productos.
 
Al cambiar de página, el panel de resultados se desplaza al inicio. Esto evita que la persona permanezca al final de la cuadrícula de productos y tenga que desplazarse manualmente para ver los nuevos productos.
 
En pantallas pequeñas, la columna lateral se reemplaza por una hoja de filtros movil. Un botón flotante abre los filtros en una hoja lateral. Se preserva el espacio para los productos y el acceso a los filtros sigue disponible durante la navegación.
 
Dado que la tarjeta de producto tiene un tamaño reducido, la imagen se muestra a una escala pequeña que dificulta apreciar sus detalles. Para solventar esto, se añadió un botón "Ampliar foto" sobre la imagen de cada tarjeta, el cual abre un diálogo con la fotografía del producto en un tamaño mayor.
 
Esta disposición reduce la fricción en el proceso de decisión de compra: como se observa en la interfaz implementada, el usuario puede combinar filtros de Categorías, Marca, Género y Talla con el rango de Precio y aun así mantener visibles sus criterios aplicados mientras recorre la cuadrícula de productos y cambia de página. Al no perder de vista los filtros activos ni tener que reconfigurarlos entre páginas, se acorta el camino entre la búsqueda inicial y la selección final del producto, favoreciendo una experiencia de compra más directa y menos propensa al abandono.
 
## Manejo de estados: sin resultados
 
Cuando una consulta o una combinación de filtros no encuentra productos, La cuadricula de productos detecta que Algolia devolvió cero resultados y reemplaza la cuadrícula por un cuadro de estado vacío. Este presenta el mensaje **"No hay productos disponibles"** y la sugerencia **"Prueba otra búsqueda o ajusta los filtros."**
 
Al mismo tiempo, las listas de filtros no muestran opciones porque Algolia no devuelve valores de facetas que coincidan con la búsqueda actual. Esto evita presentar filtros que no producirían resultados y orienta a la persona a modificar la consulta o los criterios aplicados.
 
## Accesibilidad e interacción
 
Los controles incorporan etiquetas accesibles: el buscador usa `aria-label`, cada casilla se asocia con su `Label`, el selector se relaciona con su etiqueta y los botones de paginación indican si están deshabilitados. Los estados de foco se muestran en campos, casillas, controles de filtro, selector, paginación y áreas desplazables. Por tanto, la interfaz comunica claramente el elemento activo tanto al usar mouse como al navegar con teclado.
 
## Sitio desplegado
 
[Enlace](https://jahirsf21.github.io/LAB2-COMERCIO/)