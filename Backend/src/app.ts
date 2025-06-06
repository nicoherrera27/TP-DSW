
import 'reflect-metadata'
import express from 'express'
import { userRouter } from './user/user.routes.js'
import { RequestContext } from '@mikro-orm/mysql'
import { orm, syncSchema } from './shared/db/orm.js'

import { hallRouter } from './sala_o_hall/hall.routes.js'

import { genderRouter } from './gender/gender.routes.js'


const app = express()
app.use(express.json())

// luego de middlewares

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

// antes de las rutas y middlewares de negocio

app.use('/api/users', userRouter)
app.use('/api/halls', hallRouter)
app.use('/api/genders', genderRouter)

await syncSchema()


app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
