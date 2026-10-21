import test from 'node:test';
import assert from 'node:assert/strict';
import {navigationAction} from '../src/keyboard.js';
test('teclas de libro permiten avanzar, retroceder e ir a extremos',()=>{
 assert.equal(navigationAction('ArrowRight'),'next');
 assert.equal(navigationAction('PageDown'),'next');
 assert.equal(navigationAction('ArrowLeft'),'previous');
 assert.equal(navigationAction('PageUp'),'previous');
 assert.equal(navigationAction('Home'),'first');
 assert.equal(navigationAction('End'),'last');
});
test('Escape solicita cierre y las teclas ajenas no navegan',()=>{
 assert.equal(navigationAction('Escape'),'exit');
 assert.equal(navigationAction('Tab'),null);
 assert.equal(navigationAction(' '),null);
 assert.equal(navigationAction('Enter'),null);
});
