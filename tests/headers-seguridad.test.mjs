import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('los recursos públicos no habilitan APIs privadas ni scripts externos',async()=>{
 const headers=await readFile(new URL('../public/_headers',import.meta.url),'utf8');
 assert.match(headers,/X-Content-Type-Options:\s*nosniff/);
 assert.match(headers,/Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'/);
 assert.match(headers,/Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/);
 assert.match(headers,/Referrer-Policy: strict-origin-when-cross-origin/);
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/<script[^>]*\ssrc=['"]https?:/i);
 assert.doesNotMatch(html,/<script(?![^>]*src)[^>]*>/i);
});

test('mantiene la caché de ilustraciones y los JSON se actualizan desde el cliente',async()=>{
 const headers=await readFile(new URL('../public/_headers',import.meta.url),'utf8');
 assert.match(headers,/\/libros\/\*[\s\S]*Cache-Control: public, max-age=300, s-maxage=3600/);
 const reader=await readFile(new URL('../src/main.js',import.meta.url),'utf8');
 assert.match(reader,/fetch\(freshPublicJsonPath\('\/catalogo\.json'\), \{cache:'no-store'\}\)/);
 assert.match(reader,/fetch\(freshPublicJsonPath\(entry\.bookPath\), \{ cache: 'no-store' \}\)/);
});
