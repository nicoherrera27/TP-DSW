import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './src/routes/userRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
