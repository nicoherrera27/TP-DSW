# Propuesta TP DSW

## Grupo
### Integrantes
* 49498 - Boscarol, Candela
* 51386 - Araguas, Joaco
* 51541 Herrera, Nicolas

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción
Sistema web diseñado para facilitar la administración integral de un cine. Permite gestionar de forma organizada y eficiente los diferentes elementos que forman parte de su funcionamiento diario. El sistema está pensado para ser intuitivo, responsive y fácil de usar. Su objetivo es centralizar la información y simplificar los procesos diarios del cine.


### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Tipo Entrada<br>2. CRUD Usuario<br>3. CRUD Sala<br>4. CRUD Genero|
|CRUD dependiente|1. CRUD Pelicula {depende de} CRUD Genero<br>2. CRUD Funcion {depende de} CRUD Sala|
|Listado<br>+<br>detalle| 1. Listado de peliculas filtrado por genero, muestra nombre, duracion y funciones disponibles para el dia actual. <br> 2. Listado de entradas vendidas por rango de fecha y pelicula 
|CUU/Epic|1. Login de usuario<br>2. Pago digital con MercadoPago|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Tipo Habitacion<br>2. CRUD Servicio<br>3. CRUD Localidad<br>4. CRUD Provincia<br>5. CRUD Habitación<br>6. CRUD Empleado<br>7. CRUD Cliente|
|CUU/Epic|1. Reseñas<br>2. Compra de entrada<br>3. Sinopsis|


### Alcance Adicional Voluntario

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Estadía del día filtrado por fecha muestra, cliente, habitaciones y estado <br>2. Reservas filtradas por cliente muestra datos del cliente y de cada reserve fechas, estado cantidad de habitaciones y huespedes|
|CUU/Epic|1. Consumir servicios<br>2. Cancelación de reserva|
|Otros|1. Envío de recordatorio de reserva por email|

