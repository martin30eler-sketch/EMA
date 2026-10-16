# EMA: Historias que Cobran Vida · Web pública

Web de lectura pública independiente de [ADMINN-EMA](https://github.com/martin30eler-sketch/ADMINN-EMA) y de EMA_app (APK Android).

## Arranque
```bash
npm install
npm test
npm run dev
npm run build
```

## Arquitectura gratuita elegida
- Los **textos definitivos en JSON** se versionan en GitHub y se sirven desde **Cloudflare Pages**, igual que portadas e ilustraciones.
- El navegador no consulta GitHub directamente y no depende de Firestore: solicita `/catalogo.json` y `/libros/<id>/libro.json`.
- El historial de lectura se guarda en `localStorage` (sin servidor). La lectura y el narrador por voz integrado del navegador no exigen cuenta.
- Datos sociales futuros: Workers + D1, aislados de la lectura. Firebase FCM/Crashlytics quedará para la APK cuando se configure.

## Contrato de publicación v1
```text
public/
  catalogo.json
  libros/
    ejemplo/
      libro.json
      portada.jpg
      pagina-001.jpg
      pagina-002.jpg
```

`catalogo.json`: `{"schemaVersion":1,"books":[{"id":"ejemplo","title":"Título","author":"Autora","pageCount":2,"cover":"/libros/ejemplo/portada.jpg","bookPath":"/libros/ejemplo/libro.json"}]}`

`libro.json`: `{"schemaVersion":1,"id":"ejemplo","title":"Título","author":"Autora","cover":"/libros/ejemplo/portada.jpg","pages":[{"number":1,"text":"Texto completo...","image":"/libros/ejemplo/pagina-001.jpg"},{"number":2,"text":"...","image":"/libros/ejemplo/pagina-002.jpg"}]}`

No subir borradores, documentos originales de sesión de Gemini, tokens ni imágenes no aprobadas. El catálogo vacío es deliberado: **no se ha autorizado aún publicar el libro piloto**, aunque el importador ya dispone de su texto.

## Despliegue a Cloudflare Pages (pendiente de vincular cuenta)
1. Cloudflare → Workers & Pages → Create → Pages → conectar repositorio GitHub `martin30eler-sketch/EMA`.
2. Framework: **Vite**; comando de build: `npm run build`; directorio de salida: `dist`; raíz: `/`.
3. Elegir proyecto, confirmar permisos y desplegar. Los pushes posteriores generan un nuevo despliegue.
4. Para añadir libros, incorporar a `public/libros/<id>/` el paquete aprobado y actualizar `public/catalogo.json` con la ficha. Esa publicación tendrá que automatizarse desde ADMINN-EMA mediante un backend autorizado; aún no está conectada.

No hay URL pública de Pages ni claves Cloudflare configuradas todavía. Este README no implica despliegue real.
