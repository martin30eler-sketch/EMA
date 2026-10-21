/** Preferencias de lectura guardadas únicamente en este navegador. */
const key='ema:lectura:preferencias';
const defaults=Object.freeze({largeText:false,highContrast:false,voiceRate:1,autoNarrate:false});
const rates=new Set([0.8,1,1.2]);
export function normalizeReaderPreferences(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {...defaults};
 return {
  largeText:value.largeText===true,
  highContrast:value.highContrast===true,
  voiceRate:rates.has(value.voiceRate)?value.voiceRate:1,
  autoNarrate:value.autoNarrate===true
 };
}
export function readReaderPreferences(storage=globalThis.localStorage){
 try{const json=storage?.getItem(key);return normalizeReaderPreferences(json?JSON.parse(json):null)}
 catch{return {...defaults}}
}
export function saveReaderPreferences(value,storage=globalThis.localStorage){
 try{if(!storage)return false;
  storage.setItem(key,JSON.stringify(normalizeReaderPreferences(value)));return true;
 }catch{return false}
}
