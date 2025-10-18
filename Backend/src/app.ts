
import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { userRouter } from './user/user.routes.js'
import { RequestContext } from '@mikro-orm/mysql'
import { orm, syncSchema } from './shared/db/orm.js'
import { movie_roomRouter } from './movie_room/movie_room.routes.js'
import { showCategoryRouter } from './show_category/show_category.routes.js'
import { showRouter } from './show/show.routes.js'
import { movieRouter } from './movie/movie.routes.js'
import { seatRouter } from './seat/seat.routes.js'
import { timetableRouter } from './time_table/timetable.routes.js' 
import { ticketTypeRouter } from './ticket_type/ticketType.routes.js' 


const app = express()

app.use(cors({
  origin: 'http://localhost:4321',
  credentials: true
}));

app.use(express.json())

app. use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/users', userRouter)
app.use('/api/halls', movie_roomRouter)
app.use('/api/showCategory', showCategoryRouter)
app.use('/api/show', showRouter)
app.use('/api/movies', movieRouter)
app.use('/api/Seat', seatRouter)
app.use('/api/timetables', timetableRouter)
app.use('/api/ticketTypes', ticketTypeRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
  return
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})