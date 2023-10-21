import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { env } from './env'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })
