import express, { Request, Response, NextFunction } from 'express'

import { hallRouter } from './sala_o_hall/hall.routes.js'
import { Gender } from './gender/gender.entity.js'
import { userRouter } from './user/user.routes.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/halls', hallRouter)


//aca arranca gender

const genders =  [
  new Gender (
  1,
  'Sala 1'
  )
]

app.get('/api/gender', (req,res) => {
 res.json(genders)
})

app.get('/api/gender/:id', (req,res) => {
 const gender = genders.find((gender) => gender.id === parseInt(req.params.id))
 if(!gender){
  res.status(404).send({message:'Gender no found'})
 }
 res.json(gender)
})

//aca termina genero (cande te saque lo del localhost3001 porq en el http que hiciste pusiste localhost3000, 
// no te iba a funcionar sino y deja el codigo arriba de el app.use y el app.listen sino no va a funcionar)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})