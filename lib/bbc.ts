import * as cheerio from "cheerio";
const schedule_url:string = "https://www.bbc.co.uk/sounds/schedules/{st}/{dt}/";
const player_url:string = "https://www.bbc.co.uk/sounds/play/{pid}";
const brand_url:string = "https://www.bbc.co.uk/sounds/brand/{bid}";


export async function fetchProgramme(st: string, dt: string) {
    const url = schedule_url.replace("{dt}", dt).replace("{st}", st);
    const res = await fetch(url,);
    const t = await res.text();
    const $ = cheerio.load(t);
    const jsonData = JSON.parse($("[id='__NEXT_DATA__']").text());
    const data = jsonData?.props.pageProps.dehydratedState.queries[1];
    return data
}

export async function fetchEpisode(id:string) {
    const url = player_url.replace("{pid}", id);
    const res = await fetch(url).then(
        async (res) => {
            return await res.text()
        }
    )
    const $ = cheerio.load(res);
    const t = $("script:contains('window.__PRELOADED_STATE__ =')").text()
    const jsonData =JSON.parse(t.replace("window.__PRELOADED_STATE__ =", ""))
    return jsonData
}