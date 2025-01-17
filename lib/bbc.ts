import * as cheerio from "cheerio";
const schedule_url: string =
  "https://www.bbc.co.uk/sounds/schedules/{st}/{dt}/";
const player_url: string = "https://www.bbc.co.uk/sounds/play/{pid}";
const brand_url: string = "https://www.bbc.co.uk/sounds/brand/{bid}";

export async function fetchProgramme(st: string, dt: string) {
  const url = schedule_url.replace("{dt}", dt).replace("{st}", st);
  const res = await fetch(url);
  const t = await res.text();
  const $ = cheerio.load(t);
  const jsonData = JSON.parse($("[id='__NEXT_DATA__']").text());
  const data = jsonData?.props.pageProps.dehydratedState.queries[1];
  const eps = data.state.data.data[0].data;
  return eps;
}

export async function fetchEpisode(id: string) {
  const url = player_url.replace("{pid}", id);
  const res = await fetch(url)
  const t = await res.text();
  return parseEpisode(t)
}

export  function parseEpisode (body:string) {
    const $ = cheerio.load(body);
    const filter = $("script").filter((_index, em) => {
        return $(em).text().includes("window.__PRELOADED_STATE__ =")
    })
    const jsonStr = filter.text().replace("window.__PRELOADED_STATE__ =", "").slice(0,-2)

    const jsonData = JSON.parse(jsonStr);
    return jsonData.tracklist.tracks
}