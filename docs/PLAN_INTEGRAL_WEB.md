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
- [ ] Validar una y dos escenas por página, capítulos y textos largos.
- [ ] Comprobar escritorio: izquierda estática y giro de derecha en avance y retroceso.
- [ ] Comprobar móvil y tablet: orientación, recortes, textos, navegación y controles.
- [ ] Probar cambio dinámico de tamaño sin perder página.
**Aceptación:** presentación y navegación correctas en tamaños representativos.

### W3 — Accesibilidad y narración
- [ ] Probar navegación con teclado y lector de pantalla.
- [ ] Verificar contraste, enfoque y textos extensos.
- [ ] Probar TTS, pausa, cambio de página y salida.
**Aceptación:** controles accesibles y narración estable.

### W4 — Integración editorial
- [ ] Publicar un libro de prueba desde ADMINN-EMA.
- [ ] Comprobar commit GitHub, despliegue Cloudflare y aparición en catálogo.
- [ ] Verificar texto, imagen y layout de todas las escenas.
- [ ] Probar edición de libro publicado, eliminación y republicación sin caché obsoleta.
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
- El almacenamiento privado de borradores depende de ADMINN-EMA y aún está pendiente.
- El editor debe conservar posiciones de cuadros que el lector soporte.
- No alterar el flujo Gemini HTML + ZIP del administrador.
- Validar cambios visuales con navegador real, no solo con lectura de código.
