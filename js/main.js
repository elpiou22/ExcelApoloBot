const { startBot } = require('./bot.js');
const { getDataRequest } = require('./requests.js');

const { parseDataAndExportToExcel } = require('./parseData.js');

const {
    createExcel, 
} = require('./excel.js');


////////////////////////////////////////////
// Clan tags
let hashtag     = "%23";
let apo         = hashtag + "P990YPPV";
let hib         = hashtag + "2GQPVRC8J";
////////////////////////////////////////////
// variable to edit
let clanTocheck = hib;
let excelPath   = "../export/v0.xlsx";
////////////////////////////////////////////

// @todo getMembers

async function test() {
    console.log("Bien spécifier le clan a lire dans: ./js/main.js");
    console.log("Bien spécifier les tokens ClashApi et DiscordApi dans: ./json/config.json");
    console.log("Début du programme:");
    try {

        let dataRequest = await getDataRequest(clanTocheck);
        console.log("[OK] data request");
        // dataRequest[0] => data
        // dataRequest[1] => members in league

        let currentData = await parseDataAndExportToExcel(dataRequest[0], clanTocheck);
        console.log("[OK] parse Data");


        createExcel(currentData, dataRequest[1], excelPath);
        console.log(`[OK] fichier Excel créé dans: "${excelPath}"`);
        
    } catch (error) {
        console.log("erreur dans le script main.js");
        return ;
    }
}

test();