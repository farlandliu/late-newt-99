import { assertEquals } from "jsr:@std/assert";
import { parseEpisode } from "../lib/bbc.ts";

Deno.test("test episode parser", ()=> {
    const epData =  Deno.readTextFileSync("./tests/html/ep-m0025v3k.html");

    const res = parseEpisode(epData);
    console.log(res.length)
    assertEquals(res.length , 25)
})