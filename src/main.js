import { validateCatalog, validateBook, readProgress, writeProgress } from './libros.js';
import './styles.css';

const app = document.getElementById('app');
const state = { books: [], selected: null, page: 1, current: null, speech: false, moving: false, view: 'auto' };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  state.speech = false;
}
function showLibrary(message) {
  stopVoice();
  state.selected = null;
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
  stopVoice();
  const main = shell();
  main.append(el('p', 'notice', 'Preparando el libro…'));
  try {
    const res = await fetch(entry.bookPath, { cache: 'no-cache' });
    if (!res.ok) throw Error('El archivo del libro no está disponible (' + res.status + ').');
    const book = validateBook(await res.json(), entry);
    state.selected = book;
    state.page = readProgress(book.id, book.pages.length);
    state.current = entry;
    state.view = 'auto';
    renderReader();
  } catch (error) {
    showLibrary('No se pudo abrir el libro: ' + error.message);
  }
}
function utterPage() {
  if (!('speechSynthesis' in window)) return;
  if (state.speech) { stopVoice(); renderReader(); return; }
  const page = state.selected?.pages[state.page - 1];
  if (!page) return;
  stopVoice();
  const speech = new SpeechSynthesisUtterance(bookPageText(page));
  speech.lang = 'es-ES';
  speech.rate = 0.95;
  speech.onend = () => { state.speech = false; updateVoiceButton(); };
  speech.onerror = () => { state.speech = false; updateVoiceButton(); };
  state.speech = true;
  window.speechSynthesis.speak(speech);
  updateVoiceButton();
}
function updateVoiceButton() {
  const b = document.getElementById('speak-btn');
  if (b) b.textContent = state.speech ? '■ Detener narración' : '♫ Escuchar página';
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
function turnTo(next) {
  const book = state.selected;
  if (state.moving || !book || next < 1 || next > book.pages.length || next === state.page) return;
  const old = state.page;
  state.moving = true;
  stopVoice();
  const finish = () => {
    state.page = next;
    writeProgress(book.id, next);
    state.moving = false;
    renderReader();
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
  modes.append(menu);
  top.append(modes);
  main.append(top);
  const area = el('section', 'reading-area');
  area.setAttribute('aria-label', 'Lector de historias');
  const canvas = el('div', 'book-perspective');
  const paper = el('div', 'flip-sheet');
  const view = state.view === 'auto' ? (book.schemaVersion === 2 ? 'ilustrada' : 'clasica') : state.view;
  paper.append(view === 'ilustrada' && book.schemaVersion === 2 && window.matchMedia('(min-width: 681px)').matches ? renderDesktopSpread(page) : view === 'ilustrada' && book.schemaVersion === 1 ? renderLegacyIllustrated(page) : view === 'clasica' && book.schemaVersion === 2 ? renderSceneClassic(page) : renderContent(page));
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
  if ('speechSynthesis' in window) {
    const speak = button('♫ Escuchar página', 'listen-btn', utterPage);
    speak.id = 'speak-btn';
    main.append(speak, el('p', 'reader-hint', 'Narración automática del dispositivo · No se ha publicado un audio original para esta historia.'));
  }
  const following = book.pages[state.page]?.image || book.pages[state.page]?.scenes?.[0]?.image;
  if (following) { const preload = new Image(); preload.src = following; }
}
document.addEventListener('keydown', event => {
  if (!state.selected || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); turnTo(state.page + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); turnTo(state.page - 1); }
  if (event.key === 'Escape') showLibrary();
});
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
