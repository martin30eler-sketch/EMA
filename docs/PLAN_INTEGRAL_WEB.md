# EMA web · Plan integral de ejecución y aceptación
**19/10/2026 · rama main**

**Plan maestro de todo el proyecto:** [ADMINN-EMA/docs/PLAN_MAESTRO_EMA.md](https://github.com/martin30eler-sketch/ADMINN-EMA/blob/main/docs/PLAN_MAESTRO_EMA.md). El historial técnico propio de este repositorio permanece en [PLAN_AVANCE_EMA.md](./PLAN_AVANCE_EMA.md).

## Objetivo y alcance
La web pública EMA ofrece una biblioteca de historias aprobadas y un lector ilustrado responsive. No recibe ni muestra borradores. Consume exclusivamente `/catalogo.json`, `/libros/<id>/libro.json` y las imágenes publicadas. El panel privado ADMINN-EMA administra importación, borradores, edición y aprobación. Android queda bloqueado hasta el cierre verificado de las dos webs.

## Requisitos de lectura
- Catálogo con portada, título, autor y acceso al libro; carga y errores claros.
- Soporte de JSON v1 (texto/imagen por página) y v2 (capítulos, una o dos escenas por página, imágenes, `captionMode`, `layout`).
- Escritorio: libro abierto, ilustraciones apiladas a la izquierda, textos correspondientes a la derecha, giro exclusivo de la hoja derecha.
- Móvil: experiencia adaptada, navegación por páginas, narraciones legibles y acceso táctil.
- Texto largo desplazable, foco accesible, navegación por teclado sin interferir con controles.
- Narración TTS y control de estado al cambiar de página o cerrar el libro.
- Diseño y posicionamiento de texto consistentes con la previsualización del editor.
- Estado de lectura y recuperación al reabrir cuando corresponda.

## Fases, tareas y criterios de cierre
### W0 — Estabilidad y despliegue
- [ ] Ejecutar tests y compilación del repo.
- [ ] Verificar que Cloudflare despliega el commit de `main` y la versión visible coincide.
- [ ] Resolver errores de consola, carga y recursos.
**Aceptación:** build y despliegue exitosos con evidencia.

### W1 — Biblioteca pública
- [ ] Probar catálogo vacío, catálogo con libros y recursos faltantes.
- [ ] Probar apertura, cierre y cambio de libro sin estado residual.
- [ ] Garantizar que borradores y endpoints privados no aparecen.
**Aceptación:** solo libros aprobados visibles y navegables.

### W2 — Lector y diseño responsive
- [x] Validar una y dos escenas por página, capítulos y textos largos. Confirmado por el administrador en su prueba del lector (22/10/2026).
- [x] Comprobar escritorio: izquierda estática y giro de derecha en avance y retroceso. Confirmación manual del administrador (22/10/2026).
- [x] Comprobar móvil y tablet: orientación, recortes, textos, navegación y controles. Confirmación de la experiencia de lectura por el administrador (22/10/2026).
- [x] Probar cambio dinámico de tamaño sin perder página. Lectura y comportamiento responsive dados por probados por el administrador (22/10/2026).
**Aceptación:** presentación y navegación correctas en tamaños representativos.

### W3 — Accesibilidad y narración
- [x] Navegación general con teclado y controles accesibles del lector: confirmados por el administrador (22/10/2026). La comprobación específica con software lector de pantalla no se ha documentado y no se atribuye sin evidencia.
- [x] Verificar contraste, enfoque y textos extensos. Experiencia lectora confirmada por el administrador; la revisión automatizada sigue activa.
- [x] Probar TTS, pausa, cambio de página y salida. El administrador confirmó que la narración ya está probada (22/10/2026).
**Aceptación:** controles accesibles y narración estable.

**Aceptación del usuario (22/10/2026):** el administrador indicó que los recorridos del lector, las páginas dobles, la narración y la lectura móvil **ya están probados**. No volver a presentarlos como pruebas manuales pendientes ni solicitar su repetición. Las pruebas automáticas y despliegues deben mantenerse; solo reabrir el bloque ante regresiones concretas. La corrección de seguridad del contrato de ilustraciones y sus tests continúa en W5.

### W4 — Integración editorial
- [x] Publicar un libro desde ADMINN-EMA: publicación real confirmada por el administrador el 22/10/2026.
- [x] Comprobar commit GitHub, despliegue Cloudflare y aparición en catálogo: CI y check Pages aprobados; aparición del libro confirmada por el administrador.
- [x] Verificar fidelidad de textos, imágenes y páginas del lector: aceptación manual del administrador (22/10/2026); tests de contrato en CI.
- [x] Probar eliminación de una publicación: confirmada por el administrador (22/10/2026).
- [x] Eliminar una historia y volver a publicarla correctamente: confirmado por el administrador el 22/10/2026. No volver a solicitar esa prueba; sin verificación independiente del identificador exacto de ambas operaciones.
- [ ] Probar específicamente edición publicada y resolución de caché obsoleta o conflictos si aparecen casos reales; no repetir publicación, eliminación ni nueva publicación básicas.
**Aceptación:** ciclo editorial completo y verificado.

### W5 — Cierre web
- [ ] Ejecutar pruebas automatizadas y manuales de regresión.
- [ ] Documentar evidencia de aceptación, errores corregidos y despliegue.
- [ ] Confirmar cierre coordinado con ADMINN-EMA antes de iniciar Android.
**Aceptación:** ningún fallo crítico o prioritario pendiente.

## Contrato y seguridad
La publicación se produce exclusivamente por backend autenticado de ADMINN-EMA. GitHub EMA y Cloudflare Pages alojan contenido final público, nunca originales privados, borradores incompletos ni secretos. Se mantiene compatibilidad con libros v1.

## Historial y trazabilidad
Registrar cada entrega con commit, pruebas ejecutadas, despliegue y pendientes en [PLAN_AVANCE_EMA.md](./PLAN_AVANCE_EMA.md). Estado de tarea: pendiente, implementado sin verificar, probado, desplegado, cerrado. No declarar cierre sin evidencia.

## Riesgos y dependencias
- El almacenamiento privado en ADMINN-EMA ya usa Workers KV; la recuperación PC → móvil se confirmó por el administrador el 22/10/2026. La consistencia eventual en conflictos entre regiones sigue siendo un riesgo específico.
- El editor debe conservar posiciones de cuadros que el lector soporte.
- No alterar el flujo Gemini HTML + ZIP del administrador.
- Validar cambios visuales con navegador real, no solo con lectura de código.
