import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        reply.status(404).send({
          message: 'User not found',
        })
      }

      const meals = await knex('meals').where('user_id', user.id).select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        reply.status(404).send({
          message: 'User not found',
        })
      }

      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      return { meal }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        reply.status(404).send({
          message: 'User not found',
        })
      }

      const totMeals = await knex('meals')
        .where('user_id', user.id)
        .count({ count: '*' })
        .first()

      const totMealsInDiet = await knex('meals')
        .where('user_id', user.id)
        .where('isInDiet', true)
        .count({ count: '*' })
        .first()

      const totMealsNotInDiet = await knex('meals')
        .where('user_id', user.id)
        .where('isInDiet', false)
        .count({ count: '*' })
        .first()

      const bestDietSequence = await knex('meals')
        .select(knex.raw('COUNT(*) as dietSequence'))
        .where('user_id', user.id)
        .andWhere('isInDiet', true)
        .groupByRaw('DATE(created_at)')
        .orderBy('dietSequence', 'desc')
        .limit(1)
        .first()

      return {
        totMeals: totMeals?.count || 0,
        totMealsInDiet: totMealsInDiet?.count || 0,
        totMealsNotInDiet: totMealsNotInDiet?.count || 0,
        bestDietSequence: bestDietSequence || 0,
      }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        time: z.string(),
        isInDiet: z.boolean(),
      })

      const { name, description, date, time, isInDiet } =
        createMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      await knex('meals').insert({
        id: crypto.randomUUID(),
        name,
        description,
        date,
        time,
        isInDiet,
        user_id: user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string(),
        time: z.string(),
        isInDiet: z.boolean(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      const { name, description, date, time, isInDiet } =
        updateMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      await knex('meals')
        .update({
          name,
          description,
          date,
          time,
          isInDiet,
          user_id: user.id,
        })
        .where('id', id)

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals').where('id', id).first()

      if (!meal) {
        return reply.status(404).send({
          message: 'Meal not found',
        })
      }

      const { sessionId } = request.cookies

      const user = await knex('users').where('session_id', sessionId).first()

      if (!user) {
        return reply.status(404).send({
          message: 'User not found',
        })
      }

      await knex('meals').where('id', id).delete()

      return reply.status(200).send()
    },
  )
}
