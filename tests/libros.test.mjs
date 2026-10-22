import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBook, validateCatalog } from '../src/libros.js';
const entry={id:'un-libro',title:'Un libro',author:'Autora',pageCount:2,cover:'/libros/un-libro/portada.jpg',bookPath:'/libros/un-libro/libro.json'};
const makeBook=()=>({schemaVersion:1,id:entry.id,title:entry.title,author:entry.author,cover:entry.cover,pages:[{number:1,text:'Texto íntegro.',image:'/libros/un-libro/pagina-001.jpg'},{number:2,text:'Final.',image:'/libros/un-libro/pagina-002.jpg'}]});
test('acepta catálogo y libro publicados completos',()=>{assert.equal(validateCatalog({schemaVersion:1,books:[entry]}).length,1);assert.equal(validateBook(makeBook(),entry).pages.length,2)});
test('bloquea páginas vacías y saltos',()=>{const b=makeBook();b.pages[1].number=3;assert.throws(()=>validateBook(b,entry));b.pages[1].number=2;b.pages[0].text=' ';assert.throws(()=>validateBook(b,entry))});
test('bloquea rutas externas, duplicados y IDs peligrosos',()=>{assert.throws(()=>validateCatalog({schemaVersion:1,books:[entry,{...entry}]}));assert.throws(()=>validateCatalog({schemaVersion:1,books:[{...entry,cover:'https://lh3.googleusercontent.com/x'}]}));assert.throws(()=>validateCatalog({schemaVersion:1,books:[{...entry,id:'../../clave'}]}))});

test('rechaza una tercera escena por página',()=>{const b=makeBook();b.schemaVersion=2;b.pages=b.pages.map((p,i)=>({number:i+1,chapterTitle:'Historia',scenes:[{text:p.text,image:p.image}]}));b.pages[0].scenes.push(...b.pages[0].scenes,...b.pages[0].scenes);assert.throws(()=>validateBook(b,entry));});

test('rechaza texto vacío en escenas v2',()=>{const b=makeBook();b.schemaVersion=2;b.pages=b.pages.map((p,i)=>({number:i+1,chapterTitle:'Historia',scenes:[{text:p.text,image:p.image}]}));b.pages[1].scenes[0].text=' ';assert.throws(()=>validateBook(b,entry));});
test('rechaza geometría inválida en textos flotantes',()=>{const b=makeBook();b.schemaVersion=2;b.pages=b.pages.map((p,i)=>({number:i+1,chapterTitle:'Historia',scenes:[{text:p.text,image:p.image,layout:{x:80,y:5,width:50,fontSize:16}}]}));assert.throws(()=>validateBook(b,entry));});

test('acepta una página v2 con dos escenas y posiciones válidas',()=>{const b=makeBook();b.schemaVersion=2;b.pages=[{number:1,chapterTitle:'Inicio',scenes:[{text:'Primera escena',image:'/libros/un-libro/escena-001.jpg',captionMode:'floating',layout:{x:5,y:10,width:45,fontSize:16}},{text:'Segunda escena',image:'/libros/un-libro/escena-002.jpg',captionMode:'integrated'}]},{number:2,chapterTitle:'Final',scenes:[{text:'Final',image:'/libros/un-libro/escena-003.jpg'}]}];assert.equal(validateBook(b,entry),b);});

test('rechaza capítulo ausente en v2',()=>{const b=makeBook();b.schemaVersion=2;b.pages=b.pages.map((p,i)=>({number:i+1,chapterTitle:'Historia',scenes:[{text:p.text,image:p.image}]}));delete b.pages[0].chapterTitle;assert.throws(()=>validateBook(b,entry));});
test('catálogo rechaza más de 35 páginas',()=>{assert.throws(()=>validateCatalog({schemaVersion:1,books:[{...entry,pageCount:36}]}));});

test('rechaza portadas, páginas y escenas con rutas ajenas o números cambiados',()=>{
  const badCatalog={...entry,cover:'/libros/un-libro/escena-001.jpg'};
  assert.throws(()=>validateCatalog({schemaVersion:1,books:[badCatalog]}),/ficha incorrecta/);
  const legacy=makeBook();
  legacy.pages[0].image='/libros/un-libro/pagina-002.jpg';
  assert.throws(()=>validateBook(legacy,entry),/página 1/);
  const v2={...makeBook(),schemaVersion:2,pages:[
    {number:1,chapterTitle:'Inicio',scenes:[
      {text:'Primera',image:'/libros/un-libro/escena-002.jpg'},
      {text:'Segunda',image:'/libros/un-libro/escena-001.jpg'}
    ]},
    {number:2,chapterTitle:'Final',scenes:[
      {text:'Última',image:'/libros/un-libro/escena-003.jpg'}
    ]}
  ]};
  assert.throws(()=>validateBook(v2,entry),/página 1/);
  v2.pages[0].scenes[0].image='/libros/un-libro/escena-001.jpg';
  v2.pages[0].scenes[1].image='/libros/un-libro/escena-002.jpg';
  assert.equal(validateBook(v2,entry),v2);
  v2.pages[1].scenes[0].image='/libros/un-libro/escena-002.jpg';
  assert.throws(()=>validateBook(v2,entry),/página 2/);
});
