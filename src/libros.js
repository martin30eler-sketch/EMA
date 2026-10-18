/**
 * Contrato compartido EMA web / EMA_app / ADMINN-EMA (schemaVersion 1).
 * El navegador solo consume rutas internas de Cloudflare Pages, nunca Firebase ni GitHub.
 */
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const asset = (id, name) => typeof name === 'string' &&
  name.startsWith('/libros/' + id + '/') && !name.includes('..') &&
  !name.includes('?') && !name.includes('#') && !name.includes('\\');

const titleOK = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 240;

export function validateCatalog(input) {
  if (!input || input.schemaVersion !== 1 || !Array.isArray(input.books)) throw Error('Catálogo incompatible.');
  const known = new Set();
  return input.books.map(entry => {
    if (!entry || !ID.test(entry.id || '') || known.has(entry.id) ||
      !titleOK(entry.title) || !titleOK(entry.author) ||
      !Number.isInteger(entry.pageCount) || entry.pageCount < 1 ||
      !asset(entry.id, entry.cover) ||
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
      book.pages.length !== entry.pageCount) throw Error('El libro no coincide con el catálogo.');
  book.pages.forEach((page, index) => {
    if (book.schemaVersion === 2) {
      if (!page || page.number !== index + 1 || !Array.isArray(page.scenes) || !page.scenes.length || page.scenes.length > 8 ||
          page.scenes.some(scene => !scene || !asset(book.id, scene.image) || typeof scene.text !== 'string' || !scene.text.trim())) {
        throw Error('Falta texto editable o ilustración en la página ' + (index + 1) + '.');
      }
      return;
    }
    if (!page || page.number !== index + 1 || typeof page.text !== 'string' ||
        !page.text.trim() || !asset(book.id, page.image)) {
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
