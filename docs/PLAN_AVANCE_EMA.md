# EMA · Plan y documento de avances de la web pública

**Fecha de revisión:** 19/10/2026  
**Repositorio:** `martin30eler-sketch/EMA` · rama `main`  
**Proyecto relacionado:** `martin30eler-sketch/ADMINN-EMA` (panel editorial).  
**Regla:** no iniciar cambios en Android hasta terminar y verificar las dos webs.

## Objetivo
Ofrecer una biblioteca pública de historias ilustradas con lectura cómoda en escritorio y móvil, capítulos y escenas, textos ajustables y narración. Solo mostrar libros aprobados y publicados desde ADMINN-EMA.

## Implementado en el repositorio
- Lector de libros con contrato JSON v1 y v2 y hasta dos escenas por página.
- En escritorio, libro abierto con ilustraciones a la izquierda y narraciones a la derecha; animación de paso de la hoja derecha.
- En móvil, presentación adaptada a pantalla pequeña.
- Controles de navegación por página y protección frente a transiciones duplicadas o cambios de libro.
- Regiones de narración enfocables, con desplazamiento propio para textos extensos.
- Reacción a cambios de tamaño de pantalla y alternancia entre diseño móvil y escritorio.

## Avances registrados · 19/10/2026
- `438018a`: estructura del libro abierto para escritorio.
- `f1adba8`: estilos de la vista extendida y transición de páginas.
- `dcd9338`: giro de la hoja derecha sin mover la izquierda.
- `282eae1`: control de finalización de animaciones.
- `351e6db`, `5f75f6c`: accesibilidad y desplazamiento de narraciones.
- `fb23e41`: validación de máximo dos escenas por página.
- `79eab0e`: reconstrucción de la vista al cambiar de tamaño.
- `c95cda9`: navegación por teclado respetando controles enfocados.

## Pendientes para cerrar la web
- [ ] Pruebas reales en navegador de lectura y giro hacia delante y atrás.
- [ ] Verificar en móvil, tablet y escritorio el diseño y la accesibilidad.
- [ ] Probar libros reales con textos largos, escenas únicas y escenas dobles.
- [ ] Validar el ciclo completo desde ADMINN-EMA: importar → editar → publicar → desplegar → leer.
- [ ] Comprobar que el catálogo no muestre borradores privados.
- [ ] Confirmar despliegues exitosos y resolver cualquier error encontrado.

## Coordinación con ADMINN-EMA
El plan detallado del administrador está en `ADMINN-EMA/docs/PLAN_AVANCE_EMA.md`. Los borradores deben ser **privados y persistentes en la nube**, asociados al administrador, y no depender únicamente de IndexedDB. La biblioteca pública solo debe consumir publicaciones aprobadas.

## Historial y criterio de cierre
Registrar aquí cada avance relevante, el commit, las pruebas efectuadas y lo pendiente. No marcar una función como terminada sin comprobar su funcionamiento. Todos los cambios se hacen directamente en `main`.

## Verificación automatizada · 21/10/2026
- Incorporado workflow `.github/workflows/verificar-web.yml` en `main`, commit `36e0919`, con `npm ci`, `npm test` y `npm run build`.
- Confirmada la presencia del archivo en GitHub. No se ha comprobado aún un resultado exitoso de ejecución ni el despliegue Cloudflare; fase W0 continúa abierta.
- Próximo paso: verificar resultado de Actions, resolver errores y comprobar la versión de producción antes de cerrar W0.

## Corrección de CI · 21/10/2026
- Se comprobó que el repositorio no contiene `package-lock.json`. El workflow anterior usaba `npm ci`, incompatible con esa situación.
- Se corrigió el workflow para instalar dependencias con `npm install --no-audit --no-fund` en `main` (`2a291ad`).
- **Sin verificar:** resultado de GitHub Actions, compilación y despliegue Cloudflare. Como mejora futura, versionar un lockfile y volver a `npm ci` para instalaciones reproducibles.

## Cobertura de contrato editorial v2 · 21/10/2026
- Nuevas pruebas en `tests/libros.test.mjs`, commits `52120bd`, `daf32a7` y `2d3fb8b` en `main`.
- Casos añadidos: rechazo de tres escenas en una página, rechazo de texto de escena vacío, rechazo de geometría flotante fuera de límites y aceptación de dos escenas válidas.
- Estado: implementado, pendiente de confirmar ejecución satisfactoria de GitHub Actions y despliegue Cloudflare.

## Integración lector–administrador · 21/10/2026
- `8ddf3ee`: el contrato público valida máximo 35 páginas, ID de hasta 80 caracteres y título de capítulo obligatorio en libros GPT v2. Converge con las restricciones del administrador.
- `a38d1b6`: ampliación de pruebas para capítulos ausentes y exceso de páginas; se actualizan las fichas v2 válidas.
- `a34fd17`: navegación robusta ante respuestas tardías al abrir libros; volver a biblioteca invalida cargas en curso. En escritorio, el formato legado `v1` usa apertura izquierda con imagen y hoja derecha con narración, girando exclusivamente esta última en modo clásico.
- Coordinación: administrador `b8a44ff` conserva la agrupación de páginas original del JSON GPT y `008f25c` añade pruebas correspondientes.
- **Pendiente:** resultados CI, pruebas manuales en móvil/escritorio y publicación/despliegue real; no constan como aprobados.

## Ajuste adicional CI · 21/10/2026
- `3bc4847`: se retira `cache: npm` del workflow de Actions al no existir `package-lock.json`, evitando el error de `setup-node` sin lockfile.
- La consulta de estados del commit devuelve lista vacía: **pruebas CI aún sin resultado confirmado**, no marcar web lista para producción. Pendiente comprobar producción con navegación real y despliegue.

## Coordinación de borradores privados con ADMINN-EMA · 21/10/2026
- En el administrador se incorporaron el endpoint `/api/borrador`, el cliente de sincronización y sus controles de interfaz (commits `f6d349f`, `801d410`, `a509252`).
- La arquitectura separa deliberadamente borradores privados en Cloudflare KV del catálogo y de los libros públicos bajo `EMA/public`. **No se agregó código de borradores privados al repositorio EMA**; solo debe recibir publicaciones aprobadas.
- Para activar la sincronización aún falta vincular el binding `EMA_DRAFTS` al proyecto de Cloudflare correcto y verificar recuperación real entre dispositivos. Guía en `ADMINN-EMA/docs/BORRADORES_NUBE.md`.
- Estado lector: conserva el contrato público v1/v2. Su verificación real en producción y las pruebas de navegación en móvil y escritorio siguen pendientes.

## Auditoría de libros realmente publicados y cobertura de regresión · 21/10/2026
- Se consultó `public/catalogo.json` desde GitHub y se validaron los libros `el-algoritmo-del-sol-de-medianoche` (v1, 7 páginas) y `mi-amigo-body` (v2, 7 páginas con 12 escenas).
- Ambos contratos se validaron con el **mismo módulo `src/libros.js` de EMA**: IDs, títulos, autores, portada, páginas, escenas y layouts aceptados.
- Se compararon todos los nombres de imagen del JSON con las entradas reales de sus carpetas GitHub: **0 imágenes faltantes y 0 archivos extra**, 8 imágenes en el primero y 13 en el segundo, portadas incluidas.
- `6837398`: test permanente `tests/publicaciones-reales.test.mjs`: valida todos los libros del catálogo y sus archivos locales contra los contratos del lector, comprueba imágenes existentes y no vacías, y rechaza ilustraciones duplicadas o sobrantes.
- **Ambos workflows de Actions pasaron pruebas y Vite build**: [Verificación web EMA](https://github.com/martin30eler-sketch/EMA/actions/runs/39656951211) y [Verificar EMA web](https://github.com/martin30eler-sketch/EMA/actions/runs/39656951315).
- Cloudflare Pages del proyecto público `ema` reportó despliegue canónico exitoso de la versión anterior y está enlazado a `EMA/main`; confirmar la actualización del último commit antes de marcar despliegue de esta auditoría como concluido.
- Sigue pendiente probar interacciones reales en navegadores móvil/tablet/escritorio y publicación nueva desde ADMINN-EMA.

## Avance directo fase 4 — Narración controlada y accesible · 21/10/2026

**Objetivo:** mejorar el lector público en móvil y escritorio preservando la composición editorial y los formatos v1/v2 existentes.

- `7fe420b`: nuevo `src/narration.js`, controlador autónomo de la síntesis de voz del dispositivo; reproduce, pausa, reanuda y detiene. Identifica cada generación de voz para ignorar `onend` o `onerror` tardíos cuando ya se cambió de página.
- `8d2e6df`: `src/main.js` integra el controlador en la lectura de las escenas v1/v2; añade botones separados de escuchar/detener y pausar/reanudar con `aria-pressed`, deshabilitando pausa si no hay narración activa. Cambio de página y vuelta a la biblioteca cancelan el audio anterior.
- `ba0f263`: controles TTS táctiles de al menos 44 px y adaptación a pantallas pequeñas; sin cambiar el libro abierto, la paginación ni los estilos editoriales de imagen/texto.
- `2119c2e`: pruebas `tests/narracion.test.mjs` para reproducción, pausa, reanudación, parada, cambio de página, eventos tardíos y errores de inicio de TTS.
- **GitHub Actions en `main`: aprobados** [Verificación web EMA](https://github.com/martin30eler-sketch/EMA/actions/runs/39674960819) y [Verificar EMA web](https://github.com/martin30eler-sketch/EMA/actions/runs/39674960970), con pruebas y compilación Vite.
- **Cloudflare Pages:** tras el último commit, el check de despliegue aún estaba en curso en la primera consulta; se confirmará su resultado por separado.

**Pendiente:** prueba manual de las voces disponibles, pausa/reanudación y controles en Android Chrome y escritorio; lectura íntegra en ambos formatos, contraste y verificación del giro exclusivo de hoja derecha con dispositivo real.

**Siguiente paso del plan:** continuar fase 4 (legibilidad, enfoque, controles móviles) y, en coordinación con ADMINN-EMA, las pruebas reales de publicación y actualización en el lector.

## Continuación de fase 4 — Navegación por teclado y salida accesible · 21/10/2026

- `094b8e2`: módulo `src/keyboard.js` para acciones de lectura con flechas, PageUp/PageDown, Home, End y Escape.
- `41246c3`: integración en `src/main.js`. Escape cierra primero el menú de modos si está abierto (y devuelve el foco al control); de lo contrario vuelve a la biblioteca. Las demás teclas navegan páginas o extremos sin interferir con campos editables, botones ni las regiones de narración desplazables.
- `7d9fdb1`: `tests/teclado.test.mjs` garantiza el mapeo de acciones de navegación y la exclusión de teclas ajenas.
- **Pruebas y build de `41246c3`**: ambos workflows de EMA aprobados, [Verificación web](https://github.com/martin30eler-sketch/EMA/actions/runs/39675417838) y [Verificar EMA web](https://github.com/martin30eler-sketch/EMA/actions/runs/39675418133). El commit posterior de tests debe confirmarse de nuevo.
- **Despliegue de narración del bloque anterior**: Cloudflare Pages confirmó `success` para el commit de historial `e8b1a0e`, con los tests TTS anteriores incluidos.
- La fase 4 sigue pendiente de aceptación manual en móviles/tabletas, giro de página y narración con voces reales; no se declara cerrada por tests unitarios solamente.

## Bloque funcional W2/W3 — Lectura móvil, voz, capítulos, favoritos y accesibilidad · 21/10/2026

**Desarrollo directo en `EMA/main`** (sitio público únicamente; no se tocó `ADMINN-EMA` ni `EMA_app`). Se completaron funciones relacionadas del plan de lectura, sin sustituir el producto por plantillas.

### Implementado
- **Paso táctil** (`src/swipe.js`, `src/main.js`, `src/styles.css`): `7e78b49`, `27fb4b6`, `29bd514`. Deslizar horizontalmente en ilustraciones pasa página, sin convertir scroll vertical, arrastre en captions o interacción con controles en cambios accidentales. `94832cc` añade pruebas de dirección, umbral, duración y áreas excluidas.
- **TTS completo con opciones** (`src/narration.js`, `src/main.js`): `69b4702`, `2fd4a12`, `beae183`, `0fd56cd`. Velocidad lenta/normal/rápida, pausa/reanudación, avance narrado **opcional y desactivado por defecto**, menú de opciones compacto en móvil. `99d7cd0` corrige los eventos `onend/onerror` duplicados para no saltar páginas; tests `5f7c8e8`, `b4998e7`.
- **Capítulos** (`src/chapters.js`, `src/main.js`): `5ea554a`, `8c01df5`, `b85ec5a`, `6549ebb`. Índice de capítulos v2 desde el menú de lectura, con saltos a la primera página sin mezclar capítulos con varias páginas ni alterar el contrato público v1.
- **Favoritos y continuar leyendo** (`src/favorites.js`, `src/main.js`): `4b919af`, `b4cb324`, `1617870`, `fb7c941`. Favoritos almacenados exclusivamente en el navegador, filtro de favoritos y acceso indicando última página guardada. Los botones de favoritos son elementos independientes de las tarjetas para no anidar controles.
- **Recuperación de carga pública**: `c506684` agrega actualización manual del catálogo y reintento tras errores de red sin reemplazar un libro que se abrió mientras había una solicitud pendiente. `b80bc6e`, `8694369` ofrecen marcador accesible para imagen ausente y botón de reintento en las escenas, con portada no interactiva dentro de la tarjeta.
- **Ajustes de lectura accesibles**: `838c0f8`, `2aa7a4e`, `265e1ba`, `394595d`: letra ampliada y alto contraste opcionales, persistencia local de preferencias de voz y lectura; soportan el texto desplazable. `ae7c047`, `40dd3bf`, `266bc98` evitan que un navegador que bloquea localStorage deje la biblioteca inutilizable; casos de regresión añadidos.

### Verificado
- Ambos workflows GitHub Actions (pruebas y `npm run build`) finalizaron correctamente para **`266bc989`**:
  - [Verificación web EMA](https://github.com/martin30eler-sketch/EMA/actions/runs/39678523510)
  - [Verificar EMA web](https://github.com/martin30eler-sketch/EMA/actions/runs/39678523526)
- Check **Cloudflare Pages: success** para el mismo commit `266bc989`, con despliegue de Pages `62a28e3f-2aa9-42aa-a647-a121e53cd7f0`. Compilación y despliegue confirmados por GitHub/Cloudflare, **no sustituyen pruebas táctiles en teléfono**.
- Los tests añadidos cubren gestos, capítulos con varias páginas, favoritos/progreso, preferencia de alto contraste, fallos de almacenamiento, síntesis de voz y eventos de fin tardíos o duplicados.

### Pendiente para cierre de W2/W3 y siguiente
- **Prueba manual real** en Chrome Android, pantalla pequeña/landscape y escritorio: swipes con caption en scroll, velocidad/avance TTS, legibilidad de largo texto, imagen ausente y opciones de alto contraste.
- Verificar con navegador y lector de pantalla el foco, las transiciones visuales y giro exclusivo de hoja derecha. No marcar fase cerrada por CI solamente.
- **W4 Integración editorial:** completar en sesión autorizada el ciclo de publicar libro piloto, comprobar GitHub→Cloudflare→EMA, respaldar ZIP, retirar y republicar, sin tocar los libros actuales sin autorización.
- Android sigue bloqueado hasta el cierre probado de ambas webs.

## Continuación del cierre web — recuperación accesible de ilustraciones · 22/10/2026

- **Aceptación comunicada por el administrador:** las operaciones de **publicar y eliminar** desde el panel ADMINN-EMA funcionaron correctamente. Este resultado está registrado en `ADMINN-EMA/docs/PLAN_AVANCE_EMA.md`. No repetir esas pruebas básicas ni modificar publicaciones reales desde las herramientas.
- `ed1725c`: nuevo `src/image-fallback.js`. El contenedor de una imagen fallida ya no incluye un botón dentro de `role="img"`, una estructura que ocultaba la acción interactiva a lectores de pantalla. La descripción accesible de la ilustración y el botón «Reintentar imagen» son hermanos independientes.
- `c492ca6`: integración en `src/main.js`; las portadas continúan sin botón interno para no introducir un control dentro de la tarjeta clicable. La imagen fallida se puede reintentar mediante teclado o toque desde el lector.
- `671d8bf`: test de regresión `tests/image-fallback.test.mjs` para descripción alternativa, acción accesible y ausencia de botones anidados.
- **Pruebas:** `npm test` y `npm run build` aprobados por GitHub Actions para `c492ca6`; confirmar ambos workflows y Cloudflare Pages del último SHA por separado, sin anticipar su resultado.
- **Pendiente W3/W5:** validación manual con lector de pantalla, contraste, teléfono y escritorio. Completar aceptación visual de giro exclusivo de hoja derecha, texto largo y páginas dobles.
- **Siguiente:** terminar esos criterios del lector público y coordinar su cierre con la web editorial. Android sigue pospuesto hasta que ambas webs estén cerradas y verificadas.

## Aceptación del lector y cierre de contrato de imágenes · 22/10/2026

**Prueba manual confirmada por el administrador:** informó que el lector público, la experiencia móvil y de escritorio, la narración, las páginas dobles y la fidelidad de los textos **ya estaban probados**. Registrar esa aceptación sin solicitar de nuevo las mismas pruebas. La publicación y eliminación básicas del panel también fueron confirmadas previamente.

**Desarrollo fase W5 (seguridad del contrato público):**
- `a16f246`: `src/libros.js` deja de aceptar una portada o ilustración cuya ruta solo empiece por el ID del libro; exige `portada.<ext>`, `pagina-NNN.<ext>` para libros v1 y `escena-NNN.<ext>` con numeración **secuencial por escena**, incluso al cambiar de capítulo, para v2.
- `3b2a0c4`: `tests/libros.test.mjs` comprueba que portadas erróneas, páginas con numeración cambiada y escenas intercambiadas se rechazan, y que el libro v2 ordenado sigue siendo válido.
- No se modificaron ni publicaron libros, ni se alteró el formato Gemini. La validación se realizó previamente contra las rutas de los dos libros actuales: coincidían con la secuencia esperada.
- `069f583`: `docs/PLAN_INTEGRAL_WEB.md` registra los recorridos ya aceptados por el administrador; quedan como trabajo W5 seguridad y cierre, **no volver a probar manualmente lo que ya validó**.
- **Verificación:** los dos workflows GitHub Actions pasaron en `069f583`, con pruebas y compilación. [Verificación web](https://github.com/martin30eler-sketch/EMA/actions/runs/39864209631) y [Verificar EMA web](https://github.com/martin30eler-sketch/EMA/actions/runs/39864209554).
- **Despliegue:** el check de Cloudflare Pages debe confirmarse para el commit final documental antes de declararlo verificado; se consultan checks de GitHub cuando la conexión Cloudflare carece de permisos para esta cuenta.

**Siguiente:** terminar seguridad y criterios W5 de ambas webs, registrar evidencia de despliegues y resolver únicamente fallos concretos. Android sigue condicionado al cierre conjunto, no a repetir pruebas manuales aprobadas.
