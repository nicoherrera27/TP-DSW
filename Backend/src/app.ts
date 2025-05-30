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
  'Comedia'
  )
]

function sanitizeGenderInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.name,
    id: req.body.id
  }


Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) 
    {delete req.body.sanitizedInput[key]
    }
  })
next()
}


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

app.post('/api/gender', sanitizeGenderInput, (req, res) =>  {
  const input = req.body.sanitizedInput
  const gender = new Gender 
  (input.id, 
    input.name)
  genders.push(gender)
  res.status(201).send({ message: 'Gender created', data: gender})
  }
)

app.put('/api/gender/:id', (req, res) => {
const genderIdx = genders.findIndex((gender) => gender.id === parseInt(req.params.id))
if(genderIdx === -1) {
  res.status(404).send({ message: 'Gender not found' })
}
const Input = {
  name:req.body.name,
  id:req.body.id
}
genders[genderIdx] = {... genders[genderIdx], ...Input}
res.status(200).send({message: 'Gender updated successfully', data: genders
  [genderIdx] })
})

 app.delete('/api/gender/:id', (req, res) => {
const genderIdx = genders.findIndex((gender) => gender.id === parseInt(req.params.id))
if(genderIdx === -1) {
  res.status(404).send({ message: 'Gender not found' })
 }
 genders.splice(genderIdx, 1)
  res.status(200).send({ message: 'Gender deleted successfully' })
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