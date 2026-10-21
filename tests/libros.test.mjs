import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBook, validateCatalog } from '../src/libros.js';
const entry={id:'un-libro',title:'Un libro',author:'Autora',pageCount:2,cover:'/libros/un-libro/portada.jpg',bookPath:'/libros/un-libro/libro.json'};
const makeBook=()=>({schemaVersion:1,id:entry.id,title:entry.title,author:entry.author,cover:entry.cover,pages:[{number:1,text:'Texto íntegro.',image:'/libros/un-libro/pagina-001.jpg'},{number:2,text:'Final.',image:'/libros/un-libro/pagina-002.jpg'}]});
test('acepta catálogo y libro publicados completos',()=>{assert.equal(validateCatalog({schemaVersion:1,books:[entry]}).length,1);assert.equal(validateBook(makeBook(),entry).pages.length,2)});
test('bloquea páginas vacías y saltos',()=>{const b=makeBook();b.pages[1].number=3;assert.throws(()=>validateBook(b,entry));b.pages[1].number=2;b.pages[0].text=' ';assert.throws(()=>validateBook(b,entry))});
test('bloquea rutas externas, duplicados y IDs peligrosos',()=>{assert.throws(()=>validateCatalog({schemaVersion:1,books:[entry,{...entry}]}));assert.throws(()=>validateCatalog({schemaVersion:1,books:[{...entry,cover:'https://lh3.googleusercontent.com/x'}]}));assert.throws(()=>validateCatalog({schemaVersion:1,books:[{...entry,id:'../../clave'}]}))});

test('rechaza una tercera escena por página',()=>{const b=makeBook();b.schemaVersion=2;b.pages=b.pages.map((p,i)=>({number:i+1,scenes:[{text:p.text,image:p.image}]}));b.pages[0].scenes.push(...b.pages[0].scenes,...b.pages[0].scenes);assert.throws(()=>validateBook(b,entry));});
