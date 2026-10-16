# EMA: Historias que Cobran Vida
## Plan maestro — página web pública de lectura

**Versión:** 3.1  
**Fecha:** 16 de octubre de 2026  
**Repositorio:** [EMA](https://github.com/martin30eler-sketch/EMA) (**público**)  
**Panel administrativo separado:** [ADMINN-EMA](https://github.com/martin30eler-sketch/ADMINN-EMA) (**privado**)  
**App Android separada:** [EMA_app](https://github.com/martin30eler-sketch/EMA_app) (**privado**).

> **Decisión definitiva:** EMA contiene **solo la web pública** de lectura. Ni el panel de administración ni la app Android viven en este repositorio. Todos consumen un backend común bajo permisos diferenciados.

## 0. Actualización de infraestructura — imágenes en Cloudflare Pages

**Decisión confirmada el 16/10/2026:** **portadas e ilustraciones publicadas se distribuyen desde Cloudflare Pages** del sitio web EMA, con direcciones HTTP públicas que utilizarán tanto EMA web como EMA_app Android. Los links de imágenes `lh3.googleusercontent.com/gg-dl` de Gemini Storybook **no funcionan desde cuentas externas** y no se usarán como origen para lectores.

**Preparación requerida:** ADMINN-EMA importa HTML+ZIP del Storybook, extrae y verifica **todo el texto** y las imágenes (incluida portada), presenta vista previa y, tras aprobación, usa un mecanismo protegido para integrar archivos estáticos optimizados en un **nuevo despliegue de Pages**. Guardar en el catálogo la ruta/URL pública correspondiente a cada página. El hecho de que Pages sirva contenido estático implica que **no se puede insertar una imagen arbitraria en producción mediante un simple upload del navegador sin redesplegar**. No se deben exponer claves de despliegue en web pública, APK o cliente ADMINN-EMA.

**Organización propuesta:** rutas `/libros/<id>/portada.webp`, `/libros/<id>/pagina-001.webp`, etc. El sitio EMA sirve exclusivamente libros publicados; los borradores e imágenes no aprobadas permanecen privados hasta ser publicados. Cloudflare R2 no se contrata para el lanzamiento; se reevalúa si el número de libros/archivos o necesidad de cargas dinámicas lo justifica. Audio/narración queda como decisión de alojamiento separada.

**Estado:** decisión documentada pero no implementada. La web pública sigue sin código ni despliegue; la primera versión del panel ADMINN-EMA que se había escrito usa Supabase y requiere migración si se adopta definitivamente Firebase Spark como backend de metadatos.

## 1. Visión y marca

**EMA: Historias que Cobran Vida** permite leer y escuchar libros con ilustraciones y un efecto tridimensional de pasar páginas. Su identidad es editorial, elegante y mágica. La web funciona para cualquier lector desde un navegador y no exige instalar la APK.

- Nombre oficial de la web y Android: **EMA: Historias que Cobran Vida** (30 caracteres).
- **Gemini Storybook** se utiliza externamente para **crear el contenido**, nunca como reproductor obligado para los lectores.
- El contenido se prepara, importa, corrige y publica desde **ADMINN-EMA**, no desde este sitio.
- Un libro publicado se consulta desde la **web EMA** y desde la **APK EMA_app**, ambas conectadas al mismo catálogo.
- Se requiere verificar la disponibilidad comercial de la marca y dominio antes del lanzamiento.

## 2. Mapa de los tres proyectos

| Repositorio | Responsabilidad exclusiva | Exclusiones |
|---|---|---|
| **EMA** — web pública (este repo) | Inicio, biblioteca, búsqueda, fichas, lector animado y narrado, perfiles y favoritos en navegador | No APK ni código administrativo |
| **ADMINN-EMA** — panel privado | Importar, editar, previsualizar y publicar libros y narraciones; operaciones editoriales privilegiadas | No biblioteca pública ni aplicación Android |
| **EMA_app** — Android privado | App nativa instalable, catálogo, lector animado, audio, progreso, favoritos y compilaciones APK/AAB | No administración ni sitio web público |

**Un backend compartido** entrega exclusivamente contenidos publicados a la web y Android. Las acciones de publicación deben exigir credenciales y roles en el servidor. **Nunca** compartir secretos del panel con los clientes públicos.

\`\`\`mermaid
flowchart TD
    G[Gemini Storybook - creación externa] -. archivos autorizados .-> A[ADMINN-EMA - panel privado]
    A --> S[Backend editorial protegido]
    S --> D[(Base de datos y almacenamiento compartidos)]
    D --> P[API pública controlada]
    P --> W[EMA - web pública]
    P --> M[EMA_app - Android]
    L[Lectores] --> W
    L --> M
\`\`\`

### Acuerdos entre repositorios

- Usar IDs de libros y páginas estables; definir versionado y tipos del contrato de contenido.
- Publicar cambios compatibles en la API para que web y APK no fallen al actualizarse independientemente.
- Mantener separados los despliegues, repositorios, CI y variables de entorno.
- Una única estrategia de migraciones de base de datos, acordada entre equipos.
- El repositorio EMA es **público**: no agregar credenciales ni datos privados.
- No incluir rutas \`/admin\`, código de importación de archivos o acciones de publicación en este repositorio.

## 3. Arquitectura propuesta de la web

| Componente | Propuesta | Razón |
|---|---|---|
| Framework | Next.js + React + TypeScript | SEO y experiencia pública con buen rendimiento |
| Estilos | Sistema de componentes y tokens EMA | Identidad editorial consistente |
| Autenticación | Supabase Auth | Sincronizar progreso y favoritos con Android |
| Catálogo | API compartida, solo libros publicados | Separación de privilegios |
| Recursos | Storage/CDN según derechos | Portadas, páginas y audios optimizados |
| Lector | Page Flip 3D con alternativa accesible | Simular las hojas físicas sin bloquear lectura |
| Narración | Audio preparado por ADMINN-EMA | Controles reproducir, pausar y sincronizar páginas |
| Calidad | Pruebas automáticas + accesibilidad | Seguridad y lectura estable |

### Estructura prevista

\`\`\`text
EMA/
├── README.md
├── docs/
│   └── PLAN_MAESTRO_EMA.md
├── src/
│   ├── app/                 # Inicio, explorar, biblioteca, ficha, lector
│   ├── components/          # Componentes web públicos
│   ├── reader/              # Page Flip, audio y progreso
│   ├── lib/                 # Cliente API, contratos y validación
│   └── styles/              # Estilos/tokens EMA
├── public/                  # Recursos estáticos no confidenciales
├── tests/                   # Pruebas de usuario y contrato
└── .github/workflows/       # CI exclusivo de web
\`\`\`

La estructura es propuesta; todavía no se ha creado el código.

## 4. Funciones de la web pública — MVP

1. **Inicio:** marca EMA, libros destacados, novedades y acceso a continuar leyendo.
2. **Biblioteca:** listado con portadas, categorías, filtros, búsqueda y paginación.
3. **Ficha de libro:** título, portada, autor, descripción, idioma, género y botón Leer.
4. **Lector animado:** páginas enfrentadas cuando haya espacio; paso manual adelante/atrás con efecto Page Flip 3D, sombras y perspectiva.
5. **Escuchar historia:** reproductor narrado con reproducción, pausa, velocidad y paso automático de página cuando corresponde.
6. **Cuenta del lector:** favoritos y progreso almacenados por usuario; explorar y leer libros públicos sin registrarse.
7. **Accesibilidad:** controles por teclado, alto contraste, alternativa con movimiento reducido, texto alternativo y diseño responsive.
8. **Estados del sistema:** carga, sin resultados, pérdida de red, audio no disponible y recuperación del avance.

### Criterios de calidad del lector

- Páginas ordenadas sin cortes ni capas superpuestas durante el giro.
- Carga progresiva de la imagen siguiente; tamaño y resolución adaptados.
- Audio que no se desincroniza tras pausar, retroceder o cambiar manualmente.
- Comportamiento usable en móviles, tabletas y escritorio.
- Reducción/desactivación de animaciones disponible por accesibilidad.
- Prototipo prioritario con un libro real de 8–12 páginas y narración.

## 5. Contrato del libro que consume la web

### Datos mínimos

| Entidad | Campos principales |
|---|---|
| \`books\` | ID, slug, título, autor, sinopsis, idioma, portada, estado, fecha publicación |
| \`pages\` | ID, book_id, orden, imagen, texto narrable, alt, diseño |
| \`narrations\` | Libro/página, voz, idioma, URL autorizada, duración |
| \`narration_cues\` | Marcas temporales de sincronización, cuando existan |
| \`categories\` | Género, categoría y etiquetas |
| \`favorites\`, \`reading_progress\` | Usuario, libro, página, tiempo y fecha de actualización |

### API conceptual

- \`GET /books\`: solo catálogo publicado.
- \`GET /books/:slug\`: ficha y páginas autorizadas.
- \`GET /books/:id/assets\`: imágenes y audio según permisos.
- \`GET/PUT /me/progress/:bookId\`: progreso del lector identificado.
- \`GET/POST/DELETE /me/favorites\`: favoritos del lector identificado.

Los nombres de endpoints son orientativos. La web no debe poder consultar borradores ni modificar el catálogo. Las políticas de acceso deben aplicarse en la API, la base de datos y el almacenamiento.

## 6. Experiencia de narración

**Modo leer:** se pasan las páginas manualmente.  
**Modo escuchar:** se reproduce el audio asociado; al terminar una página, se anima el giro y empieza la siguiente. Se permite pausar, variar la velocidad y navegar.

El audio del visor Gemini Storybook **no debe asumirse exportable**. ADMINN-EMA adjunta narraciones propias o legítimamente autorizadas. El lector público solo las reproduce. Si no hay audio disponible, la historia sigue siendo completamente legible.

## 7. Seguridad y cumplimiento

- Separar cuentas de lectores de privilegios de administración.
- No incluir rutas admin, credenciales de servicio ni claves privadas.
- Proteger progresos y favoritos por usuario.
- Mostrar solo materiales publicados, con control de acceso a los archivos.
- Verificar licencias del contenido y privacidad de datos.
- Evitar rastreos invasivos y hacer accesible la lectura.
- Mantener una experiencia diferenciada pero visualmente coherente con EMA_app.

## 8. Plan de ejecución web

| Etapa | Entregable | Integración |
|---|---|---|
| 0. Diseño | Identidad EMA, wireframes web, lector 3D en prototipo | Acordar contrato con ADMINN-EMA y EMA_app |
| 1. Base | Next.js, diseño, cliente API y autenticación | Leer catálogo del backend compartido |
| 2. Catálogo | Inicio, biblioteca, categorías, búsqueda y ficha | Mostrar libros publicados por ADMINN-EMA |
| 3. Lector | Page Flip 3D, controles y responsive | Abrir páginas del contrato común |
| 4. Narración | Reproducción, velocidad y sincronización | Consumir audio preparado en el panel |
| 5. Personalización | Favoritos, progreso y reanudación | Sincronizar datos con EMA_app |
| 6. Lanzamiento | Pruebas, accesibilidad, SEO y hosting | Verificar una publicación completa |

### Condiciones para aceptar el MVP

- Un administrador publica un libro desde **ADMINN-EMA**.
- El libro aparece en la **web EMA** sin cambio de código.
- Un usuario lo lee dentro de EMA con giro de páginas y, si existe, escucha su narración.
- La cuenta conserva favoritos y progreso para continuar después en **EMA_app**.
- No se expone ninguna herramienta ni secreto administrativo.

### Fuera del MVP

Creación de historias mediante IA dentro del sitio, red social, comentarios, pagos, compra de libros, función de publicación por usuarios, traducción automática y descargas completas offline.

---

**Estado:** documento de planificación de la **web pública EMA únicamente**. El desarrollo de Android se realizará exclusivamente en \`EMA_app\`, y el panel editorial exclusivamente en \`ADMINN-EMA\`.
