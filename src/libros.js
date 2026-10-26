/**
 * Contrato compartido EMA web / EMA_app / ADMINN-EMA (schemaVersion 1).
 * El navegador solo consume rutas internas de Cloudflare Pages, nunca Firebase ni GitHub.
 */
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePath = (id,stem,name) => typeof name === 'string' &&
  ['jpg','png','webp'].some(ext => name === '/libros/' + id + '/' + stem + '.' + ext);
const pad = number => String(number).padStart(3,'0');

const titleOK = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 240;
const pageTextOK = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 10000;
const layoutOK = layout => layout == null || (typeof layout === 'object' && !Array.isArray(layout) &&
  [['x',0,95],['y',0,95],['width',25,90],['fontSize',10,24]].every(([key,min,max]) =>
    typeof layout[key] === 'number' && Number.isFinite(layout[key]) && layout[key] >= min && layout[key] <= max) &&
  layout.x + layout.width <= 100);

export function validateCatalog(input) {
  if (!input || input.schemaVersion !== 1 || !Array.isArray(input.books)) throw Error('Catálogo incompatible.');
  const known = new Set();
  return input.books.map(entry => {
    if (!entry || !ID.test(entry.id || '') || known.has(entry.id) ||
      entry.id.length > 80 || !titleOK(entry.title) || !titleOK(entry.author) ||
      !Number.isInteger(entry.pageCount) || entry.pageCount < 1 || entry.pageCount > 35 ||
      !imagePath(entry.id,'portada',entry.cover) ||
      entry.bookPath !== '/libros/' + entry.id + '/libro.json') {
      throw Error('El catálogo contiene una ficha incorrecta.');
    }
    known.add(entry.id);
    return entry;
  });
}

export function validateBook(book, entry) {
  if (!book || ![1,2].includes(book.schemaVersion) || book.id !== entry.id ||
      book.title !== entry.title || book.author !== entry.author ||
      book.cover !== entry.cover || !Array.isArray(book.pages) ||
      book.pages.length !== entry.pageCount || book.pages.length > 35) throw Error('El libro no coincide con el catálogo.');
  let sceneIndex=0;
  book.pages.forEach((page, index) => {
    if (book.schemaVersion === 2) {
      if (!page || page.number !== index + 1 || typeof page.chapterTitle !== 'string' || !Array.isArray(page.scenes) || !page.scenes.length || page.scenes.length > 2 ||
          page.scenes.some(scene => !scene || !imagePath(book.id,'escena-'+pad(++sceneIndex),scene.image) || !pageTextOK(scene.text) || !layoutOK(scene.layout) || ![undefined,'integrated','floating'].includes(scene.captionMode))) {
        throw Error('Falta texto editable o ilustración en la página ' + (index + 1) + '.');
      }
      return;
    }
    if (!page || page.number !== index + 1 || !pageTextOK(page.text) ||
        !imagePath(book.id,'pagina-'+pad(index+1),page.image)) {
      throw Error('Falta texto o ilustración en la página ' + (index + 1) + '.');
    }
  });
  return book;
}

export function progressKey(id) { return 'ema:pagina:' + id; }
export function readProgress(id, count) {
  try {
    const value = Number(localStorage.getItem(progressKey(id)));
    return Number.isInteger(value) && value >= 1 && value <= count ? value : 1;
  } catch { return 1; }
}
export function writeProgress(id, page) {
  try { localStorage.setItem(progressKey(id), String(page)); } catch { /* almacenamiento deshabilitado */ }
}
