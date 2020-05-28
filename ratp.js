let axios = require('axios');
let path = require('path');
const runApplescript = require('run-applescript');


let dico = {
    "rers": "RER",
    "metros": "Metro",
    "tramways": "Tramway"
};

(async function main() {
    let req;
    try {
        req = (await axios('https://api-ratp.pierre-grimaud.fr/v4/traffic')).data;
    } catch (error) {
        process.exit(0);
    }
    let perturbations = {}
    perturbations["metros"] = req.result.metros.filter(ligne => !['normal', 'normal_trav'].includes(ligne.slug));
    perturbations["tramways"] = req.result.tramways.filter(ligne => !['normal', 'normal_trav'].includes(ligne.slug));
    perturbations["rers"] = req.result.rers.filter(ligne => !['normal', 'normal_trav'].includes(ligne.slug));
    let arr = [];
    perturbations.metros.forEach(element => arr.push({ ...element, type: "metros" }));
    perturbations.rers.forEach(element => arr.push({ ...element, type: "rers" }));
    perturbations.tramways.forEach(element => arr.push({ ...element, type: "tramways" }));
    if (arr.length === 0) {
        console.log("")
        process.exit(0);
    }
    let pertu = arr[Math.floor(Math.random() * arr.length)];
    let action = `
tell application "BetterTouchTool"
    set_string_variable "url" to "https://ratp.antoineharel.fr/ligne/${pertu.type.substring(0, pertu.type.length - 1)}/${pertu.line}"
end tell
    `
    const result = await runApplescript(action);
    console.log("{\"text\":\"" + pertu.title + '\\n' + dico[pertu.type] + "\",\"icon_path\":\"" + path.join(__dirname, "img", pertu.type, pertu.line) + ".png" + "\",\"font_color\": \"255,255,255,255\"}");
    process.exit(0);
})();