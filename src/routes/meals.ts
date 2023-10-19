import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    return { meal }
  })

  app.get('/user/:userId', async (request) => {
    const getMealsParamsSchema = z.object({
      userId: z.string().uuid(),
    })

    const { userId } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where('user_id', userId)

    return { meals }
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      isInDiet: z.boolean(),
      userId: z.string(),
    })

    const { name, description, date, time, isInDiet, userId } =
      createMealBodySchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      date,
      time,
      isInDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      time: z.string(),
      isInDiet: z.boolean(),
      userId: z.string(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const { name, description, date, time, isInDiet, userId } =
      updateMealBodySchema.parse(request.body)

    await knex('meals')
      .update({
        name,
        description,
        date,
        time,
        isInDiet,
        user_id: userId,
      })
      .where('id', id)

    return reply.status(201).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    await knex('meals').where('id', id).delete()

    return reply.status(200).send()
  })
}
