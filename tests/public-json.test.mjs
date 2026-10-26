import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {freshPublicJsonPath} from '../src/public-json.js';

test('catalogo y libro JSON cambian la clave CDN, sin cambiar la ruta publica',()=>{
 const first=freshPublicJsonPath('/catalogo.json',1700000000000);
 const second=freshPublicJsonPath('/catalogo.json',1700000000000);
 assert.notEqual(first,second,'Dos solicitudes en el mismo milisegundo tampoco comparten caché');
 assert.match(first,/^\/catalogo\.json\?ema_fresh=[a-z0-9-]+$/);
 const book=freshPublicJsonPath('/libros/mi-amigo-body/libro.json',1700000000000);
 assert.match(book,/^\/libros\/mi-amigo-body\/libro\.json\?ema_fresh=[a-z0-9-]+$/);
});

test('no acepta host externo, ruta de imagen ni salida del directorio',()=>{
 for(const path of ['https://evil.example/catalogo.json','//evil.example/catalogo.json',
   '/libros/../libro.json','/libros/book/portada.jpg','/libros/BAD/libro.json',
   '/libros/book/libro.json?revision=1','/admin/token'])
  assert.throws(()=>freshPublicJsonPath(path,1700000000000),/Ruta de JSON/);
 assert.throws(()=>freshPublicJsonPath('/catalogo.json',NaN),/Ruta de JSON/);
});

test('la biblioteca y el lector solicitan JSON sin caché; las imágenes mantienen CDN',async()=>{
 const source=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(source,/fetch\(freshPublicJsonPath\(entry\.bookPath\), \{ cache: 'no-store' \}\)/);
 assert.match(source,/fetch\(freshPublicJsonPath\('\/catalogo\.json'\), \{cache:'no-store'\}\)/);
 assert.match(source,/createImg\(scene\.image,/);
});
