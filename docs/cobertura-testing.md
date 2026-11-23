# HuertoHogar EP2: cobertura de testing

El informe de cobertura documenta la ejecución original en `ep2-react`. En `ep2-v2`, la prueba del alta administrativa comprueba el envío de la contraseña ficticia y `src/tests/Cuentas.test.jsx` cubre registro, administración y migración. Las credenciales para pruebas manuales de EP2 v2 se detallan al final.

## Objetivo y alcance

Esta suite verifica diez comportamientos existentes: props, eventos y disponibilidad de ProductCard; validación y envío de UsuarioFormulario sin contraseña; renderizado y cálculos de CarritoView; validación y ajuste de artículos; y actualización del contador y persistencia del carrito desde App. No incorpora funcionalidades ni modifica componentes de producción.

Referencia de ejecución: Windows 11, Node.js 24.22.1, rama `ep2-react`, base `257dac8bd8dd8005085e728a78ac2cf65b8e20b1`. Resultados obtenidos el 23 de octubre de 2026.

## Herramientas y configuración

| Herramienta | Versión instalada | Papel en las pruebas |
| --- | --- | --- |
| Vitest | 5.0.5 | Ejecuta `describe`, `test`, `expect` y callbacks simulados con `vi.fn()`. |
| React Testing Library | 16.3.3 | Monta componentes con `render` y consulta su DOM mediante `screen` y consultas accesibles. |
| user-event | 14.6.8 | Simula clics y escritura; sus operaciones se esperan con `await`. |
| jsdom | 30.1.3 | Proporciona DOM y almacenamiento simulados dentro de Node, sin navegador real. |
| jest-dom | 7.0.1 | Añade matchers como `toBeInTheDocument`, `toBeDisabled` y `toHaveTextContent`. No instala el ejecutor Jest. |
| Cobertura V8 | 5.0.5 | Mide el código ejecutado durante las pruebas mediante `@vitest/coverage-v8`. |

Vitest y su proveedor V8 comparten versión y son compatibles con Node 24 y Vite 8.3.5. Se conserva React 19.3.1 y las dependencias existentes; las seis herramientas se agregan solo como dependencias de desarrollo.

La suite utiliza Vitest y React Testing Library para comprobar comportamientos de los componentes y funciones de HuertoHogar. La cobertura se obtiene mediante el proveedor V8 y permite identificar código ejecutado y funcionalidades pendientes de pruebas.

La configuración permanece en `vite.config.js`: conserva el plugin React, usa `environment: 'jsdom'` y carga `src/tests/setup.js`. El setup importa `@testing-library/jest-dom/vitest` y ejecuta `cleanup` después de cada prueba. No se activan globals: las APIs de Vitest se importan explícitamente.

El descubrimiento se limita a `src/tests/**/*.test.{js,jsx}` para ejecutar exclusivamente las pruebas de HuertoHogar. Los scripts son `test` (observación), `test:run` (una ejecución) y `coverage` (una ejecución con V8); se conservan `dev`, `build` y `preview`.

## Casos de prueba y resultados

| N.º | Nombre | Componente o función | Comportamiento verificado | Resultado |
| --- | --- | --- | --- | --- |
| 1 | Muestra nombre, código, precio y stock recibidos por props | ProductCard | Presenta los datos visibles de un producto simulado. | Aprobado |
| 2 | Llama una sola vez al callback con el código al agregar al carrito | ProductCard | Un clic entrega exactamente el código esperado al padre. | Aprobado |
| 3 | Deshabilita agregar y explica la falta de stock | ProductCard | Stock cero deshabilita el botón, muestra el motivo y evita el callback. | Aprobado |
| 4 | Muestra validaciones y no guarda un formulario vacío | UsuarioFormulario | El envío actualiza los errores visibles y no llama a `onGuardar`. | Aprobado |
| 5 | Guarda los datos válidos sin entregar la contraseña al callback | UsuarioFormulario | La escritura y envío entregan los cinco campos esperados, sin contraseña. | Aprobado |
| 6 | Muestra el carrito vacío y el enlace al catálogo | CarritoView | Presenta título, mensaje vacío y enlace a `/productos`. | Aprobado |
| 7 | Calcula subtotales, total y cantidad y avisa al aumentar una cantidad | CarritoView | Dos manzanas y una zanahoria suman $2.400 y $900, total $3.300 y tres unidades; aumentar notifica `('FR001', 3)`. | Aprobado |
| 8 | Acepta artículos válidos y rechaza cantidades inválidas y códigos duplicados | esCarritoValido | Acepta `{ codigo, cantidad }` correcto y rechaza cantidad negativa, decimal y códigos repetidos. | Aprobado |
| 9 | Limita al stock entero y retira productos inexistentes o sin disponibilidad | ajustarCarrito | Stock 2,8 limita a dos unidades; elimina código ausente, stock cero y stock 0,5 sin mutar los datos de entrada. | Aprobado |
| 10 | Actualiza el contador y persiste el artículo al agregar Manzanas Fuji | App | Desde `/productos`, el contador pasa de cero a uno y el efecto guarda `[{ codigo: 'FR001', cantidad: 1 }]`. | Aprobado |

## Metodología

Cada prueba sigue Arrange (datos, props, router y mocks), Act (renderizado, interacción o llamada a la función) y Assert (resultado observable con `expect`). Los nombres describen comportamientos y se utilizan consultas por rol, etiqueta y texto, sin snapshots ni comprobaciones internas de hooks.

Los componentes con enlaces o navegación se montan en `MemoryRouter`. Los datos de tarjetas, formulario y funciones son fixtures controlados. La prueba de App parte del catálogo inicial conocido, limpia `localStorage` y `sessionStorage` de jsdom antes de ejecutarse, usa Strict Mode y espera el resultado de persistencia con `waitFor`. No accede al almacenamiento ni al perfil de un navegador real.

`vi.fn()` aísla los callbacks de los componentes. El guardado satisfactorio del formulario devuelve `{ usuario: ... }`, respetando su interfaz real. Las funciones puras se prueban directamente, sin mocks. Cada prueba monta su propio árbol y el setup lo desmonta al finalizar; no hay servicios externos, temporizadores artificiales ni dependencias de red.

## Ejecución

| Comando | Resultado real |
| --- | --- |
| `npm.cmd run test:run` | Cinco archivos, diez pruebas ejecutadas: diez aprobadas y cero fallidas. Sin errores de configuración ni advertencias de actualizaciones React pendientes. |
| `npm.cmd run coverage` | Cinco archivos, diez pruebas aprobadas y cero fallidas; reporte V8 en terminal y HTML generado en `coverage/index.html`. |
| `npm.cmd run build` | Compilación de producción satisfactoria con Vite 8.3.5; 366 módulos transformados. |

La repetición con `npm.cmd run test:run -- --sequence.shuffle --sequence.seed=20261023` también aprobó las diez pruebas, con otro orden de ejecución. No se inicia un servidor ni se deja Vitest en observación para estas verificaciones.

## Cobertura real

Porcentajes y conteos tal como los entrega el reporte, sin redondeo adicional:

| Métrica | Cobertura global | Elementos cubiertos/total |
| --- | --- | --- |
| Statements (sentencias) | 36.43% | 188/516 |
| Branches (ramas) | 30.07% | 123/409 |
| Functions (funciones) | 31.61% | 49/155 |
| Lines (líneas) | 40.29% | 164/407 |

Detalle de los archivos directamente probados:

| Archivo | Statements | Branches | Functions | Lines |
| --- | --- | --- | --- | --- |
| `src/components/ProductCard.jsx` | 100% | 70% | 100% | 100% |
| `src/components/UsuarioFormulario.jsx` | 92.3% | 78.12% | 100% | 91.3% |
| `src/views/CarritoView.jsx` | 80% | 60% | 77.77% | 81.81% |
| `src/utils/carrito.js` | 90% | 89.28% | 100% | 100% |
| `src/App.jsx` | 45.85% | 26.31% | 33.33% | 52.54% |

El cálculo incluye `src/**/*.{js,jsx}`, también los archivos de aplicación sin pruebas directas y el arranque `main.jsx`. La única exclusión configurada es `src/tests/**`, porque la suite y su setup no son código del producto. Los archivos CSS, las imágenes y las dependencias no forman parte del cálculo de cobertura. No se excluye ninguna funcionalidad de React para aumentar porcentajes ni se fijan umbrales.

La inclusión explícita permite mostrar archivos no ejecutados, en vez de limitar el reporte a los importados por los tests, según la [documentación oficial de cobertura de Vitest](https://vitest.dev/guide/coverage). Importar un archivo o ejecutar una línea incidentalmente no significa haber comprobado todos sus comportamientos.

## Interpretación y límites

Las pruebas protegen las props y callbacks de la tarjeta, el bloqueo por falta de stock, la validación básica del formulario y la exclusión de su contraseña, el carrito vacío, los cálculos del escenario de tres unidades, el callback de incremento, el esquema mínimo del carrito, su ajuste por disponibilidad y el flujo acotado de agregar y persistir desde App.

Quedan sin verificar, entre otras, estas ramas y funcionalidades:

- ProductCard: imagen referencial y bloqueo cuando las unidades del carrito ya alcanzaron el stock.
- UsuarioFormulario: modo edición y respuesta con errores del callback de guardado (líneas 41-42).
- CarritoView: callbacks de disminuir y eliminar, imagen referencial y artículo ausente del catálogo. El incremento se verifica como callback, no como actualización del estado del padre.
- Funciones del carrito: entradas que no son arreglos, artículos nulos, campos adicionales y códigos vacíos, entre otros casos de esquema.
- App: recuperación de almacenamiento corrupto o bloqueado, avisos y su limpieza al navegar, cambios administrativos, modificación y eliminación desde el carrito y ambos CRUD completos.
- Vistas informativas, blog, formularios públicos, navegación administrativa y montaje real desde `main.jsx` no tienen pruebas de comportamiento en esta suite.

La cobertura global es parcial porque se mide toda la aplicación, pero solo hay diez pruebas seleccionadas. Tener 100% de líneas en un archivo no implica cubrir todas sus ramas; tampoco 100% de cobertura garantiza ausencia de errores: solo cuenta ejecución, no la calidad de las expectativas ni todas las combinaciones de entradas.

Estas pruebas no sustituyen la revisión manual del diseño responsivo, la navegación en un navegador real, la compatibilidad entre navegadores, el despliegue ni el funcionamiento de la infraestructura. Esta etapa no realiza verificaciones visuales ni E2E y no accede a AWS EC2.

`coverage/`, `node_modules/` y `dist/` permanecen ignorados. El HTML se regenera con `npm.cmd run coverage`; este informe Markdown sí se versiona.

## Credenciales de demostración de EP2 v2

El registro público y el alta administrativa guardan las contraseñas tal como se ingresan en `localStorage`, bajo la clave `huertohogar-usuarios-v1`. Usa contraseñas ficticias. El almacenamiento en texto plano y la contraseña temporal compartida son exclusivos de la demostración.

Al cargar HuertoHogar en un navegador que aún no tiene datos de usuarios guardados, el listado inicial contiene estas credenciales.

| Usuario | Correo | Contraseña de prueba |
| --- | --- | --- |
| Ana Torres | `ana.torres@example.com` | `AnaDemo2` |
| Diego Morales | `diego.morales@example.com` | `DiegoDemo2` |
| Camila Rojas | `camila.rojas@example.com` | `CamiDemo2` |
| Felipe Soto | `felipe.soto@example.com` | `FeliDemo2` |
| Valentina Pérez | `valentina.perez@example.com` | `ValeDemo2` |

Al cargar un listado válido del formato anterior, cada registro sin el campo `password` recibe `Temporal2`. Esto incluye las cuentas iniciales que el navegador ya había guardado sin contraseña. La migración conserva los demás campos y las contraseñas existentes. Una vez guardada, cada cuenta conserva su contraseña en las siguientes recargas.

En `/login`, usa la pestaña Cliente para estas cuentas. La pestaña Administrador acepta `admin@huertohogar.cl` con `AdminDemo2` y abre `/admin`. La sesión de demostración guarda el tipo de cuenta y su identificador en `sessionStorage`, bajo `huertohogar-sesion-v1`. Las rutas administrativas conservan el acceso directo y el carrito sigue siendo compartido entre las sesiones del navegador en esta etapa.
