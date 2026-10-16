import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateCatalog, validateBook } from '../src/libros.js';

const root = resolve('public');
const local = path => {
  assert.ok(/^\/(?:catalogo\.json|libros\/[a-z0-9-]+\/[a-z0-9-]+\.(?:json|jpg|png|webp))$/.test(path), 'Ruta pública inesperada');
  return resolve(root, '.' + path);
};
const signature = (filename, bytes) => filename.endsWith('.jpg')
  ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
  : filename.endsWith('.png')
  ? bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
  : filename.endsWith('.webp')
  ? bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP'
  : false;

test('ningún libro publicado tiene páginas o imágenes ausentes', () => {
  const catalog = validateCatalog(JSON.parse(readFileSync(local('/catalogo.json'),'utf8')));
  for (const entry of catalog) {
    const path = local(entry.bookPath);
    assert.ok(existsSync(path), 'Libro faltante: '+entry.id);
    const book = validateBook(JSON.parse(readFileSync(path,'utf8')),entry);
    const assets = [book.cover, ...book.pages.map(page=>page.image)];
    assert.equal(new Set(assets).size,assets.length,'Imágenes duplicadas');
    for (const asset of assets) {
      const filename = local(asset);
      assert.ok(existsSync(filename),'Falta imagen: '+asset);
      assert.ok(statSync(filename).size <= 25*1024*1024,'Imagen excede el límite Pages');
      assert.ok(signature(filename,readFileSync(filename)), 'Firma de imagen incorrecta: '+asset);
    }
  }
});
