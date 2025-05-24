import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './routes/userRoutes.js'
import {Hall} from './sala_o_hall/hallEntity.js'
import { HallRepository } from './sala_o_hall/hallRepository2.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)

//aca arranca hall

const repository2 = new HallRepository

const halls = [
  new Hall(
    3,
    60,
    'H01'
  ),
]

function sanitizeHallInput(req: Request, res: Response, next: NextFunction){

  req.body.sanitizedInput = {
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
  res.json({data: repository2.findAll2() })
})

app.get('/api/halls/:id',(req, res) => {
    const hall = repository2.findOne2({id:req.params.id})
    if(!hall){
      res.status(404).send({message: 'hall not found'})
      return
    }
    res.json({data: hall})
})

app.post('/api/halls', sanitizeHallInput, (req, res) => {
  const Input = req.body.sanitizedInput

  const hallInput = new Hall(Input.num_hall, Input.capacity, Input.id_hall)

  const hall = repository2.create2(hallInput)
  res.status(201).send({message: 'hall crated', data: hall})
  return
})

app.put('/api/halls/:id', sanitizeHallInput, (req, res) => {
  req.body.sanitizedInput.id = req.params.id
  const hall = repository2.update2(req.body.sanitizedInput)
  
  if (!hall) {
    res.status(404).send({ message: 'Hall not found' })
    return
  }

  res.status(200).send({ message: 'Hall updated successfully', data: hall})
  return
})

app.patch('/api/halls/:id', sanitizeHallInput, (req, res) => {
  req.body.sanitizedInput.id = req.params.id
  const hall = repository2.update2(req.body.sanitizedInput)
  
  if (!hall) {
    res.status(404).send({ message: 'Hall not found' })
    return
  }

  res.status(200).send({ message: 'Hall updated successfully', data: hall})
  return
})

app.delete('/api/halls/:id', (req, res) => {
  const id = req.params.id
  const hall = repository2.delete2({id})

  if(!hall) {
    res.status(404).send({message:'Hall not found'})
  } else{
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
