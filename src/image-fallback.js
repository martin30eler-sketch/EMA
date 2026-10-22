/** Recurso editorial ausente: su descripción y su acción de reintento
 * son elementos independientes para lectores de pantalla y teclado.
 */
export function createMissingIllustration(doc,{className,alt,onRetry}){
  const missing=doc.createElement('div');
  missing.className=className+' illustration-fallback';
  const illustration=doc.createElement('div');
  illustration.setAttribute('role','img');
  illustration.setAttribute('aria-label',alt+'. Ilustración no disponible.');
  const label=doc.createElement('span');
  label.textContent='Ilustración temporalmente no disponible';
  illustration.append(label);
  missing.append(illustration);
  if(className!=='cover'&&typeof onRetry==='function'){
    const retry=doc.createElement('button');
    retry.type='button';
    retry.className='image-retry';
    retry.textContent='Reintentar imagen';
    retry.addEventListener('click',onRetry);
    missing.append(retry);
  }
  return missing;
}
