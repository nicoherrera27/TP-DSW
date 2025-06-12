import express from 'express'

import { hallRouter } from './sala_o_hall/hall.routes.js'

import { userRouter } from './user/user.routes.js'

import { genderRouter } from './gender/gender.routes.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/halls', hallRouter)
app.use('/api/genders', genderRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})