import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './routes/userRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)

//aca arranca hall

import {hall} from './sala_o_hall/hallEntity.js'

const halls = [
  new hall(
    3,
    60,
    '9f3a8c7e-2b9d-4c6b-b2d1-ec4e9a57d4f3'
  ),
]

app.get('/api/halls',(req, res) => {
  res.json(halls)  
})

app.get('/api/halls/:id',(req, res) => {
    const character = halls.find((hall) => hall.id_hall == req.params.id)
    if(!hall){
        res.status(404).send({message: 'hall not found'})
    }
    res.json(halls)
})

//aca termina

//app.use((_, res) => {
//  res.status(404).send({ message: 'Resource not found' })
//  return
//})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
