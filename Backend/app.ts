import express, { Request, Response, NextFunction } from 'express'
import {User} from './src/User/user.js'

const app = express()
app.use(express.json())

const users= [
    new User(
      1, 
      'John', 
      'Doe',
      'john@doe.com',
      '1990-01-01'
    ),
    new User(
      2, 
      'Nicolas', 
      'Herrera',
      'herreranico2703@gmail.com',
      '2003-03-27'
    )
]

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {  // Aca se realizarian las validaciones //
  req.body.sanitizedInput ={
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthdate: req.body.birthdate
  }
  
  next()
}


app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/users/:id', (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id))
  if (!user) {
    res.status(404).send({ message: 'User not found'})
  } 
  else {
    res.json(user)
  }
})

app.post('/api/users', sanitizeUserInput, (req, res) => {
  const input = req.body.sanitizedInput
  const id = req.body.id

  const user = new User(
    id, 
    input.name, 
    input.surname, 
    input.email, 
    input.birthdate
  )

  users.push(user)
  res.status(201).send({ message: 'User created successfully', data: user })
})

app.put('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdX = users.findIndex((user) => user.id === parseInt(req.params.id)) 

  if (userIdX === -1) {
    res.status(404).send({ message: 'User not found'})
  } 
  users[userIdX] = {...users[userIdX], ...req.body.sanitizedInput}
  res.status(200).send({ message: 'User updated successfully', data: users[userIdX] })
  
})

app.patch('/api/users/:id', sanitizeUserInput, (req, res) => {
  const userIdX = users.findIndex((user) => user.id === parseInt(req.params.id))
  
  if (userIdX === -1) {
    res.status(404).send({ message: 'User not found' })
  }
  
  users[userIdX] = {...users[userIdX], ...req.body.sanitizedInput}

  res.status(200).send({ message: 'User updated successfully', data: users[userIdX] })
  
})


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})