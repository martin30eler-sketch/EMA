# EMA · Plan y documento de avances de la web pública

**Fecha de revisión:** 19/10/2026  
**Repositorio:** `martin30eler-sketch/EMA` · rama `main`  
**Proyecto relacionado:** `martin30eler-sketch/ADMINN-EMA` (panel editorial).  
**Regla:** no iniciar cambios en Android hasta terminar y verificar las dos webs.

## Objetivo
Ofrecer una biblioteca pública de historias ilustradas con lectura cómoda en escritorio y móvil, capítulos y escenas, textos ajustables y narración. Solo mostrar libros aprobados y publicados desde ADMINN-EMA.

## Implementado en el repositorio
- Lector de libros con contrato JSON v1 y v2 y hasta dos escenas por página.
- En escritorio, libro abierto con ilustraciones a la izquierda y narraciones a la derecha; animación de paso de la hoja derecha.
- En móvil, presentación adaptada a pantalla pequeña.
- Controles de navegación por página y protección frente a transiciones duplicadas o cambios de libro.
- Regiones de narración enfocables, con desplazamiento propio para textos extensos.
- Reacción a cambios de tamaño de pantalla y alternancia entre diseño móvil y escritorio.

## Avances registrados · 19/10/2026
- `438018a`: estructura del libro abierto para escritorio.
- `f1adba8`: estilos de la vista extendida y transición de páginas.
- `dcd9338`: giro de la hoja derecha sin mover la izquierda.
- `282eae1`: control de finalización de animaciones.
- `351e6db`, `5f75f6c`: accesibilidad y desplazamiento de narraciones.
- `fb23e41`: validación de máximo dos escenas por página.
- `79eab0e`: reconstrucción de la vista al cambiar de tamaño.
- `c95cda9`: navegación por teclado respetando controles enfocados.

## Pendientes para cerrar la web
- [ ] Pruebas reales en navegador de lectura y giro hacia delante y atrás.
- [ ] Verificar en móvil, tablet y escritorio el diseño y la accesibilidad.
- [ ] Probar libros reales con textos largos, escenas únicas y escenas dobles.
- [ ] Validar el ciclo completo desde ADMINN-EMA: importar → editar → publicar → desplegar → leer.
- [ ] Comprobar que el catálogo no muestre borradores privados.
- [ ] Confirmar despliegues exitosos y resolver cualquier error encontrado.

## Coordinación con ADMINN-EMA
El plan detallado del administrador está en `ADMINN-EMA/docs/PLAN_AVANCE_EMA.md`. Los borradores deben ser **privados y persistentes en la nube**, asociados al administrador, y no depender únicamente de IndexedDB. La biblioteca pública solo debe consumir publicaciones aprobadas.

## Historial y criterio de cierre
Registrar aquí cada avance relevante, el commit, las pruebas efectuadas y lo pendiente. No marcar una función como terminada sin comprobar su funcionamiento. Todos los cambios se hacen directamente en `main`.
