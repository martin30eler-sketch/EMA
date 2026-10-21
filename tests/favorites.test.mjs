import test from 'node:test';
import assert from 'node:assert/strict';
import {favoriteKey,isFavorite,toggleFavorite,hasReadingProgress} from '../src/favorites.js';
const memory=()=>{
 const values=new Map();
 return {values,getItem:key=>values.has(key)?values.get(key):null,
  setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
};
test('favoritos persisten de manera local y pueden quitarse',()=>{
 const store=memory();
 assert.equal(favoriteKey('mi-amigo-body'),'ema:favorito:mi-amigo-body');
 assert.equal(isFavorite('mi-amigo-body',store),false);
 assert.equal(toggleFavorite('mi-amigo-body',store),true);
 assert.equal(isFavorite('mi-amigo-body',store),true);
 assert.equal(toggleFavorite('mi-amigo-body',store),false);
 assert.equal(isFavorite('mi-amigo-body',store),false);
 assert.equal(store.values.size,0);
});
test('valida IDs y no escribe en otras claves de localStorage',()=>{
 const store=memory();
 assert.equal(toggleFavorite('../../secreto',store),null);
 assert.equal(toggleFavorite('a'.repeat(81),store),null);
 assert.equal(isFavorite('../../secreto',store),false);
 assert.equal(store.values.size,0);
});
test('continúa la lectura solo con páginas previamente guardadas y válidas',()=>{
 const store=memory();
 assert.equal(hasReadingProgress('mi-amigo-body',7,store),false);
 store.setItem('ema:pagina:mi-amigo-body',4);
 assert.equal(hasReadingProgress('mi-amigo-body',7,store),true);
 store.setItem('ema:pagina:mi-amigo-body',99);
 assert.equal(hasReadingProgress('mi-amigo-body',7,store),false);
 store.setItem('ema:pagina:mi-amigo-body','no existe');
 assert.equal(hasReadingProgress('mi-amigo-body',7,store),false);
});
test('fallos de almacenamiento no rompen la biblioteca pública',()=>{
 const store={getItem(){throw Error('bloqueado')},setItem(){throw Error('bloqueado')},removeItem(){throw Error('bloqueado')}};
 assert.equal(isFavorite('libro',store),false);
 assert.equal(toggleFavorite('libro',store),null);
 assert.equal(hasReadingProgress('libro',10,store),false);
});
