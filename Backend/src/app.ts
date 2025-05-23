import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './routes/userRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)

//aca arranca hall

import {Hall} from './sala_o_hall/hallEntity.js'

const halls = [
  new Hall(
    3,
    60,
    '9f3a8c7e-2b9d-4c6b-b2d1-ec4e9a57d4f3'
  ),
]

function sanitizeHallInput(req: Request, res: Response, next: NextFunction){

  req.body.sanitizedinput = {
    num_hall: req.body.num_hall,
    capacity: req.body.capacity,
    id_hall: req.body.id_hall    
  }
  //aca tendriamos que poner mas validaciones segun mecanimal con librerias

  Object.keys(req.body.sanitizedinput).forEach(key=>{
    if(req.body.sanitizedinput[key] == undefined) {
      delete req.body.sanitizedinput[key]
    }
  })
  next()
}

app.get('/api/halls',(req, res) => {
  res.json(halls)  
})

app.get('/api/halls/:id',(req, res) => {
    const hall = halls.find((hall) => hall.id_hall == req.params.id)
    if(!hall){
        res.status(404).send({message: 'hall not found'})
    }
    res.json(halls)
})

app.post('/api/halls', sanitizeHallInput, (req, res) => {
  const Input = req.body.sanitizedinput

  const hall = new Hall(Input.num_hall, Input.capacity, Input.id_hall)

  halls.push(hall)
  res.status(201).send({message: 'hall crated', data: hall})
})

app.put('/api/halls/:id', sanitizeHallInput, (req, res) => {
  const hallIdx = halls.findIndex((hall) => hall.id_hall == req.params.id)

  if(hallIdx == -1){
    res.status(404).send({message: 'Hall not found'})
  }

  halls[hallIdx] = {...halls[hallIdx], ...req.body.sanitizedinput}

  res.status(200).send({message: 'Hall updated successfully', data: halls[hallIdx]})
})

app.patch('/api/halls/:id', sanitizeHallInput, (req, res) => {
  const hallIdx = halls.findIndex((hall) => hall.id_hall == req.params.id)

  if(hallIdx == -1){
    res.status(404).send({message: 'Hall not found'})
  }

  halls[hallIdx] = {...halls[hallIdx], ...req.body.sanitizedinput}

  res.status(200).send({message: 'Hall updated successfully', data: halls[hallIdx]})
})

app.delete('/api/halls/:id', (req, res) => {
  const hallIdx = halls.findIndex((hall) => hall.id_hall == req.params.id)

  if(hallIdx == -1) {
    res.status(404).send({message:'Hall not found'})
  }else{
  halls.splice(hallIdx, 1)
  res.status(200).send({message: 'Hall deleted successfully' })
  }
})

//aca termina

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
