import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      username: z.string(),
      email: z.string(),
      password: z.string(),
    })

    let { sessionId } = request.cookies

    const { name, username, email, password } = createUserBodySchema.parse(
      request.body,
    )

    sessionId = crypto.randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      username,
      email,
      password,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
