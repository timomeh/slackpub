# slackpub 🍻

slackpub provides an api for managing open slack communities.

- Users can join your slack community by email.
- Get some stats (like amount of members) to show off on your landing page.

For available API routes, check out the [API Documentation](#API-Documentation).

<!-- toc -->

- [Usage](#usage)
  * [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  * [`POST /api/invitations`](#post-apiinvitations)
  * [`GET /api/stats`](#get-apistats)
  * [Errors](#errors)
- [Contribute](#contribute)
- [License](#license)

<!-- tocstop -->

## Usage

slackpub is a standard express application. Clone it and push it to a PaaS or
your own server. Be sure to set required [environment variables](#environment-variables).

```sh
# Install project dependencies
npm install

# Start the server
npm start
```

### Environment Variables

#### `SLACK_TOKEN`

**Required.** API token for slack with admin permissions. Can be a legacy token
or an OAuth token.

##### Legacy Token

1. Go to https://api.slack.com/custom-integrations/legacy-tokens.
2. Click on "Create token" for the corresponding slack workspace.

##### OAuth Token

1. Go to https://api.slack.com/apps.
2. Create a new app for your slack team.
3. Click on "Permissions" in the section "Add features and functionality".
4. Use the `admin` permission.
5. Click on "Install App to Workspace".
6. In the sidebar, click on "Basic Information" and copy the Client ID of your app.
7. Open the following link in your browser: https://slack.com/oauth/authorize?&client_id=CLIENT_ID&team=WORKSPACE_NAME&install_redirect=install-on-team&scope=admin+client

- `CLIENT_ID` is the Client ID you just copied.
- `WORKSPACE_NAME` is the name of your workspace. If your domain is
  `helloworld.slack.com`, then your workspace name is `helloworld`.

8. Find your token in your App Settings under "Install App".

#### `SLACK_NAME`

**Required.** The name of your slack workspace. If your domain is
`helloworld.slack.com`, then your workspace name is `helloworld`.

#### `SLACK_INITIAL_CHANNEL_IDS`

**Required.** The **IDs** (not names) of the slack channels, which new users
should initially join. Separate multiple IDs with a comma. You can find out the
channel id by opening a channel in your browser: `helloworld.slack.com/messages/CHANNEL_ID/`

#### `APP_CORS_ORIGIN`

CORS origin to control which origins are allowed to access the api. The value
will be JSON.parse'd and used as the origin option of the cors module:
https://github.com/expressjs/cors#configuration-options

Default: `true`

#### `APP_STATS_CACHE_TIME`

Internal cache time in milliseconds of GET /api/stats. Caching stats causes
less requests to slack's api, faster response times, and prevents hitting
slack's api limit.

Defaults: `600000` (= 10 minutes)

## API Documentation

### `POST /api/invitations`

Sends an invitation to your slack workspace to an email.

**Request Body:**

```json
{
  "email": "hello@world.com"
}
```

**Response Status:** `201`

**Response Body:**

```json
{
  "ok": true,
  "message": "Invitation sent."
}
```

### `GET /api/stats`

Returns some statistics for your slack workspace. The response is cached
server-side which can be controlled by the environment varibale [`APP_STATS_CACHE_TIME`](#APP_STATS_CACHE_TIME).

**Response Status:** `200`

**Response Body:**

```json
{
  "ok": true,
  "stats": {
    "users_total": 1234,
    "users_online": 789,
    "avatars": [
      {
        "image_512": "https://...",
        "image_192": "https://...",
        "image_72": "https://...",
        "image_48": "https://...",
        "image_32": "https://...",
        "image_24": "https://..."
      }
    ]
  }
}
```

### Errors

Error responses will have an status code >= `400` and the following body:

```json
{
  "ok": false,
  "status": "HttpStatusError",
  "message": "A short message describing what went wrong."
}
```

## Contribute

slackpub is an [Express](http://expressjs.com/) app.

1. Fork the repo and clone it to your machine
2. `npm install`
3. `npm run watch` will start [nodemon](https://github.com/remy/nodemon)
4. Run tests with: `npm test` (use watch mode: `npm test -- --watch`)
5. Lint it: `npm run lint`

## License

MIT
