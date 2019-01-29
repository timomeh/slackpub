import memoize from 'memoizee'
import slack from '../lib/slack'

const memoUserList = memoize(slack.users.list, {
  promise: true,
  maxAge: process.env.APP_STATS_CACHE_TIME || 10 * 60 * 1000, // default cache for 10 minutes
  preFetch: true // will update cache in background if method is called and about to expire
})

export function read(_req, res, next) {
  memoUserList()
    .then(result => {
      let userCount = 0
      let onlineCount = 0
      let memberAvatars = []

      // We use `forEach` instead of methods like `filter` and `map` to reduce
      // the amount of loops through the members array. Some teams can get
      // quite huge.
      result.members.forEach(member => {
        if (
          member.is_bot ||
          member.is_app_user ||
          member.deleted ||
          member.id === 'USLACKBOT'
        ) {
          // Don't do statistics on irrelevant members
          return
        }

        userCount++
        if (member.presence === 'active') onlineCount++
        memberAvatars.push({
          image_512: member.profile.image_512,
          image_192: member.profile.image_192,
          image_72: member.profile.image_72,
          image_48: member.profile.image_48,
          image_32: member.profile.image_32,
          image_24: member.profile.image_24
        })
      })

      res.json({
        ok: true,
        stats: {
          users_total: userCount,
          users_online: onlineCount,
          avatars: memberAvatars
        }
      })
    })
    .catch(next)
}
