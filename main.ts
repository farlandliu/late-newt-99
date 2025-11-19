import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";

import api from "./api.ts";

const app = new Hono();
// app.use('*', cors())
app.use(
  "*",
  logger(),
  poweredBy({ serverName: "BBC radio api, Powered by Deno & Hono." }),
);
app.get("/", (c) => {
  return c.json({ ok: true, message: "Hello, from BBC radio api. 2025-11-19 " });
});
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.route("/api", api);
Deno.serve(app.fetch);
