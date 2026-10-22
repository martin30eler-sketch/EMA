import test from 'node:test';
import assert from 'node:assert/strict';
import {createMissingIllustration} from '../src/image-fallback.js';

const documentStub={
  createElement(tag){
    return {
      tagName:tag.toUpperCase(),children:[],attributes:{},handlers:{},
      setAttribute(name,value){this.attributes[name]=value;},
      append(child){this.children.push(child);},
      addEventListener(name,callback){this.handlers[name]=callback;}
    };
  }
};
test('texto alternativo y botón de reintento quedan separados para accesibilidad',()=>{
  let retries=0;
  const node=createMissingIllustration(documentStub,{
    className:'scene-image',alt:'Escena 2 del capítulo',onRetry:()=>{retries++;}
  });
  assert.equal(node.className,'scene-image illustration-fallback');
  assert.equal(node.attributes.role,undefined,'el contenedor interactivo no debe tener role img');
  assert.equal(node.children.length,2);
  const [picture,retry]=node.children;
  assert.equal(picture.attributes.role,'img');
  assert.match(picture.attributes['aria-label'],/Escena 2 del capítulo/);
  assert.match(picture.children[0].textContent,/temporalmente no disponible/);
  assert.equal(retry.tagName,'BUTTON');
  assert.equal(retry.type,'button');
  assert.equal(retry.textContent,'Reintentar imagen');
  assert.equal(retry.attributes.role,undefined);
  retry.handlers.click();
  assert.equal(retries,1);
});
test('una portada rota dentro de tarjeta no introduce botones anidados',()=>{
  const cover=createMissingIllustration(documentStub,{
    className:'cover',alt:'Portada del libro',onRetry:()=>{throw Error('No llamar');}
  });
  assert.equal(cover.children.length,1);
  assert.equal(cover.children[0].attributes.role,'img');
  assert.equal(cover.children.some(child=>child.tagName==='BUTTON'),false);
});
