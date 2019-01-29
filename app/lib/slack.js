import got from 'got'
import { BadRequest } from 'http-errors'

const debug = require('debug')('slackpub')
const client = got.extend({
  baseUrl: `https://${process.env.SLACK_NAME}.slack.com/api/`,
  query: { token: process.env.SLACK_TOKEN },
  json: true
})

export default {
  users: {
    admin: {
      invite({ email }) {
        debug('calling slack: users.admin.invite')
        return client
          .post('users.admin.invite', {
            query: {
              email,
              channels: process.env.SLACK_INITIAL_CHANNEL_IDS,
              resend: true
            }
          })
          .then(handleSlackResponse)
          .catch(handleSlackError)
      }
    },
    list() {
      debug('calling slack: users.list')
      return client
        .get('users.list', { query: { presence: true } })
        .then(handleSlackResponse)
        .catch(handleSlackError)
    }
  }
}

function handleSlackResponse(res) {
  debug('slack response: %O', res)
  if (res.body && !res.body.ok) {
    throw new BadRequest(res.body.error)
  }

  return res.body
}

function handleSlackError(res) {
  debug('slack error: %O', res)
  if (res.body && !res.body.ok) {
    throw new BadRequest(res.body.error)
  } else {
    throw res
  }
}
