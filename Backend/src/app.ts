import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { RequestContext } from '@mikro-orm/mysql'
import { orm, syncSchema } from './shared/db/orm.js'
import { userRouter } from './user/user.routes.js'
import { movieRouter } from './movie/movie.routes.js'
import { saleRouter } from './sale/sale.routes.js'
import { showRouter } from './show/show.routes.js'
import { showCategoryRouter } from './show_category/show_category.routes.js'

const app = express()
app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}))

app.use(express.json())

app. use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/users', userRouter)
app.use('/api/movies', movieRouter)
app.use('/api/sales', saleRouter)
app.use('/api/shows', showRouter)
app.use('/api/showCategory', showCategoryRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})