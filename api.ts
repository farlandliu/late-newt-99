import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchEpisode, fetchProgramme } from "./lib/bbc.ts";

const api = new Hono();
// api.use('*', cors())
api.get("/pm/:st/:dt", async (c) => {
  const { st, dt } = c.req.param();
  const data = await fetchProgramme(st, dt);
  return c.json({ data: data, ok: true });
});

api.get("/pm/:st/:dt/raw", async (c) => {
  const { st, dt } = c.req.param();
  const data = await fetchProgramme(st, dt);
  return c.json({ data: data, ok: true });
});

api.get("/ep/:id", async (c) => {
  const { id } = c.req.param();
  const data = await fetchEpisode(id);
  return c.json({ data: data, ok: true });
});

export default api;
