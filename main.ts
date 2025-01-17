import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'
import data from "./data.json" with { type: "json" };
import api from "./api.ts";

const app = new Hono()
app.use('*', cors())
app.use('*', logger(), poweredBy())
app.get('/', (c) => {
  return c.text('Hello Deno!')
})
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

// app.get("/api", (c) => c.json(data));


app.route('/api', api)
Deno.serve(app.fetch)