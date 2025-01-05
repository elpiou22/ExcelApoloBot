const { tokenCoc, tokenDiscord } = require('../json/config.json');
const fs    = require('fs');
const axios = require('axios');



////////////////////////////////////////////
// exports
module.exports = {
    getDataRequest,
    writeInFile,

};
////////////////////////////////////////////




async function getReq(req) {
    return axios.get(req, {
        headers: {
            "Accept": "application/json",
            "authorization": `Bearer ${tokenCoc}`
        },
        params: { limit: 20 }
    }).then(response2 => {

        return response2.data;
    });
}



/**
 * Ecrit dans le fichier, met un message après écriture ou erreur
 * @param {*} response La data qu'on veut écrire
 * @param {String} file Le nom du fichier
 */
function writeInFile(response, file) {
    fs.writeFile(file, JSON.stringify(response, null, 2), (err) => {
        if (err) {
            console.error(`Erreur lors de l'écriture dans '${file}':`, err);
        } else {
            console.log(`'${file}' a été mis à jour.`);
        }
    });
}


/**
 * Permet de récupérer la liste desjoueurs présents dans la ligue ainsi que la liste des rounds
 * Attention: Lorsque la ligue est en cours, les futurs jours ne sont pas indiqués!
 * @returns {Tuple} members La liste des membres présents dans la ligue, et la liste des rounds
 */
async function getData(tag){
    let req = `https://api.clashofclans.com/v1/clans/${tag}/currentwar/leaguegroup`;
    let rounds;

    try {
        const response = await getReq(req);
        //console.log(response);
        //writeInFile(response, "letest.json")

        //writeInFile(members, "../json/leagueRounds.json");
        rounds = response['rounds'];

        return rounds; 

    } catch (error) {
        console.log("[ERROR] erreur dans le fichier requests.js dans la fonction getData()");
        console.log(error);
    }
}

/**
 * Permet de récupérer les tags des guerres du jour demandé
 * @param {Int} day 
 * @param {*} jsonData 
 * @returns {Array}
 */
function getTagsOfDay(day, jsonData){
    day--;
    //let data = fs.readFileSync('../json/leagueRounds.json', 'utf8');
    //let jsonData = JSON.parse(data);
    let tags = jsonData[day]['warTags'];
    return tags
}


/**
 * Lit tout les tags et permet de retrouver ceux d'Apologize
 * @returns 
 */
async function getDataPerDay(clanTag, rounds){
    let path = "";
    let pathDay = "";
    let returnment = [];
    let response;
    for (let index = 1; index < 8; index++) {
        pathDay = "day" + index;
        let tags = getTagsOfDay(index, rounds);
        

        for (let tagNumber = 0; tagNumber < tags.length; tagNumber++) {
            path = pathDay + "round" + tagNumber + ".json" ;
            let tag = tags[tagNumber];
            if (tag !== "#0") {
                // futur jour donc guerre encore inconnue

                let req = `https://api.clashofclans.com/v1/clanwarleagues/wars/${"%23" + tag.slice(1)}`;
                try {
                    response = await getReq(req);
                    //console.log((response.clan.tag).slice(1) + " == " + clanTag.slice(3) + "       ||        " + (response.opponent.tag).slice(1) + " == " + clanTag.slice(3));
                    if (((response.clan.tag).slice(1) == clanTag.slice(3) || (response.opponent.tag).slice(1) == clanTag.slice(3)) && response.state !== "preparation") {
                        //writeInFile(response, `../json/${path}`);
                        //console.log(response);
                        returnment.push(response);
                    }
                } catch (error) {
                    console.error(`[ERROR] Erreur avec la requête pour ${tag}:`, error);
                }
            }   
        }
    }
    return returnment;
}


async function getDataRequest(tag) {
    try {
        let rounds = await getData(tag);
        //console.log({members, rounds});
        //writeInFile(rounds, "letest.json");


        let finalData = await getDataPerDay(tag, rounds);
        //console.log(finalData);
        //writeInFile(finalData, "letest.json");
    
        return finalData;
        
    } catch (error) {
        console.log("erreur dans le fichier requests.js")
        console.log(error);
        return ;
    }
}

