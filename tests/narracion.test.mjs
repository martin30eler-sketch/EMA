import test from 'node:test';
import assert from 'node:assert/strict';
import {createNarrator} from '../src/narration.js';

function fakeVoice(){
 const utterances=[],calls=[];
 const synth={
  speak(utterance){utterances.push(utterance);calls.push('speak')},
  cancel(){calls.push('cancel')},
  pause(){calls.push('pause')},
  resume(){calls.push('resume')}
 };
 const snapshots=[];
 const narrator=createNarrator(synth,text=>({text}),state=>snapshots.push({...state}));
 return {narrator,utterances,calls,snapshots};
}
test('inicia, pausa y reanuda narraciones sin borrar el texto',()=>{
 const voice=fakeVoice();
 assert.equal(voice.narrator.speak('Página completa.'),true);
 assert.equal(voice.utterances[0].text,'Página completa.');
 assert.equal(voice.utterances[0].lang,'es-ES');
 assert.equal(voice.narrator.togglePause(),true);
 assert.deepEqual(voice.narrator.state,{playing:true,paused:true});
 assert.equal(voice.narrator.togglePause(),true);
 assert.deepEqual(voice.narrator.state,{playing:true,paused:false});
 assert.deepEqual(voice.calls.slice(-3),['speak','pause','resume']);
});
test('al cambiar de página, eventos tardíos de la voz anterior no detienen la nueva',()=>{
 const voice=fakeVoice();
 voice.narrator.speak('Primera página');
 const first=voice.utterances[0];
 voice.narrator.speak('Segunda página');
 const second=voice.utterances[1];
 first.onend();
 assert.equal(voice.narrator.state.playing,true);
 second.onend();
 assert.equal(voice.narrator.state.playing,false);
});
test('detiene la voz al cerrar y no permite pausar si no reproduce',()=>{
 const voice=fakeVoice();
 voice.narrator.speak('Lectura');
 const old=voice.utterances[0];
 voice.narrator.stop();
 old.onerror();
 assert.deepEqual(voice.narrator.state,{playing:false,paused:false});
 assert.equal(voice.narrator.togglePause(),false);
 assert.ok(voice.calls.includes('cancel'));
});
test('no anuncia narración si el motor falla o falta texto',()=>{
 const narrator=createNarrator({cancel(){},speak(){throw Error('Voz no disponible')}},
  text=>({text}));
 assert.equal(narrator.speak('Hola'),false);
 assert.equal(narrator.state.playing,false);
 assert.equal(narrator.speak('  '),false);
});

test('la velocidad de la narración es configurable y se mantiene acotada',()=>{
 const utterances=[];
 const synth={speak:next=>utterances.push(next),cancel(){}};
 const narrator=createNarrator(synth,text=>({text}));
 narrator.speak('Lenta','es-ES',0.8);
 narrator.speak('Rápida','es-ES',1.2);
 narrator.speak('Incoherente','es-ES',Number.POSITIVE_INFINITY);
 assert.deepEqual(utterances.map(voice=>voice.rate),[0.8,1.2,1]);
});
test('la continuación automática solo se dispara al terminar naturalmente la página vigente',()=>{
 let completed=0;
 const voices=[];
 const narrator=createNarrator({speak:voice=>voices.push(voice),cancel(){}},
  text=>({text}),()=>{},()=>completed++);
 narrator.speak('Una página');
 const previous=voices[0];
 narrator.speak('La página siguiente');
 previous.onend();
 assert.equal(completed,0);
 voices[1].onerror();
 assert.equal(completed,0);
 narrator.speak('Otra página');
 voices[2].onend();
 assert.equal(completed,1);
 voices[2].onend();
 assert.equal(completed,2);
});
