import { assertEquals } from "jsr:@std/assert";
import { parseEpisode, parse6MusicPm } from "../lib/bbc.ts";

Deno.test("test episode parser", ()=> {
    const epData =  Deno.readTextFileSync("./tests/html/ep-m0025v3k.html");

    const res = parseEpisode(epData);
    console.log(res.length)
    assertEquals(res.length , 25)
})

Deno.test("test parse music 6", () => {
    const html =  Deno.readTextFileSync("./tests/html/bbc_6music.html");
    const res = parse6MusicPm(html)
    console.log(res)
    assertEquals(res.length> 10, true)
})