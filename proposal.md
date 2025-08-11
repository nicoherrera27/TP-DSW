# Propuesta TP DSW

Regularidad

## Grupo
### Integrantes
* 49498 - Boscarol, Candela
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
|CRUD simple|1. CRUD Usuario<br>2. CRUD Sala<br>3. CRUD Genero|
|CRUD dependiente|1. CRUD Pelicula {depende de} CRUD Genero<br>2. CRUD Funcion {depende de} CRUD Sala|
|Listado<br>+<br>detalle| 1. Listado de peliculas filtrado por genero, muestra nombre, duracion y funciones disponibles para el dia actual. <br> 2. Listado de entradas vendidas por rango de fecha y pelicula 
|CUU/Epic|1. Seleccion de promociones de entrada<br>2. Compra de entrada|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Usuario<br>2. CRUD Sala<br>3. CRUD Genero<br>4. CRUD Pelicula<br>5. CRUD Compra<br>6. CRUD Entrada<br>7. CRUD Funcion<br>8. CRUD Tipo Funcion<br>9. CRUD Valor Historico|
|CUU/Epic|1. Seleccion de promociones de entrada<br>2. Compra de entrada<br> 3. Reseñas|



### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Sinopsis<br>2. Pago digital con MercadoPago|
|Otros|1. Envío de entrada por email|

