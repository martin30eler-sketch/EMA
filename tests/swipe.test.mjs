import test from 'node:test';
import assert from 'node:assert/strict';
import {swipePageAction,isReaderSwipeTarget} from '../src/swipe.js';
const point=(x,y,time)=>({x,y,time});
test('un deslizamiento horizontal claro navega en la dirección correcta',()=>{
 assert.equal(swipePageAction(point(220,100,0),point(85,108,240)),'next');
 assert.equal(swipePageAction(point(50,100,0),point(190,103,190)),'previous');
});
test('ignora scroll vertical, movimiento corto, lentitud y datos inválidos',()=>{
 assert.equal(swipePageAction(point(200,100,0),point(180,250,210)),null);
 assert.equal(swipePageAction(point(200,100,0),point(160,100,200)),null);
 assert.equal(swipePageAction(point(200,100,0),point(80,100,1700)),null);
 assert.equal(swipePageAction(point(200,100,200),point(80,100,100)),null);
 assert.equal(swipePageAction(null,point(80,100,100)),null);
 assert.equal(swipePageAction(point(NaN,100,0),point(80,100,100)),null);
 assert.equal(swipePageAction(point(200,100,0),point(100,185,200)),null);
});
test('gestos en narraciones desplazables y controles nunca pasan página',()=>{
 const target=selector=>({closest(query){return selector&&query.includes(selector)?this:null;}});
 assert.equal(isReaderSwipeTarget(target('.scene-caption')),false);
 assert.equal(isReaderSwipeTarget(target('.spread-narrative')),false);
 assert.equal(isReaderSwipeTarget(target('.page-text')),false);
 assert.equal(isReaderSwipeTarget(target('button')),false);
 assert.equal(isReaderSwipeTarget(target('summary')),false);
 assert.equal(isReaderSwipeTarget(target('')),true);
 assert.equal(isReaderSwipeTarget(null),false);
});
