import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorhandler from 'errorhandler'
import helmet from 'helmet'

import * as ohaierror from './lib/ohai-error'
import router from './router'

const app = express()

app.use(helmet({ frameguard: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin: JSON.parse(process.env.APP_CORS_ORIGIN || 'true') }))
app.use('/', router)
app.use(ohaierror.fourohfour)
app.use(ohaierror.common)

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
}

app.use(ohaierror.server)

export default app
