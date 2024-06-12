import express, { NextFunction, Request, Response } from 'express';
import { animal } from './animal.js';
import { producto } from './producto.js';


const app = express();
app.use(express.json());

//midleware--> pequeños fragmentos de codigo en express que podemos incluir en 
//nuestra cadena de codigo para la resolucion de una request 
//estos van de a parte agregando, quitando y modificando la info de acuerdo a lo que sea necessario


//animal--> /api/animal/
const animales = [
  new animal(
    'juan',
    '2020-12-03',
    '2020-12-03',
    '1'
  ),
];

function sanitizeAnimalInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedAnimal = {
    nombre: req.body.nombre,
    fechaRescate: req.body.fechaRescate,
    fechaNacimientoEStimativa: req.body.fechaNacimientoEStimativa
  }

  Object.keys(req.body.sanitizedAnimal).forEach((key) => {
    if (req.body.sanitizedAnimal[key] === undefined) {
      delete req.body.sanitizedAnimal[key]
    }
  })

  next()
}

app.get('/api/animal',(req,res )=>{
  res.json(animales);
})


app.get('/api/animal/:id',(req,res )=>{
  const animal = animales.find((animal) => animal.id === req.params.id);
  if(!animal){
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }
  res.json(animal)
})


app.post('/api/animal', sanitizeAnimalInput, (req,res )=>{
  const {nombre, fechaRescate, fechaNacimientoEStimativa, id} = req.body

  const animales2 = new animal (nombre, fechaRescate, fechaNacimientoEStimativa, id ); 

  animales.push(animales2)
  return res.status(201).send({message: 'animal agregado correctamente', data: animal })
})


app.put ('/api/animal/:id', sanitizeAnimalInput, (req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if (animalIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  animales[animalIdx]= {...animales[animalIdx], ...req.body.sanitizedAnimal };

  res.status(200).send({message: 'animal modificado correctamente', data:  animales[animalIdx] })
})


app.patch ('/api/animal/:id', sanitizeAnimalInput, (req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if (animalIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  animales[animalIdx]= {...animales[animalIdx], ...req.body.sanitizedAnimal };

  res.status(200).send({message: 'animal modificado correctamente', data: animales[animalIdx] })
})


app.delete('/api/animal/:id',(req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if(animalIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }
  animales.splice(animalIdx, 1);
  res.status(200).send({message: 'animal eliminado correctamente'})
})

//PRODUCTO --> /api/producto/

const productos = [
  new producto(
    'Alimento',
    'Alimento balanceado para perro',
    100,
    '01'
  ),
];

function sanitizeProductoInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedProducto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    stock: req.body.stock
  }

  Object.keys(req.body.sanitizedProducto).forEach((key) => {
    if (req.body.sanitizedProducto[key] === undefined) {
      delete req.body.sanitizedProducto[key]
    }
  })

  next()
}

app.get('/api/producto',(req,res )=>{
  res.json(productos);
})


app.get('/api/producto/:id',(req,res )=>{
  const producto = productos.find((producto) => producto.id === req.params.id);
  if(!producto){
    return res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }
  res.json(producto)
})


app.post('/api/producto', sanitizeProductoInput, (req,res) => {
  const {nombre, descripcion, stock, id} = req.body

  const productos2 = new producto (nombre, descripcion, stock, id ); 

  productos.push(productos2)
  return res.status(201).send({message: 'Producto agregado correctamente', data: producto })
})


app.put ('/api/producto/:id', sanitizeProductoInput, (req,res) => {
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }

  productos[productoIdx]= {...productos[productoIdx], ...req.body.sanitizedProducto };

  res.status(200).send({message: 'Producto modificado correctamente', data: productos[productoIdx] })
})


app.patch ('/api/producto/:id', sanitizeProductoInput, (req,res )=>{
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }

  productos[productoIdx]= {...productos[productoIdx], ...req.body.sanitizedProducto };

  res.status(200).send({message: 'Producto modificado correctamente', data: productos[productoIdx]  })
})


app.delete('/api/producto/:id',(req,res )=> {
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }
  productos.splice(productoIdx, 1);
  res.status(200).send({message: 'Producto eliminado correctamente'})
})

app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})

//put--> se utiliza para modificar el objeto entero
// patch--> se utiliza para modificar parcialmente el objeto, osea algunos atributos "/*".
   