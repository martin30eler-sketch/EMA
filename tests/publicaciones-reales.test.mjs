import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join,basename} from 'node:path';
import {validateCatalog,validateBook} from '../src/libros.js';

const root=resolve('public');
const entries=validateCatalog(JSON.parse(await readFile(join(root,'catalogo.json'),'utf8')));

function imageSignatureValid(bytes,ext){
 if(ext==='jpg')return bytes.length>=4&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 if(ext==='png')return bytes.length>=8&&
   [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
 if(ext==='webp')return bytes.length>=12&&
   bytes.subarray(0,4).toString('ascii')==='RIFF'&&
   bytes.subarray(8,12).toString('ascii')==='WEBP';
 return false;
}


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
   for(const picture of images){
     const name=basename(picture);
     const ext=name.split('.').pop().toLowerCase();
     const handle=await readFile(join(folder,name));
     assert.ok(imageSignatureValid(handle,ext),
       'La ilustración '+name+' del libro '+entry.id+' tiene una firma de imagen inválida.');
   }
   const actual=await readdir(folder);
   assert.deepEqual(actual.sort(),[...expected].sort(),
     'Hay recursos de la publicación faltantes o sobrantes.');
 });
}


test('una publicación eliminada no deja libros accesibles fuera del catálogo',async()=>{
 let folders;
 try{folders=await readdir(join(root,'libros'),{withFileTypes:true})}
 catch(error){
   if(error.code==='ENOENT'){
     assert.equal(entries.length,0,'Sin carpeta de libros no debe haber fichas publicadas');
     return;
   }
   throw error;
 }
 const active=new Set(entries.map(entry=>entry.id));
 for(const folder of folders){
   assert.ok(folder.isDirectory(),'Archivo inesperado en carpeta pública libros: '+folder.name);
   assert.ok(active.has(folder.name),
     'Un libro no listado en el catálogo sigue siendo público: '+folder.name);
 }
 assert.equal(folders.length,active.size,'Cada ficha debe corresponder a una sola carpeta publicada');
});
