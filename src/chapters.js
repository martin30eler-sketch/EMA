/** Índice de capítulos del contrato editorial v2, sin fusionar capítulos distintos. */
export function chapterStarts(pages){
 if(!Array.isArray(pages))return [];
 const sections=[];
 let previous=null;
 pages.forEach((page,index)=>{
  const title=typeof page?.chapterTitle==='string'?page.chapterTitle.trim():'';
  if(!title)return;
  if(index===0||title!==previous)sections.push({index,title,page:index+1});
  previous=title;
 });
 return sections;
}
export function currentChapter(starts,pageNumber){
 if(!Array.isArray(starts)||!Number.isInteger(pageNumber))return -1;
 let active=-1;
 for(let i=0;i<starts.length;i++){
  if(starts[i].page<=pageNumber)active=i;
  else break;
 }
 return active;
}
