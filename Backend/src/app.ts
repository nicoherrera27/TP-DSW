import express, { Request, Response, NextFunction } from 'express'
<<<<<<< HEAD
import { userRouter } from './user/userRoutes.js'
import { Hall } from './sala_o_hall/hallEntity.js'
import { HallRepository } from './sala_o_hall/hallRepository2.js'
import { Gender } from './gender/genderEntity.js'
=======
import { userRouter } from './user/user.routes.js'
import { hallRouter } from './sala_o_hall/hall.routes.js'
>>>>>>> 23730aff1c0bfc799705043a6f1035656d68bda9

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/halls', hallRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

//aca arranca gender

const genders =  [
  new Gender (
  0,
  'Sala 1'
  )
]

app.get('/api/gender', (req,res) => {
 res.json(genders)
})

app.get('/api/gender/:id_gender', (req,res) => {
 const gender = genders.find((gender) => gender.id_gender === parseInt(req.params.id_gender))
 if(!gender){
  res.status(404).send({message:'Gender no found'})
 }
 res.json(gender)
})

app.listen (3000, () => {
  console.log('Server running on http://localhost:3001')
})