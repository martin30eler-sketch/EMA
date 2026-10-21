/** Favoritos locales de lectura, sin cuentas ni datos enviados al servidor. */
const prefix='ema:favorito:';
const browserStorage=()=>{try{return globalThis.localStorage}catch{return null}};
const validId=id=>typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)&&id.length<=80;
export const favoriteKey=id=>validId(id)?prefix+id:null;
export function isFavorite(id,storage=browserStorage()){
 const key=favoriteKey(id);
 if(!key||!storage)return false;
 try{return storage.getItem(key)==='1'}catch{return false}
}
export function toggleFavorite(id,storage=browserStorage()){
 const key=favoriteKey(id);
 if(!key||!storage)return null;
 try{
   const next=storage.getItem(key)!=='1';
   if(next)storage.setItem(key,'1');
   else storage.removeItem(key);
   return next;
 }catch{return null}
}
export function hasReadingProgress(id,count,storage=browserStorage()){
 if(!validId(id)||!Number.isInteger(count)||count<1||!storage)return false;
 try{
   const raw=storage.getItem('ema:pagina:'+id);
   if(raw===null)return false;
   const page=Number(raw);
   return Number.isInteger(page)&&page>=1&&page<=count;
 }catch{return false}
}
