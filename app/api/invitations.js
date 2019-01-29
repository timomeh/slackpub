import slack from '../lib/slack'

export async function create(req, res, next) {
  slack.users.admin
    .invite({ email: req.body.email })
    .then(() => {
      res.status(201).json({ ok: true, message: 'Invitation sent.' })
    })
    .catch(next)
}
