/** Evita respuestas JSON antiguas del CDN después de publicar, editar o eliminar.
 * El parámetro afecta solo a catálogo y libro.json, no a las ilustraciones.
 */
let sequence=0;
const allowed=path=>path==='/catalogo.json'||
  /^\/libros\/[a-z0-9]+(?:-[a-z0-9]+)*\/libro\.json$/.test(path);
export function freshPublicJsonPath(path,now=Date.now()){
 if(typeof path!=='string'||!allowed(path)||
    !Number.isSafeInteger(now)||now<0)throw Error('Ruta de JSON público inválida.');
 sequence=(sequence+1)%1000000;
 return path+'?ema_fresh='+now.toString(36)+'-'+sequence.toString(36);
}
