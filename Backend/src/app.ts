import 'reflect-metadata'
import express from 'express'
import { userRouter } from './user/user.routes.js'
import { RequestContext } from '@mikro-orm/mysql'
import { orm, syncSchema } from './shared/db/orm.js'
import { movie_roomRouter } from './movie_room/movie_room.routes.js'
import { genderRouter } from './gender/gender.routes.js'
import { showCategoryRouter } from './show_category/show_category.routes.js'
import { showRouter } from './show/show.routes.js'

const app = express()
app.use(express.json())

//luego de los middlewares base como express.json o cores
app. use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de nuestro negocio

app.use('/api/users', userRouter)
app.use('/api/halls', movie_roomRouter)
app.use('/api/genders', genderRouter)
app.use('/api/showCategory', showCategoryRouter)
app.use('/api/show', showRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

await syncSchema() //solo en desarrollo 

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
