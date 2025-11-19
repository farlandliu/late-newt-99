import * as cheerio from "cheerio";
const schedule_url: string =
  "https://www.bbc.co.uk/schedules/{st}/{dt}/";
const player_url: string = "https://www.bbc.co.uk/sounds/play/{pid}";
const brand_url: string = "https://www.bbc.co.uk/sounds/brand/{bid}";
const radioSeries_url: string = "https://www.bbc.co.uk/programmes/m001hvms/episodes/player"


export async function fetchProgramme(st: string, dt: string) {
  const dt2 = dt.replace("-", "/");
  const url = schedule_url.replace("{dt}", dt2).replace("{st}", st);
  console.log(`fetch url: ${url}`)
  const res = await fetch(url);
  const t = await res.text();
  const $ = cheerio.load(t);
  
  let txt = '';
  $("script[type='application/ld+json']").each((_i, el) => {
    // console.log($(el).text());
    const raw = $(el).html();
    if (raw?.includes('RadioEpisode')) {
      txt = raw || '';
    }
  });
  try {
    const jsonData = JSON.parse(txt)
    // const data = jsonData?.props.pageProps.dehydratedState.queries[1];
    // const eps = data.state.data.data[0].data;

    return jsonData;
  }
  catch (e) {
    console.error("Error parsing JSON:", e);
  }
  return null;
  
}
// m002lsc4
// fetch radio series by brand id: m001hvms
export async function fetchSeriesByBrandId(bid: string) {
  const url = radioSeries_url.replace("{bid}", bid);
  console.log(url)
  const res = await fetch(url)
  const $ = cheerio.load(await res.text());
  let txt = '';
  $("[type='application/ld+json']").each((_i, el) => {
   
    const raw = $(el).text();
    if (raw?.includes('RadioSeries')) {
      txt = raw || '';
    }
  }
  );
  return JSON.parse(txt);
}

export async function fetchProgrammeRaw(st: string, dt: string) {
  const dt2 = dt.replace("-", "/");
  const url = schedule_url.replace("{dt}", dt2).replace("{st}", st);
  const res = await fetch(url);
  console.log(`fetch url: ${url}`)
  const t = await res.text();
  const $ = cheerio.load(t);

  let txt = '';
  $("script[type='application/ld+json']").each((_i, el) => {
    // console.log($(el).text());
    const raw = $(el).html();
    if (raw?.includes('RadioEpisode')) {
      txt = raw || '';
    }
  });
  // const jsonData = JSON.parse($("[type='application/ld+json']").text());
  // const data = jsonData?.props.pageProps.dehydratedState.queries[1];
  return txt;
}

export async function fetchEpisode(id: string) {
  const url = player_url.replace("{pid}", id);
  const res = await fetch(url); 
  const t = await res.text();
  return parseEpisode(t);
}

export function parseEpisode(body: string) {
  const $ = cheerio.load(body);
  // const filter = $("script").filter((_index, em) => {
  //   return $(em).text().includes("window.__PRELOADED_STATE__ =");
  // });
  // const jsonStr = filter.text().replace("window.__PRELOADED_STATE__ =", "")
  //   .slice(0, -2);

  const jsonData = JSON.parse($("[id='__NEXT_DATA__']").text());
  // return jsonData;
  try {
    return jsonData?.props.pageProps.dehydratedState.queries[1].state.data.data;
  } catch (e) {
    console.error("Error parsing episode data:", e);
  }
  return null;
}

export function parse6MusicPm(body: string) {
  const $ = cheerio.load(body);
  const jsonData = $("[id='__NEXT_DATA__']").text().replace(
    'type="application/json">',
    "",
  );
  const data = JSON.parse(jsonData);
  return data?.props.pageProps.dehydratedState.queries[0].state.data.data[1]
    .data[0].data;
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

 import * as path from "node:path";

// load tests files for testing
export async function loadTestFile() {
  const fs = await import("node:fs/promises");

  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(__dirname, "..", "tests", "html", "schedule.html");
  const data = await fs.readFile(filePath, "utf8");
  const $ = cheerio.load(data);
  let txt = '';
  $("script[type='application/ld+json']").each((_i, el) => {
    // console.log($(el).text());
    const raw = $(el).html();
    if (raw?.includes('RadioEpisode')) {
      txt = raw || '';
    }
  }
  );
  try {
    return txt ? JSON.parse(txt) : null;
  } catch (e) {
    console.error("Error parsing JSON from test file:", e);
  }
  return null;
}