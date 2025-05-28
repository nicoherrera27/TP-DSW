import express, { Request, Response, NextFunction } from 'express'
import { userRouter } from './user/user.routes.js'
import { hallRouter } from './sala_o_hall/hall.routes.js'

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
