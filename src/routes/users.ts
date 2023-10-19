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

    const { name, username, email, password } = createUserBodySchema.parse(
      request.body,
    )

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      username,
      email,
      password,
    })

    return reply.status(201).send()
  })
}
