import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeReaderPreferences,readReaderPreferences,saveReaderPreferences} from '../src/reader-preferences.js';
function store(){
 const data=new Map();
 return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
}
test('preferencias conservan alto contraste, letra grande y voz',()=>{
 const local=store();
 const chosen={largeText:true,highContrast:true,voiceRate:1.2,autoNarrate:true};
 assert.equal(saveReaderPreferences(chosen,local),true);
 assert.deepEqual(readReaderPreferences(local),chosen);
 assert.equal(local.data.size,1);
});
test('valores corruptos o ajenos regresan a ajustes accesibles seguros',()=>{
 const local=store();
 local.setItem('ema:lectura:preferencias','{rota');
 assert.deepEqual(readReaderPreferences(local),
  {largeText:false,highContrast:false,voiceRate:1,autoNarrate:false});
 assert.deepEqual(normalizeReaderPreferences({largeText:1,highContrast:'yes',voiceRate:100,autoNarrate:'true'}),
  {largeText:false,highContrast:false,voiceRate:1,autoNarrate:false});
});
test('almacenamiento bloqueado no impide leer ni cambiar opciones en memoria',()=>{
 const blocked={getItem(){throw Error('desactivado')},setItem(){throw Error('desactivado')}};
 assert.equal(saveReaderPreferences({largeText:true},blocked),false);
 assert.equal(readReaderPreferences(blocked).largeText,false);
});

test('fallo al obtener localStorage tampoco impide iniciar la biblioteca',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
 if(descriptor&&!descriptor.configurable)return;
 const {isFavorite,toggleFavorite,hasReadingProgress}=await import('../src/favorites.js');
 Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('SecurityError')}});
 try{
  assert.equal(readReaderPreferences().voiceRate,1);
  assert.equal(saveReaderPreferences({largeText:true}),false);
  assert.equal(isFavorite('mi-amigo-body'),false);
  assert.equal(toggleFavorite('mi-amigo-body'),null);
  assert.equal(hasReadingProgress('mi-amigo-body',7),false);
 }finally{
  if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);
  else delete globalThis.localStorage;
 }
});
