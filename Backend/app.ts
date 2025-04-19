import express from 'express'
import {User} from './src/User/user.js'


const app = express()

const users= [
    new User(
      1, 
      'John', 
      'Doe',
      'john@doe.com',
      new Date('1990-01-01')
    )
]

app.get('/api/users', (req, res) => {
  res.json(users)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})