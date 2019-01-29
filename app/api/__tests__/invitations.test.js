const request = require('supertest')
const nock = require('nock')
const app = require('../../../index').default

describe('POST /api/invitations', () => {
  describe('on success', () => {
    beforeEach(() => {
      nock('https://foobars.slack.com')
        .post('/api/users.admin.invite')
        .query({
          email: 'foo@bar.baz',
          token: 'xxx',
          channels: 'ABC123XYZ',
          resend: true
        })
        .once()
        .reply(200, { ok: true })
    })

    it('triggers invite in slack api', async () => {
      const response = await request(app)
        .post('/api/invitations')
        .send({ email: 'foo@bar.baz' })

      expect(response.statusCode).toBe(201)
      expect(response.body).toMatchObject({
        ok: true,
        message: 'Invitation sent.'
      })
    })
  })

  describe('on error', () => {
    beforeEach(() => {
      nock('https://foobars.slack.com')
        .post('/api/users.admin.invite')
        .query(true)
        .once()
        .reply(401, { ok: false, error: 'foo_bar' })
    })

    it('responds with an error', async () => {
      const response = await request(app)
        .post('/api/invitations')
        .send({ ok: false, error: 'foo_bar' })

      expect(response.statusCode).toBe(400)
      expect(response.body).toMatchObject({
        ok: false,
        status: 'BadRequestError',
        message: 'foo_bar'
      })
    })
  })
})
