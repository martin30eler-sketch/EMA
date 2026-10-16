# EMA — Historial de avances
## Web pública de «EMA: Historias que Cobran Vida»

**Repositorio:** [EMA](https://github.com/martin30eler-sketch/EMA)  
**Documento de planificación:** [PLAN_MAESTRO_EMA.md](./PLAN_MAESTRO_EMA.md)  
**Fecha de apertura del historial:** 2026-10-16  
**Última actualización registrada:** 2026-10-16  
**Estado actual:** **Planificación documentada; implementación no iniciada.**

Este archivo es la **bitácora cronológica del trabajo real** realizado en el repositorio. Su propósito es permitir saber qué se hizo, por qué se hizo, qué falta, cómo se comprobó y dónde localizar cada cambio. No equivale a un cronograma ni sustituye el plan maestro.

## Registro cronológico

### 2026-10-16 — Hito 002: Distribución pública de ilustraciones por Cloudflare Pages
- **Decisión:** la web EMA servirá portadas e ilustraciones desde Cloudflare Pages y la APK reutilizará esas mismas URLs, nunca enlaces privados de Gemini Storybook.
- **Diseño pendiente:** incorporar imágenes verificadas mediante un despliegue automatizado, no mediante carga directa en runtime. Los borradores deberán permanecer privados.
- **Alcance:** se actualizó [PLAN_MAESTRO_EMA.md](./PLAN_MAESTRO_EMA.md) a v3.1; no se desplegó un sitio ni se subieron todavía los archivos a Cloudflare.
- **Dependencia:** ADMINN-EMA debe construir y autorizar el flujo de publicación de recursos.
- **Estado:** decisión documentada, implementación pendiente.


### 2026-10-16 — Hito 001: Plan maestro inicial
- **Área:** documentación.
- **Realizado:** se creó el plan maestro para una plataforma de lectura con biblioteca pública, narraciones, lector Page Flip 3D, publicación de libros producidos en Gemini Storybook y aplicación Android.
- **Referencia:** commit [4dcc7f0](https://github.com/martin30eler-sketch/EMA/commit/4dcc7f0ce5ce4d15bfd5ff3035fb27aaf848cb4b).
- **Comprobación:** archivo de planificación creado en `docs/`.
- **Estado:** completado (documentación). **No implica código implementado.**

### 2026-10-16 — Hito 002: Separación del panel administrativo
- **Área:** arquitectura y documentación.
- **Realizado:** se actualizó el plan para que el panel editorial y sus operaciones privilegiadas residan en el repositorio privado **ADMINN-EMA**.
- **Referencia:** commit [ea8461e](https://github.com/martin30eler-sketch/EMA/commit/ea8461eeb5029524d0f226ad058dfd091b4f1388).
- **Comprobación:** plan actualizado a versión 2.0.
- **Estado:** completado (decisión arquitectónica).

### 2026-10-16 — Hito 003: Separación de Android
- **Área:** arquitectura y documentación.
- **Realizado:** se estableció que **EMA contiene exclusivamente la web pública**. La APK y el AAB se desarrollarán en **EMA_app**; el panel permanecerá en **ADMINN-EMA**. Se ajustaron arquitectura, estructura y etapas de trabajo.
- **Referencia:** commit [3f740b2](https://github.com/martin30eler-sketch/EMA/commit/3f740b2ec9a82015e8d43c622de01c0909cb0d97).
- **Comprobación:** [plan de web versión 3.0](./PLAN_MAESTRO_EMA.md).
- **Estado:** completado (documentación). **No existe aún la web implementada.**

### 2026-10-16 — Hito 004: Creación de la bitácora
- **Área:** seguimiento.
- **Realizado:** se establece este archivo como historial de avance del proyecto web.
- **Comprobación:** archivo `docs/HISTORIAL_AVANCES.md` guardado en `main`.
- **Estado:** completado (documentación).

## Estado real del proyecto

| Frente | Estado | Evidencia |
|---|---|---|
| Nombre e identidad de producto | Definido conceptualmente | Plan maestro |
| Separación de tres repositorios | Documentada | Plan v3.0 |
| Requisitos de catálogo y lector | Documentados | Plan v3.0 |
| Aplicación web Next.js | **No iniciada** | Sin implementación registrada |
| Backend conectado y datos reales | **No iniciado** | Sin implementación registrada |
| Animación Page Flip 3D | **No iniciada** | Sin prototipo registrado |
| Reproducción/sincronización de narración | **No iniciada** | Sin implementación registrada |
| Despliegue público, pruebas y validación | **No realizados** | Sin URL de despliegue ni pruebas registradas |

## Próximos pasos propuestos (pendientes, no realizados)

1. Definir diseño y navegación de la web pública EMA.
2. Crear la base del proyecto Next.js y su sistema visual.
3. Establecer y probar contrato de datos compartido con ADMINN-EMA y EMA_app.
4. Implementar catálogo y ficha de libro con un ejemplo autorizado.
5. Construir y probar Page Flip 3D y reproductor narrado.
6. Integrar cuentas, favoritos, progreso, accesibilidad y pruebas.
7. Publicar la web solo después de validar permisos y contenido.

## Cómo mantener este historial

Al completar **cada cambio significativo** en EMA, añadir al principio del registro una sección con:

```markdown
### AAAA-MM-DD — Hito NNN: Título breve
- **Área:** interfaz / lector / backend / pruebas / despliegue / documentación.
- **Realizado:** qué cambió de verdad y por qué.
- **Archivos/rutas:** archivos concretos modificados.
- **Referencia:** commit, PR o issue (enlace).
- **Comprobación:** pruebas ejecutadas y resultado; indicar «no ejecutadas» si corresponde.
- **Estado:** completado / parcial / bloqueado.
- **Pendiente:** siguiente acción específica.
```

**Reglas:** registrar hechos, no intenciones; no confundir planificación con código construido; si algo no fue probado, expresarlo. Citar el commit/PR cuando exista y conservar los hitos anteriores sin borrar su historia. Registrar por separado decisiones sobre API que afecten a los otros dos repositorios.
