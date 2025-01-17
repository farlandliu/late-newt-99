import { Hono } from 'hono'
import { cors } from 'hono/cors'
import data from "./data.json" with { type: "json" };


const api = new Hono()
api.use('*', cors())
api.get("", (c) => c.json(data));

api.get("/:dinosaur", (c) => {
    const dinosaur = c.req.param("dinosaur").toLowerCase();
    const found = data.find((item) => item.name.toLowerCase() === dinosaur);
    if (found) {
      return c.json(found);
    } else {
      return c.text("No dinosaurs found.");
    }
  });

  export default api