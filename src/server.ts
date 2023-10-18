import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()

app.get('/hello', async () => {
  const users = await knex('users').select('*')

  const meal = await knex('meals')
    .insert({
      id: crypto.randomUUID(),
      name: 'Queijo Minas Frescal',
      description: 'Queijo Minas Frescal Zero Gordura',
      date: '2023-10-18',
      time: '14:00:00',
      isInDiet: true,
      user_id: 'dfcf6f1c-9686-4251-92c2-62bfb9f8343d',
    })
    .returning('*')

  return meal
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })
