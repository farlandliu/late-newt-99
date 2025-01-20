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
  const res = await fetch(url);
  if (res.ok) {
    const t = await res.text();
    return parseEpisode(t);
  } else {
    return ({ok:false})
  }
  
}

export function parseEpisode(body: string) {
  const $ = cheerio.load(body);
  const filter = $("script").filter((_index, em) => {
    return $(em).text().includes("window.__PRELOADED_STATE__ =");
  });
  const jsonStr = filter.text().replace("window.__PRELOADED_STATE__ =", "")
    .slice(0, -2);

  const jsonData = JSON.parse(jsonStr);
  return jsonData.tracklist.tracks;
}

export function parse6MusicPm(body: string) {
  const $ = cheerio.load(body);
  const jsonData = $("[id='__NEXT_DATA__']").text().replace(
    'type="application/json">',
    "",
  );
  const data = JSON.parse(jsonData);
  return data?.props.pageProps.dehydratedState.queries[0].state.data.data[1]
    .data;
}

export async function fetchBrandMeta(bid: string) {
  const url = brand_url.replace("{bid}", bid);
  const res = await fetch(url);
  const t = await res.text();
  return parseBrandMeta(t)
}

export function parseBrandMeta(body: string) {
  const $ = cheerio.load(body);
  const title = $('meta[property="og:title"]').attr("content") ||
    $("title").text() ||
    $('meta[name="title"]').attr("content");
  const description = $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content");
  const url = $('meta[property="og:url"]').attr("content");
  const image = $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content");
  const icon = $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href");
    const id = url?.split("/")[5]

  return {
    id: id,
    title: title,
    description: description,
    url: url,
    image: image,
    icon: icon,
  };
}
