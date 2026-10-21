import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join,basename} from 'node:path';
import {validateCatalog,validateBook} from '../src/libros.js';

const root=resolve('public');
const entries=validateCatalog(JSON.parse(await readFile(join(root,'catalogo.json'),'utf8')));

test('biblioteca pública contiene exclusivamente libros con ID y título únicos',()=>{
 const ids=entries.map(item=>item.id);
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(entries.every(item=>item.title.trim()&&item.author.trim()));
});

for(const entry of entries){
 test('libro publicado: '+entry.id+' conserva JSON y todas sus imágenes originales',async()=>{
   const folder=join(root,'libros',entry.id);
   const json=await readFile(join(folder,'libro.json'),'utf8');
   const book=validateBook(JSON.parse(json),entry);
   assert.equal(book.pages.length,entry.pageCount);
   const images=[book.cover,...book.pages.flatMap(page=>
     book.schemaVersion===2?page.scenes.map(scene=>scene.image):[page.image])];
   assert.equal(new Set(images).size,images.length,
     'Las ilustraciones de un libro deben estar numeradas sin duplicados.');
   const expected=new Set(['libro.json',...images.map(path=>{
     assert.ok(path.startsWith('/libros/'+entry.id+'/'));
     return basename(path);
   })]);
   for(const name of expected){
     const file=await stat(join(folder,name));
     assert.ok(file.isFile()&&file.size>0,'Archivo vacío o inválido: '+name);
   }
   const actual=await readdir(folder);
   assert.deepEqual(actual.sort(),[...expected].sort(),
     'Hay recursos de la publicación faltantes o sobrantes.');
 });
}
