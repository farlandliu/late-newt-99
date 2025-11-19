import { assertEquals } from "jsr:@std/assert";
import { parseEpisode, parse6MusicPm, parseBrandMeta } from "../lib/bbc.ts";

Deno.test("test episode parser", ()=> {
    const epData =  Deno.readTextFileSync("tests/html/ep-m002lsc4.html");

    const res = parseEpisode(epData);
    console.log(res.length)
    assertEquals(res.length , 25)
})

Deno.test("test parse music 6", () => {
    const html =  Deno.readTextFileSync("./tests/html/bbc_6music.html");
    const res = parse6MusicPm(html)
    assertEquals(res.length> 10, true)
})

Deno.test("test parse brand meta", () => {
    const html =  Deno.readTextFileSync("./tests/html/brand.html");
    const res = parseBrandMeta(html)
    console.log(res)
    assertEquals(res.id, "b0b25hlm")
})