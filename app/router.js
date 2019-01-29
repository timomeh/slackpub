import { Router } from 'express'
import * as stats from './api/stats'
import * as invitations from './api/invitations'

const api = Router()
api.get('/stats', stats.read)
api.post('/invitations', invitations.create)

const router = Router()
router.use('/api', api)

export default router
