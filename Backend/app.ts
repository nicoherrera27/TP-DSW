import express, { Request, Response, NextFunction } from 'express'
import {User} from './src/User/user.js'

const app = express()
app.use(express.json())

const users= [
    new User(
      1, 
      'jdoe23',
      '123jd',
      'John', 
      'Doe',
      'john@doe.com',
      '1990-01-01'
    ),
    new User(
      2, 
      'Nicolas', 
      'Herrera',
      'titoNICO7',
      'tito37',
      'herreranico2703@gmail.com',
      '2003-03-27'
    )
]

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {  // Aca se realizarian las validaciones //
  req.body.sanitizedInput ={
    id: req.body.id,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthdate: req.body.birthdate
  }
  
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if(req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}


app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/users/:id', (req, res)=> {
  const user = users.find((user) => user.id === parseInt(req.params.id))
  if (!user) {
    res.status(404).send({ message: 'User not found' })
    return // Detiene la ejecución aquí
  } 
  res.json({user}) // Solo se ejecuta si el usuario existe
})

app.post('/api/users', sanitizeUserInput, (req, res) => {
  const input = req.body.sanitizedInput

  const user = new User(
    input.id, 
    input.username,
    input.password,
    input.name, 
    input.surname, 
    input.email, 
    input.birthdate
  )

  users.push(user)
  res.status(201).send({ message: 'User created successfully', data: user })
  return
})

app.put('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdX = users.findIndex((user) => user.id === parseInt(req.params.id)) 

  if (userIdX === -1) {
    res.status(404).send({ message: 'User not found' })
    return
  } 
  users[userIdX] = {...users[userIdX], ...req.body.sanitizedInput}
  res.status(200).send({ message: 'User updated successfully', data: users[userIdX] })
  return

})

app.patch('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdX = users.findIndex((user) => user.id === parseInt(req.params.id))
  
  if (userIdX === -1) {
    res.status(404).send({ message: 'User not found' })
    return
  }
  
  users[userIdX] = {...users[userIdX], ...req.body.sanitizedInput}

  res.status(200).send({ message: 'User updated successfully', data: users[userIdX] })
  return
  
})

app.delete('/api/users/:id', (req, res) => {
  const userIdX = users.findIndex((user) => user.id === parseInt(req.params.id))

  if (userIdX === -1) {
    res.status(404).send({ message: 'User not found' })
  } 
  else{
    users.splice(userIdX, 1)
    res.status(200).send({ message: 'User deleted successfully' })
  }
})


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})