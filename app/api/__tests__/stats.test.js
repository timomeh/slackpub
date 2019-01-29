const request = require('supertest')
const nock = require('nock')
const app = require('../../../index').default
const slackUsersList = require('../__fixtures__/slack-users-list.json')

jest.useFakeTimers()

describe('GET /api/stats', () => {
  describe('on success', () => {
    beforeEach(() => {
      nock('https://foobars.slack.com')
        .get('/api/users.list')
        .query(true)
        .once()
        .reply(200, slackUsersList)
    })

    it('parses stats from slack api', async () => {
      const response = await request(app).get('/api/stats')
      expect(response.statusCode).toBe(200)
      expect(response.body).toMatchObject({
        ok: true,
        stats: {
          users_total: 2,
          users_online: 1,
          avatars: [
            {
              image_192: expect.any(String),
              image_24: expect.any(String),
              image_32: expect.any(String),
              image_48: expect.any(String),
              image_512: expect.any(String),
              image_72: expect.any(String)
            },
            {
              image_192: expect.any(String),
              image_24: expect.any(String),
              image_32: expect.any(String),
              image_48: expect.any(String),
              image_512: expect.any(String),
              image_72: expect.any(String)
            }
          ]
        }
      })
    })

    it('caches subsequent calls', async () => {
      await request(app).get('/api/stats')
      const secondRequest = await request(app).get('/api/stats')

      // Without memo, the second request should've failed because
      // nock only mocks the response once.

      expect(secondRequest.statusCode).toBe(200)
      expect(secondRequest.body).toMatchObject({
        ok: true,
        stats: expect.any(Object)
      })
    })
  })

  describe('on error', () => {
    beforeEach(() => {
      nock('https://foobars.slack.com')
        .get('/api/users.list')
        .query(true)
        .once()
        .reply(401, { ok: false, error: 'foo_bar' })
    })

    it('responds with an error', async () => {
      jest.advanceTimersByTime(700000) // prevent memoization

      const response = await request(app).get('/api/stats')
      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        status: 'BadRequestError',
        message: 'foo_bar'
      })
    })
  })
})
