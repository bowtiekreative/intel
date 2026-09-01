import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'

import apiRoutes from './routes/api.js'
import siteRoutes from './routes/site.js'
import { ASSET_BY_URL } from './assets.js'
import { integrity } from './corpus.js'

const here = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT ?? 3000)
const HOST = process.env.HOST ?? '0.0.0.0'

const app = Fastify({
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
  trustProxy: true,
  bodyLimit: 1_048_576
})

// The scorer posts a plain HTML form, so it must work without JavaScript.
app.addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'string' }, (req, body, done) => {
  try {
    const params = new URLSearchParams(body)
    const out = {}
    for (const [k, v] of params) out[k] = v
    done(null, out)
  } catch (err) {
    done(err)
  }
})

await app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['content-type']
})

/**
 * Security headers on every response. The site loads its own CSS and JS, Google Fonts, and
 * the canonical brand assets from the design-system CDN - nothing else, so the policy is tight.
 * Inline style attributes appear in the markup, hence 'unsafe-inline' for styles only.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https://designsystem.bowtiekreative.com data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ')

app.addHook('onSend', async (req, reply, payload) => {
  reply.header('content-security-policy', CSP)
  reply.header('strict-transport-security', 'max-age=31536000; includeSubDomains')
  reply.header('x-content-type-options', 'nosniff')
  reply.header('x-frame-options', 'DENY')
  reply.header('referrer-policy', 'strict-origin-when-cross-origin')
  reply.header('permissions-policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), interest-cohort=()')
  reply.header('cross-origin-opener-policy', 'same-origin')
  reply.header('x-robots-tag', 'index, follow')
  return payload
})

// Fingerprinted CSS and JS, served immutable. Registered as explicit routes so they cannot
// shadow anything else.
for (const asset of ASSET_BY_URL.values()) {
  app.get(asset.url, async (req, reply) => reply
    .type(asset.type)
    .header('cache-control', 'public, max-age=31536000, immutable')
    .header('etag', `"${asset.hash}"`)
    .send(asset.body))
}

await app.register(fastifyStatic, {
  root: join(here, '..', 'public'),
  prefix: '/',
  index: false,
  decorateReply: false,
  maxAge: '1h'
})

// Fastify copies the error handler into each plugin context at registration time, so this
// must be set before the routes are registered or /v1 would fall back to the default shape.
app.setErrorHandler((err, req, reply) => {
  req.log.error({ err }, 'request failed')
  const code = err.statusCode ?? 500
  if (req.url.startsWith('/v1/')) {
    return reply.code(code).send({
      error: code === 500 ? 'internal_error' : 'request_error',
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    })
  }
  return reply.code(code).type('text/html; charset=utf-8').send(`<!doctype html><meta charset="utf-8"><title>Error</title><p>${code}</p>`)
})

await app.register(apiRoutes)
await app.register(siteRoutes)


// The typed collections are read from named sections of the corpus. If one stopped resolving,
// the service still starts - the API reports it at /v1/integrity - but it is logged loudly.
const state = integrity()
if (!state.ok) {
  app.log.warn({ integrity: state }, 'one or more typed collections did not resolve against the corpus')
}

try {
  await app.listen({ port: PORT, host: HOST })
  app.log.info(`intel system api listening on ${HOST}:${PORT}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    app.log.info(`${signal} received, closing`)
    await app.close()
    process.exit(0)
  })
}
