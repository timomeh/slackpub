import { HttpError, NotFound } from 'http-errors'

export function fourohfour(_req, _res, next) {
  const error = new NotFound('Route not found.')
  next(error)
}

export function common(error, _req, res, next) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      ok: false,
      status: error.name,
      message: error.message
    })
  } else {
    next(error)
  }
}

export function server(error, _req, res, _next) {
  res.status(500).json({
    ok: false,
    status: 'InternalServerError',
    message: error.toString()
  })
}
