# Propuesta TP DSW

Regularidad

## Grupo
### Integrantes
* 51386 - Araguas, Joaquín
* 51541 - Herrera, Nicolas

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Sistema web diseñado para facilitar la administración integral de un cine. Permite gestionar de forma organizada y eficiente los diferentes elementos que forman parte de su funcionamiento diario. El sistema está pensado para ser intuitivo, responsive y fácil de usar. Su objetivo es centralizar la información y simplificar los procesos diarios del cine.


### Modelo
[!https://drive.google.com/file/d/1fBN7paHpEiJ1GlJ1oV7hzcQ3yfb4LWCq/view?usp=sharing](https://drive.google.com/file/d/1fBN7paHpEiJ1GlJ1oV7hzcQ3yfb4LWCq/view?usp=sharing)

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Usuario<br>2. CRUD Pelicula|
|CRUD dependiente|1. CRUD Funcion {depende de Tipo de Funcion}|
|Listado<br>+<br>detalle| 1. Listado de peliculas filtrado por genero, muestra nombre, duracion y funciones disponibles para el dia actual. 
|CUU/Epic|1. Venta de entrada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Sala<br>3. CRUD Pelicula<br>4. CRUD Venta<br>5. CRUD Entrada<br>6. CRUD Funcion<br>7. CRUD Tipo Funcion<br>8. CRUD Valor Historico <br> 9. CRUD Horarios <br> 10. CRUD Promociones <br> 11. CRUD Recargos|
|CUU/Epic|1. Seleccion de promociones de entrada<br>2. Compra de entrada<br> 3. Pago Digital con MP/Stripe <br> 4. Sinopsis|



### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de horarios por tipo de funcion <br>2. Listado de promociones por dia|
|CUU/Epic|1. Reseñas<br>|
|Otros|1. Envío de entrada por email|

