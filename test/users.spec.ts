import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'User Test',
        username: 'UserTest',
        email: 'usertest@example.com',
        password: '12345',
      })
      .expect(201)
  })

  it('should be able to get a user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'User Test',
        username: 'UserTest',
        email: 'usertest@example.com',
        password: '12345',
      })
      .expect(201)

    const showUserResponse = await request(app.server).get('/users').expect(200)

    expect(showUserResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'User Test',
        username: 'UserTest',
        email: 'usertest@example.com',
        password: '12345',
      }),
    ])
  })
})
