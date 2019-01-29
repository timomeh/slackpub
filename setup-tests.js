require('dotenv').config({ path: '.env.test' })
const nock = require('nock')

nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')

afterEach(() => {
  nock.cleanAll()
  jest.clearAllMocks()
})
