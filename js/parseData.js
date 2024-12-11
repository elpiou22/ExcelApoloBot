const fs = require('fs');
const { writeInFile } = require('./requests.js');



////////////////////////////////////////////
// exports
module.exports = {
    getMembers,
    getMaxNumbers,
    parseDataAndExportToExcel,

};
////////////////////////////////////////////




function getMembers(data){
    //let data = JSON.parse(fs.readFileSync('../json/members.json', 'utf8'));
    
    let members = [];
    for (let index = 0; index < data.length; index++) {
        const playerName = data[index]['name'];
        members.push(playerName);
    }
    return members;
}

function getMaxNumbers(data) {
    return data.length;
    //return JSON.parse(fs.readFileSync('../json/members.json', 'utf8')).length;
}




function getParsedData(allData, clanTag = '%23P990YPPV', tostop = null) {

    let alliesData, opponentsData;
    let allAlliesPlayers = [];
    let allOpponentsPlayers = [];
    let dataExported = [];

    let alliesPlayers, opponentsPlayers;


    for (let i = 0; i < allData.length; i++) {
        const data = allData[i];

        if (data.clan.tag.slice(1) == clanTag.slice(3)) {
            alliesData    = data['clan']['members'];
            opponentsData = data['opponent']['members'];
        } else if (data.opponent.tag.slice(1) == clanTag.slice(3)) {
            alliesData    = data['opponent']['members'];
            opponentsData = data['clan']['members'];
        } else {
            console.log("Erreur dans getParsedData()");
            return;
        }


        
        
        opponentsPlayers = [];
        for (let index = 0; index < opponentsData.length; index++) {
            let playerName     = opponentsData[index]['name'];
            let playerTag      = opponentsData[index]['tag'];
            let playerTH       = opponentsData[index]['townhallLevel'];
            let playerPosition = opponentsData[index]['mapPosition'];
            let isDestroyed    = opponentsData[index]['opponentAttacks'];

            let bestAttackerTag;
            let bestAttackStars;
            let bestAttackerName;
            if (isDestroyed){
                bestAttackerTag  = opponentsData[index]['bestOpponentAttack']['attackerTag'];
                bestAttackStars  = opponentsData[index]['bestOpponentAttack']['stars'];
                bestAttackerName = alliesData.find(member => member.tag == bestAttackerTag)['name'];
            } else{
                bestAttackerTag  = null;
                bestAttackStars  = null;
                bestAttackerName = null;
            }
            
            opponentsPlayers.push({
                name : playerName,
                tag  : playerTag,
                th   : playerTH,
                mapPosition      : playerPosition,
                bestAttackername : bestAttackerName, 
                bestAttackerTag  : bestAttackerTag, 
                bestAttackStars  : bestAttackStars,
            });
        }
        
        opponentsPlayers.sort((a, b) => a.mapPosition - b.mapPosition);
        for (let index = 0; index < opponentsPlayers.length - 1; index++) {
            const player1 = opponentsPlayers[index];
            const player2 = opponentsPlayers[index + 1];
            if (player1['th'] < player2['th']) {
                player2['th'] = player1['th'];
            }
            
        }
        
        /*
        if (tostop == 1) {
            return opponentsPlayers;
        }
        */
        

        // allies
        alliesPlayers = [];
        for (let index = 0; index < alliesData.length; index++) {
            let playerName     = alliesData[index]['name'];
            let playerTag      = alliesData[index]['tag'];
            let playerTh       = alliesData[index]['townhallLevel'];
            let playerPosition = alliesData[index]['mapPosition'];
            
            let attackStars;
            let defenderTag;
            let defenderName;
            let defenderTh;
            let attackOrder;
            if (alliesData[index]['attacks']){
                defenderTag  = alliesData[index]['attacks'][0]['defenderTag'];
                attackStars  = alliesData[index]['attacks'][0]['stars']; //@todo verifier si deja attaqué
                defenderName = opponentsData.find(member => member.tag == defenderTag)['name'];
                defenderTh   = opponentsPlayers.find(member => member.tag == defenderTag)['th'];
                attackOrder  = alliesData[index]['attacks'][0]['order'];

            } else{
                defenderTag  = null;
                defenderName = null;
                attackStars  = null;
                defenderTh   = null;
                attackOrder  = null;
            }
            
            alliesPlayers.push({
                name         : playerName,
                tag          : playerTag,
                mapPosition  : playerPosition,
                playerTh     : playerTh,
                defenderName : defenderName, 
                defenderTag  : defenderTag, 
                defenderTh   : defenderTh,
                attackStars  : attackStars,
                attackOrder  : attackOrder,
                bonusValue   : null,
            });
        }
        alliesPlayers.sort((a, b) => a.mapPosition - b.mapPosition);
        
        /*
        if (tostop == 2) {
            return alliesPlayers;
        }
        
        allAlliesPlayers.push(alliesPlayers);
        allOpponentsPlayers.push(opponentsPlayers);
        */
        dataExported.push([alliesPlayers, opponentsPlayers]);
    }
    return dataExported;
    //return [allAlliesPlayers, allOpponentsPlayers];
}

function inferiorOrEqualTownHallsLeft(playerTag, data) {
    // recuperation des th ennemis
    // sort en fonction des order attacks
    // si hdv inferieur au dessus de l'attaque -> true
    let alliesData = data[1];
    let json_th_template = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
    };

    alliesData = alliesData.filter(entry => entry.attackOrder !== null);
    alliesData.sort((a, b) => a.attackOrder - b.attackOrder);


    for (let index = 0; index < alliesData.length; index++) {
        let playerInformations = alliesData[index];
        if (playerTag === playerInformations.tag && playerInformations.defenderTh > playerInformations.playerTh) {
            //console.log(playerInformations.name + " a attaqué " + playerInformations.defenderName + " de th " + playerInformations.defenderTh + " pour " + playerInformations.attackStars + " étoiles.");

            if (playerInformations.attackStars === 3){
                null;
            } else {
                // on check si il restait des th inferieurs
                let json_th = { ...json_th_template };
                for (let i = 0; i < data[0].length; i++) {
                    let player = data[0][i];
                    if (player.bestAttackStars !== 3){
                        json_th[player.th] ++;
                    }
                }
                //console.log("Mais, il reste " + json_th[playerInformations.playerTh] + " th" + playerInformations.playerTh);
                return json_th[playerInformations.playerTh];
            }
        }
    }
    return "notFound";
}


function setBonusValue(allData) {



    let bonusesData = [];

    for (let i = 0; i < allData.length; i++) {
        const data = allData[i];

        // data0 => allies
        // data1 => opponents

        let alliesData = data[0];

        for (let index = 0; index < alliesData.length; index++) {
            let player      = alliesData[index];
            let attackerTh  = player['playerTh'];
            let attackerTag = player['tag'];
            let defenderTh  = player['defenderTh'];
            let attackStars = player['attackStars'];
            player['bonusValue'] = calculateBonus(data, attackerTag, attackerTh, defenderTh, attackStars);
        }
        bonusesData.push(alliesData);
    }
    return bonusesData;
}

function calculateBonus(data, attackerTag, attackerTh, defenderTh, attackStars){


    // 3 étoiles   -> 1
    // pas attaqué -> -1
    if (attackStars === 3) {
        return 1;
    } else if(attackStars == null){
        return -1;
    }
    
    // 0 étoiles hdv inférieur -> -1
    // 0 étoiles hdv superieur -> 0
    if (attackStars === 0) {
        if (attackerTh >= defenderTh) {
            return -1
        } else {
            return 0;
        }
    }

    // 2 étoiles hdv égal ou inferieur
    if (attackStars === 2 && (attackerTh >= defenderTh)) {
        return 0;
    }

    // hdv inferieur et 2 étoiles (ou moins) -> 0


    // hdv superieur et 2 étoiles:
    // hdv 14 attaque un hdv 15 mais tout les hdv 14 et 13 sont détruits. (3*, 2*)-> 1 ; (1*, 0*)-> 0

    switch (inferiorOrEqualTownHallsLeft(attackerTag, data)) {
        case 0:
            return 1;
        case "notFound":
            //console.log("[Work In Progress] calculateBonus()");
            return null;
        default:
            return 0;
    }
}


function exportToExcel(allData) {
    let allNewData = [];
    let newData;
    for (let i = 0; i < allData.length; i++) {
        const data = allData[i];

        newData = {};
        for (let index = 0; index < data.length; index++) {
            let player = data[index];
            newData[player['name']] = player['bonusValue'];
        }
        allNewData.push(newData);
    }
    return allNewData;
}




async function parseDataAndExportToExcel(allData, clanTag) {

    let dataWithBonuses = setBonusValue(getParsedData(allData = allData, clanTag = clanTag, tostop = null));
    //writeInFile(dataWithBonuses[0], "letest.json");
    //writeInFile(getParsedData(allData = allData, clanTag = clanTag, tostop = null)[0], "letest.json")
    //writeInFile(exportToExcel(dataWithBonuses), "letest.json");
    return exportToExcel(dataWithBonuses);
}















