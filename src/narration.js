/** Narración nativa controlada: iniciar, pausar, reanudar y detener.
 * La generación evita que onend de una voz antigua silencie la nueva página.
 */
export function createNarrator(synth,makeUtterance,onChange=()=>{}){
 let utterance=null,paused=false,generation=0;
 const notify=()=>onChange({playing:Boolean(utterance),paused});
 const stop=()=>{
   generation++;
   try{synth?.cancel?.()}catch{}
   utterance=null;paused=false;notify();
 };
 const speak=(text,language='es-ES')=>{
   if(!synth||typeof makeUtterance!=='function'||typeof text!=='string'||!text.trim())return false;
   stop();
   const myGeneration=++generation;
   const next=makeUtterance(text);
   next.lang=language;
   next.rate=0.95;
   next.onend=next.onerror=()=>{
     if(generation!==myGeneration)return;
     utterance=null;paused=false;notify();
   };
   utterance=next;
   try{synth.speak(next)}catch{
     if(generation===myGeneration){utterance=null;paused=false;generation++;notify()}
     return false;
   }
   notify();return true;
 };
 const togglePause=()=>{
   if(!utterance)return false;
   try{
     if(paused)synth.resume();
     else synth.pause();
   }catch{return false}
   paused=!paused;
   notify();return true;
 };
 return {stop,speak,togglePause,get state(){return {playing:Boolean(utterance),paused}}};
}
