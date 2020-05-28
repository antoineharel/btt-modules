let axios = require('axios');
var convert = require('xml-js');
const moment = require('moment');
let path = require('path');
const runApplescript = require('run-applescript');



moment.locale('fr');

function unescapeHtml(safe) {
    return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/"/g, '\'');
}

(async function main() {
    let sources = [
        {
            rss: "https://www.lemonde.fr/rss/une.xml",
            items: "rss.channel.item",
            icon: "lemonde.png"
        },
        {
            rss: "https://www.lefigaro.fr/rss/figaro_sciences.xml",
            items: "rss.channel.item",
            icon: "lefigaro.png"
        },
        {
            rss: "https://www.bfmtv.com/rss/info/flux-rss/flux-toutes-les-actualites/",
            items: "rss.channel.item",
            icon: "bfmtv.png"
        },
        {
            rss: "https://www.20minutes.fr/feeds/rss-actu-france.xml",
            items: "rss.channel.item",
            icon: "20minutes.png"
        },
        {
            rss: "https://feeds.feedburner.com/Iphoneaddictfr?format=xml",
            items: "rss.channel.item",
            icon: "iphoneaddict.png"
        },
        {
            rss: "https://www.macg.co/news/feed",
            items: "rss.channel.item",
            icon: "macg.png"
        },
        {
            rss: "https://feeds.feedburner.com/Kulturegeek?format=xml",
            items: "rss.channel.item",
            icon: "kulturegeek.png",
            max: 20
        },
    ];

    let source = sources[Math.floor(Math.random()*sources.length)];

    let data;
    try {
        data = (await axios.get(source.rss)).data;
    } catch (error) {
        console.log("");
    }
    let result = JSON.parse(convert.xml2json(data, {compact: true, spaces: 4}));

    let items = result;
    let items_path = source.items.split('.');
    items_path.forEach(e => items = items[e]);
    items = items.slice(0, source.max || 5);

    let article = items[Math.floor(Math.random()*items.length)];


    let title = article.title._text || article.title._cdata;
    let ago = moment(article.pubDate._text || article.pubDate._cdata).fromNow();
    let link = article.link._text || article.link._cdata;
    let icon_path = path.join(__dirname, "img", "presse", source.icon);

    let action = `
tell application "BetterTouchTool"
    set_string_variable "news_url" to "${link}"
end tell
        `
    const btt = await runApplescript(action);


    // console.log(ago, title, icon_path)
    console.log("{\"text\":\"" + unescapeHtml(title) + '\\n' + ago + "\",\"icon_path\":\"" + icon_path + "\",\"font_color\": \"255,255,255,255\"}");})();
