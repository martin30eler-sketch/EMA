import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterStarts,currentChapter} from '../src/chapters.js';
test('agrupa páginas consecutivas del mismo capítulo sin fusionar páginas',()=>{
 const pages=[
  {number:1,chapterTitle:'Encuentro'},
  {number:2,chapterTitle:'Encuentro'},
  {number:3,chapterTitle:'Aventura'},
  {number:4,chapterTitle:'Aventura'},
  {number:5,chapterTitle:'Final'}];
 const chapters=chapterStarts(pages);
 assert.deepEqual(chapters,[{index:0,title:'Encuentro',page:1},
  {index:2,title:'Aventura',page:3},{index:4,title:'Final',page:5}]);
 assert.equal(currentChapter(chapters,2),0);
 assert.equal(currentChapter(chapters,4),1);
 assert.equal(currentChapter(chapters,5),2);
});
test('el índice omite formato legado sin capítulos y acepta vacíos',()=>{
 assert.deepEqual(chapterStarts([{number:1,text:'Narración'}]),[]);
 assert.deepEqual(chapterStarts(null),[]);
 assert.equal(currentChapter([],1),-1);
});
test('título repetido no consecutivo permanece como otro capítulo independiente',()=>{
 const starts=chapterStarts([{chapterTitle:'A'},{chapterTitle:'B'},{chapterTitle:'A'}]);
 assert.deepEqual(starts.map(x=>x.page),[1,2,3]);
});
