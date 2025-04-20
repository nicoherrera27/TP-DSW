import express from 'express'
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

app.post('/api/users', (req, res) => {
  const { id, name, surname, email, birthdate } = req.body

  const user = new User(id, name, surname, email, birthdate)

  users.push(user)
  res.status(201).send({ message: 'User created successfully', data: user })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})