import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    execSync('npm run knex migrate:latest')

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listAllMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: 1,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    const getMealsResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: 1,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Hamburguer de picanha',
        description: 'Hamburguer de picanha com cheddar',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: false,
      })
      .expect(201)

    await request(app.server).get('/meals').set('Cookie', cookies).expect(200)

    const summaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body).toEqual({
      totMeals: 2,
      totMealsInDiet: 1,
      totMealsNotInDiet: 1,
      bestDietSequence: {
        dietSequence: 1,
      },
    })
  })

  it('should be able to update a meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Suco de Maça',
        description: 'Suco de maça adoçado',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: false,
      })
      .expect(201)
  })

  it('should be able to delete a meals', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'User Test',
      username: 'UserTest',
      email: 'usertest@example.com',
      password: '12345',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Suco detox',
        description: 'Suco detox',
        date: '2023-10-20',
        time: '15:10:00',
        isInDiet: true,
      })
      .expect(201)

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)
  })
})
