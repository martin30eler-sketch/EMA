/** Clasificación conservadora de deslizamientos táctiles de páginas.
 * No interpreta desplazamientos verticales como cambio de página.
 */
export function swipePageAction(start,end,{minDistance=65,maxDuration=850}={}){
 if(!start||!end||![start.x,start.y,start.time,end.x,end.y,end.time].every(Number.isFinite))return null;
 const dx=end.x-start.x,dy=end.y-start.y,dt=end.time-start.time;
 if(dt<0||dt>maxDuration||Math.abs(dx)<minDistance)return null;
 // El movimiento debe ser claramente horizontal para respetar el scroll del texto.
 if(Math.abs(dx)<Math.abs(dy)*1.5)return null;
 return dx<0?'next':'previous';
}
export function isReaderSwipeTarget(element){
 if(!element||typeof element.closest!=='function')return false;
 // Controles y cuadros con scroll propio siempre conservan su interacción.
 return !element.closest('button,a,input,textarea,select,summary,details,.scene-caption,.spread-narrative,.page-text,.reader-controls,[contenteditable="true"]');
}
