/** Mapa común de teclas de lectura accesible; sin invadir cajas de texto. */
export function navigationAction(key){
 switch(key){
  case 'ArrowRight':case 'PageDown':return 'next';
  case 'ArrowLeft':case 'PageUp':return 'previous';
  case 'Home':return 'first';
  case 'End':return 'last';
  case 'Escape':return 'exit';
  default:return null;
 }
}
