
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Nécessaire pour les serveurs
        GatewayIntentBits.GuildMessages, // Pour écouter les messages
        GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
    ],
});
const { tokenDiscord } = require('../json/config.json');
const fs = require("fs");




function getCurrentBonuses() {
    return JSON.parse(fs.readFileSync('../json/exportToExcel.json', 'utf8'));
}

function setNewBonuses(data) {
    fs.writeFile("../json/exportToExcel.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(`Erreur lors de l'écriture dans ../json/exportToExcel.json:`, err);
        } else {
            console.log(`../json/exportToExcel.json a été mis à jour.`);
        }
    });
}




client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);


});



client.on(Events.MessageCreate, (message) => {
    let allowedChannel = '1293554062276689993';
    let firstChar = "!";
    let response = "";
    let args = message.content.split(' ');
    let data = getCurrentBonuses();

    if (message.author.bot) return;
    if (message.channel.id !== allowedChannel) return;
    if (!message.content.startsWith(firstChar)) return

    message.delete();
    switch (args[0].slice(1)) {
        case "hello":
            message.channel.send('world');
        break;
        case "quienguerre":
        case "mg":
            response = "";
            for (let member in data){
                response += "`" + member + "` ";
            }
            message.channel.send("Les joueurs en guerres sont les suivants:\n" + response);
        break;
        case "bonusjour":
        case "bcj":
            response = "";
            for (let member in data){
                response += "**" + member + " = " + data[member] + "**\n";
            }
            message.channel.send("Les bonus du jour sont actuellement les suivants:\n" + response);
        break;
        case "change":
        case "c":
            let name = args[1].toLowerCase();
            let value = args[2].toLowerCase();
            if (name === undefined || value === undefined) {
                message.channel.send("Il n'y a pas assez d'arguments dans la commande.\nExemple de commande: `!c Razor 1`").then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
                return;
            }

            if (!(name in data)){
                message.channel.send("Le nom fournie est introuvable.\nExemple de commande: `!c Razor 1`").then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
                return ;
            }
            if (!(value in ["1", "0", "-1", "?"])){
                message.channel.send("La valeur fournie est incorrecte.\nExemple de commande: `!c Razor 1`").then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
                return ;
            }
            if (value in ["1", "0"]){
                value = parseInt(value);
            }
            data[name] = value;
            setNewBonuses(data);
            message.channel.send(`Le bonus de ${name} a été changé en ${value}`)
        break;
        default:
            console.log("unknow command");
        break;
    }
});




function startListenerBot(){
    //getMembersInWar();
    client.login(tokenDiscord);
}

module.exports = {
    startListenerBot
};