import { Hono } from "hono";
// import { cors } from "hono/cors";
import { fetchEpisode, fetchProgramme, fetchBrandMeta, fetchProgrammeRaw } from "./lib/bbc.ts";
import { loadTestFile } from "./lib/bbc.ts";

const api = new Hono();
// api.use('*', cors())
api.get("/pm/:st/:dt", async (c) => {
  const { st, dt } = c.req.param();
  console.log(dt)
  const dt2 = dt.replace('-', '/')
  const data = await fetchProgramme(st, dt2);
  return c.json({ data: data, ok: true });
});

api.get("/pm/:st/:dt/raw", async (c) => {
  const { st, dt } = c.req.param();
  const dt2 = dt.replace('-', '/')
  const data = await fetchProgrammeRaw(st, dt2);
  return c.json({ data: data, ok: true });
});

api.get("/ep/:id", async (c) => {
  const { id } = c.req.param();
  const data = await fetchEpisode(id);
  return c.json({ data: data, ok: true });
});

api.get("/bd/:id", async (c) => {
  const { id } = c.req.param();
  const data = await fetchBrandMeta(id);
  return c.json({ data: data, ok: true });
});

api.get("/testfile", async (c) => {
  const data = await loadTestFile();
  return c.json({ data: data, ok: true });
});


export default api;
