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
