import 'reflect-metadata'
import express from 'express'
import { hallRouter } from './hall/hall.routes.js'
import { userRouter } from './user/user.routes.js'
import { genderRouter } from './gender/gender.routes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())

//luego de los middlewares base como express.json o cores
app. use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de nuestro negocio

app.use('/api/users', userRouter)
app.use('/api/halls', hallRouter)
app.use('/api/genders', genderRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

await syncSchema() //solo en desarrollo 

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})