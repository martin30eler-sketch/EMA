import { validateCatalog, validateBook, readProgress, writeProgress } from './libros.js';
import {createNarrator} from './narration.js';
import {navigationAction} from './keyboard.js';
import {swipePageAction,isReaderSwipeTarget} from './swipe.js';
import {chapterStarts,currentChapter} from './chapters.js';
import './styles.css';

const app = document.getElementById('app');
const state = { books: [], selected: null, page: 1, current: null, speech: false, speechPaused: false, voiceRate: 1, autoNarrate: false, moving: false, view: 'auto', requestId: 0 };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopSpread = window.matchMedia('(min-width: 681px)');
const narrator = ('speechSynthesis' in window && typeof SpeechSynthesisUtterance!=='undefined')
  ? createNarrator(window.speechSynthesis,text=>new SpeechSynthesisUtterance(text),status=>{
      state.speech=status.playing;state.speechPaused=status.paused;updateVoiceButton();
    },()=>{
      if(state.autoNarrate&&state.selected&&!state.moving&&state.page<state.selected.pages.length)
        turnTo(state.page+1,true);
    }):null;
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const button = (label, cls, fn) => {
  const node = el('button', cls, label);
  node.type = 'button';
  node.addEventListener('click', fn);
  return node;
};
function createImg(src, alt, className) {
  const img = el('img', className);
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  return img;
}
function shell() {
  app.replaceChildren();
  const header = el('header', 'site-header');
  const logo = button('EMA', 'brand', () => showLibrary());
  logo.setAttribute('aria-label', 'Volver a la biblioteca EMA');
  const subtitle = el('span', 'brand-description', 'HISTORIAS QUE COBRAN VIDA');
  const brand = el('div', 'brand-wrap');
  brand.append(logo, subtitle);
  const nav = el('nav');
  nav.append(button('Biblioteca', 'nav-button', showLibrary));
  header.append(brand, nav);
  const main = el('main', 'main');
  main.id = 'contenido';
  app.append(header, main, el('footer', 'footer', 'EMA · Un universo de historias para leer y escuchar'));
  return main;
}
function stopVoice() {
  narrator?.stop();
  state.speech = false;
  state.speechPaused = false;
}
function showLibrary(message) {
  state.requestId += 1;
  stopVoice();
  state.selected = null;
  state.moving = false;
  const main = shell();
  const hero = el('section', 'hero');
  hero.append(el('p', 'eyebrow', 'Biblioteca digital de EMA'), el('h1', '', 'Historias que cobran vida'),
    el('p', 'hero-description', 'Descubre un refugio para la imaginación. Cada página, una nueva aventura.'));
  main.append(hero);
  const heading = el('div', 'section-heading');
  heading.append(el('h2', '', 'Explorar historias'), el('span', 'result-count', state.books.length + ' libros'));
  main.append(heading);
  const search = el('input', 'search-field');
  search.type = 'search';
  search.placeholder = 'Buscar por título o autor…';
  search.setAttribute('aria-label', 'Buscar libros');
  main.append(search);
  const grid = el('div', 'book-grid');
  main.append(grid);
  if (message) { const note = el('div', 'notice', message); note.setAttribute('role', 'status'); main.insertBefore(note, heading); }
  const draw = () => {
    const query = search.value.trim().toLocaleLowerCase('es');
    const matches = state.books.filter(book => (book.title + ' ' + book.author).toLocaleLowerCase('es').includes(query));
    heading.lastElementChild.textContent = matches.length + ' libros';
    grid.replaceChildren();
    if (!matches.length) {
      const empty = el('div', 'empty-state');
      empty.append(el('div', 'empty-symbol', '✧'), el('h3', '', state.books.length ? 'Sin resultados' : 'Nuestra biblioteca abrirá pronto'),
        el('p', '', state.books.length ? 'Prueba con otro título o autor.' : 'Estamos preparando las primeras historias ilustradas. Vuelve a visitarnos.'));
      grid.append(empty);
      return;
    }
    for (const book of matches) {
      const card = button('', 'book-card', () => { void openBook(book); });
      card.setAttribute('aria-label', 'Leer ' + book.title);
      card.append(createImg(book.cover, 'Portada de ' + book.title, 'cover'),
        el('span', 'book-overline', book.pageCount + ' páginas'),
        el('strong', 'book-title', book.title), el('span', 'book-author', book.author),
        el('span', 'book-cta', 'Abrir historia →'));
      grid.append(card);
    }
  };
  search.addEventListener('input', draw);
  draw();
}
async function openBook(entry) {
  const requestId=++state.requestId;
  stopVoice();
  state.selected=null;
  state.current=null;
  state.moving=false;
  const main = shell();
  main.append(el('p', 'notice', 'Preparando el libro…'));
  try {
    const res = await fetch(entry.bookPath, { cache: 'no-cache' });
    if (!res.ok) throw Error('El archivo del libro no está disponible (' + res.status + ').');
    const book = validateBook(await res.json(), entry);
    if(requestId!==state.requestId)return;
    state.selected = book;
    state.moving = false;
    state.page = readProgress(book.id, book.pages.length);
    state.current = entry;
    state.view = 'auto';
    renderReader();
  } catch (error) {
    if(requestId===state.requestId)showLibrary('No se pudo abrir el libro: ' + error.message);
  }
}
function utterPage() {
  if (!narrator) return;
  if (state.speech) { stopVoice(); updateVoiceButton(); return; }
  const page = state.selected?.pages[state.page - 1];
  if (!page) return;
  if (!narrator.speak(bookPageText(page),'es-ES',state.voiceRate)) {
    const note=document.getElementById('voice-notice');
    if(note)note.textContent='El dispositivo no pudo iniciar la narración.';
  }
}
function pauseVoice() { narrator?.togglePause(); }
function updateVoiceButton() {
  const speak=document.getElementById('speak-btn');
  const pause=document.getElementById('pause-btn');
  if(speak)speak.textContent=state.speech?'■ Detener narración':'♫ Escuchar página';
  if(pause){
    pause.disabled=!state.speech;
    pause.textContent=state.speechPaused?'▶ Reanudar':'Ⅱ Pausar';
    pause.setAttribute('aria-pressed',String(state.speechPaused));
  }
}
function bookPageText(page) { return Array.isArray(page.scenes) ? page.scenes.map(scene => scene.text).join(' ') : page.text; }
function renderContent(page) {
  if (Array.isArray(page.scenes)) {
    const content = el('article','page-content illustrated-page');
    if (page.chapterTitle) content.append(el('h2','illustrated-chapter',page.chapterTitle));
    page.scenes.forEach((scene,i)=>{
      const frame=el('section','illustrated-scene');
      frame.append(createImg(scene.image,'Escena '+(i+1)+' de la página '+page.number,'scene-image'));
      const caption=el('p','scene-caption',scene.text);
      const integrated=scene.captionMode==='integrated';
      caption.classList.add(integrated?'caption-integrated':(i%2===0?'caption-left':'caption-right'));
      if(scene.layout){
        const {x,y,width,fontSize}=scene.layout;
        Object.assign(caption.style,{left:x+'%',right:'auto',top:y+'%',width:width+'%',
          maxWidth:'none',maxHeight:'calc('+(100-y)+'% - 6px)',fontSize:fontSize+'px'});
      }
      frame.append(caption);content.append(frame);
    });
    return content;
  }
  const content = el('article', 'page-content');
  content.append(createImg(page.image, 'Ilustración de la página ' + page.number, 'page-image'),
    el('p', 'page-text', page.text));
  return content;
}
/** Libro abierto en escritorio: imágenes a la izquierda y narraciones
 * correspondientes a la derecha, conservando el orden de las escenas. */
function renderDesktopSpread(page) {
  const spread=el('article','page-content desktop-spread');
  const pictures=el('div','spread-pictures');
  const stories=el('div','spread-stories');
  if(page.chapterTitle) {
    pictures.append(el('h2','spread-chapter',page.chapterTitle));
    stories.append(el('h2','spread-chapter spread-chapter-right',page.chapterTitle));
  }
  page.scenes.forEach((scene,i)=>{
    const picture=el('div','spread-picture');
    picture.append(createImg(scene.image,'Ilustración '+(i+1)+' de la página '+page.number,'spread-image'));
    pictures.append(picture);
    const narrative=el('div','spread-narrative');
    narrative.setAttribute('tabindex','0');
    narrative.setAttribute('role','region');
    narrative.setAttribute('aria-label','Narración '+(i+1)+' de '+page.scenes.length);
    narrative.append(el('p','spread-text',scene.text));
    stories.append(narrative);
  });
  spread.append(pictures,stories);
  return spread;
}
function renderLegacyIllustrated(page) {
  const content=el('article','page-content illustrated-page');
  const frame=el('section','illustrated-scene');
  frame.append(createImg(page.image,'Ilustración página '+page.number,'scene-image'),el('p','scene-caption caption-left',page.text));
  content.append(frame);return content;
}
function renderSceneClassic(page) {
  const content=el('article','page-content classic-multiscene');
  page.scenes.forEach((scene,i)=>{const section=el('section','classic-scene');section.append(createImg(scene.image,'Escena '+(i+1),'page-image'),el('p','page-text',scene.text));content.append(section);});
  return content;
}
function turnTo(next,continueNarration=false) {
  const book = state.selected;
  if (state.moving || !book || next < 1 || next > book.pages.length || next === state.page) return;
  const old = state.page;
  state.moving = true;
  stopVoice();
  const finish = () => {
    if(state.selected !== book)return;
    state.page = next;
    writeProgress(book.id, next);
    state.moving = false;
    renderReader();
    if(continueNarration)utterPage();
  };
  if (reducedMotion.matches) return finish();
  const sheet = document.querySelector('.flip-sheet');
  if (!sheet) return finish();
  const spread = sheet.querySelector('.desktop-spread');
  if (spread) {
    const right = spread.querySelector('.spread-stories');
    if (!right) return finish();
    const turning = right.cloneNode(true);
    turning.classList.add('spread-turning-leaf',next > old ? 'leaf-forward' : 'leaf-backward');
    turning.setAttribute('aria-hidden','true');
    turning.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
    spread.append(turning);
    let finished=false;
    const done=()=>{
      if(finished)return;
      finished=true;
      turning.remove();
      finish();
    };
    turning.addEventListener('animationend',event=>{
      if(event.target===turning)done();
    },{once:true});
    setTimeout(done,750);
    return;
  }
  sheet.classList.add(next > old ? 'turn-forward' : 'turn-backward');
  setTimeout(finish, 480);
}
function renderReader() {
  const book = state.selected;
  if (!book) return showLibrary();
  const page = book.pages[state.page - 1];
  const main = shell();
  main.classList.add('reader-main');
  const top = el('div', 'reader-top');
  const back = button('←', 'back-btn', showLibrary);
  back.setAttribute('aria-label', 'Volver a la biblioteca');
  back.title = 'Volver a la biblioteca';
  top.append(back);
  const heading = el('div', 'reader-heading');
  heading.append(el('p', 'eyebrow', book.author), el('h1', '', book.title));
  top.append(heading);
  const modes = el('details', 'reader-modes');
  const trigger = el('summary', 'reader-modes-trigger', 'Aa ▾');
  trigger.setAttribute('aria-label', 'Modos de lectura');
  trigger.title = 'Modos de lectura';
  modes.append(trigger);
  const menu = el('div', 'reader-modes-menu');
  menu.append(el('p', 'reader-modes-label', 'Modo de lectura'));
  [['auto','Automática'],['clasica','Clásica'],['ilustrada','Ilustrada']].forEach(([value,label])=>{
    const option=button((state.view===value?'✓  ':'')+label,'reader-mode-option'+(state.view===value?' selected':''),()=>{
      stopVoice();state.view=value;renderReader();
    });
    option.setAttribute('aria-pressed',String(state.view===value));
    menu.append(option);
  });
  const chapters=chapterStarts(book.pages);
  if(chapters.length>1){
    const sectionLabel=el('p','reader-modes-label','Ir al capítulo');
    menu.append(sectionLabel);
    const activeChapter=currentChapter(chapters,state.page);
    chapters.forEach((chapter,index)=>{
      const section=button(chapter.title,'reader-chapter-option'+(activeChapter===index?' selected':''),()=>{
        modes.open=false;
        turnTo(chapter.page);
      });
      section.setAttribute('aria-current',String(activeChapter===index?'page':'false'));
      section.title='Ir a la página '+chapter.page;
      menu.append(section);
    });
  }
  modes.append(menu);
  top.append(modes);
  main.append(top);
  const area = el('section', 'reading-area');
  area.setAttribute('aria-label', 'Lector de historias');
  // Móvil: pasar página horizontalmente, sin interceptar el scroll de narraciones.
  let swipeStart=null;
  area.addEventListener('pointerdown',event=>{
    if(desktopSpread.matches||event.pointerType!=='touch'||!event.isPrimary||
      !isReaderSwipeTarget(event.target)){swipeStart=null;return;}
    swipeStart={pointerId:event.pointerId,x:event.clientX,y:event.clientY,time:event.timeStamp};
  });
  area.addEventListener('pointercancel',()=>{swipeStart=null;});
  area.addEventListener('pointerup',event=>{
    const start=swipeStart;swipeStart=null;
    if(!start||start.pointerId!==event.pointerId||!state.selected)return;
    const action=swipePageAction(start,{x:event.clientX,y:event.clientY,time:event.timeStamp});
    if(action==='next')turnTo(state.page+1);
    if(action==='previous')turnTo(state.page-1);
  });
  const canvas = el('div', 'book-perspective');
  const paper = el('div', 'flip-sheet');
  const view = state.view === 'auto' ? (book.schemaVersion === 2 ? 'ilustrada' : 'clasica') : state.view;
  const content = desktopSpread.matches && view === 'clasica' && book.schemaVersion === 1
    ? renderDesktopSpread({...page,scenes:[{image:page.image,text:page.text}]})
    : view === 'ilustrada' && book.schemaVersion === 2 && desktopSpread.matches ? renderDesktopSpread(page)
    : view === 'ilustrada' && book.schemaVersion === 1 ? renderLegacyIllustrated(page)
    : view === 'clasica' && book.schemaVersion === 2 ? renderSceneClassic(page)
    : renderContent(page);
  paper.append(content);
  canvas.append(paper);
  area.append(canvas);
  main.append(area);
  const controls = el('div', 'reader-controls');
  const prev = button('← Anterior', 'control', () => turnTo(state.page - 1));
  prev.disabled = state.page === 1;
  const counter = el('span', 'page-counter', 'Página ' + state.page + ' de ' + book.pages.length);
  counter.setAttribute('aria-live', 'polite');
  const next = button('Siguiente →', 'control primary', () => turnTo(state.page + 1));
  next.disabled = state.page === book.pages.length;
  controls.append(prev, counter, next);
  main.append(controls);
  if (narrator) {
    const voiceControls=el('div','reader-voice-controls');
    const speak=button(state.speech?'■ Detener narración':'♫ Escuchar página','listen-btn',utterPage);
    speak.id='speak-btn';
    const pause=button(state.speechPaused?'▶ Reanudar':'Ⅱ Pausar','listen-btn pause-btn',pauseVoice);
    pause.id='pause-btn';
    pause.disabled=!state.speech;
    pause.setAttribute('aria-pressed',String(state.speechPaused));
    voiceControls.append(speak,pause);
    const rateLabel=el('label','reader-voice-rate','Velocidad ');
    const rateControl=el('select','reader-rate-select');
    rateControl.setAttribute('aria-label','Velocidad de narración');
    [[0.8,'Lenta · 0,8×'],[1,'Normal · 1×'],[1.2,'Rápida · 1,2×']].forEach(([rate,label])=>{
      const option=el('option','',label);option.value=String(rate);
      option.selected=state.voiceRate===rate;rateControl.append(option);
    });
    rateControl.addEventListener('change',()=>{
      state.voiceRate=Number(rateControl.value);
      if(state.speech){stopVoice();utterPage();}
    });
    rateLabel.append(rateControl);
    const settings=el('details','reader-voice-options');
    const settingsTrigger=el('summary','reader-voice-options-trigger','Opciones de voz');
    const settingsPanel=el('div','reader-voice-options-panel');
    const autoLabel=el('label','reader-autonarrate');
    const autoInput=el('input');autoInput.type='checkbox';autoInput.checked=state.autoNarrate;
    autoInput.addEventListener('change',()=>{state.autoNarrate=autoInput.checked;});
    autoLabel.append(autoInput,el('span','','Seguir leyendo al terminar'));
    settingsPanel.append(rateLabel,autoLabel);
    settings.append(settingsTrigger,settingsPanel);
    voiceControls.append(settings);
    main.append(voiceControls);
    const note=el('p','reader-hint','Narración del dispositivo · Pausa, velocidad y avance automático opcional.');
    note.id='voice-notice';main.append(note);
  }
  const following = book.pages[state.page]?.image || book.pages[state.page]?.scenes?.[0]?.image;
  if (following) { const preload = new Image(); preload.src = following; }
}
document.addEventListener('keydown',event=>{
  if(!state.selected||event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
  const action=navigationAction(event.key);
  if(!action)return;
  if(action==='exit'){
    event.preventDefault();
    const openMenu=document.querySelector('.reader-modes[open],.reader-voice-options[open]');
    if(openMenu){
      openMenu.open=false;
      openMenu.querySelector('summary')?.focus();
    }else showLibrary();
    return;
  }
  if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')||
     document.activeElement?.closest('button, a, summary, .spread-narrative, .scene-caption'))return;
  event.preventDefault();
  if(action==='next')turnTo(state.page+1);
  else if(action==='previous')turnTo(state.page-1);
  else if(action==='first')turnTo(1);
  else if(action==='last')turnTo(state.selected.pages.length);
});
desktopSpread.addEventListener('change',()=>{ if(state.selected&&!state.moving)renderReader(); });
async function start() {
  showLibrary();
  try {
    const response = await fetch('/catalogo.json', { cache: 'no-cache' });
    if (!response.ok) throw Error('No se pudo leer el catálogo.');
    state.books = validateCatalog(await response.json());
    showLibrary();
  } catch { showLibrary('La biblioteca no está disponible temporalmente. Inténtalo más tarde.'); }
}
void start();
