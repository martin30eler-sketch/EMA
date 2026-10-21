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
