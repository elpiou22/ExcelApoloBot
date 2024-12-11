
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { tokenDiscord } = require('../json/config.json');










client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);


    const channel = client.channels.cache.get("1293554062276689993");



    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setAuthor({ name: 'Adri', iconURL: 'https://cdn.discordapp.com/icons/1218142145936887918/b011d438abf1c89896acacc9dc60df9c.webp?size=160'})


        .addFields(
            { name: 'Adri, tu as attaqué un th16 alors qu\'il reste des th15 !', value: 'il reste les numéro 3 et 4 !\n' },
        )
        .setTimestamp()
        .setFooter({ text: 'ApoloBot v0.2', iconURL: 'https://cdn.discordapp.com/icons/1218142145936887918/b011d438abf1c89896acacc9dc60df9c.webp?size=160' });

    channel.send({ embeds: [exampleEmbed] });

});



/*
Start the Bot and execute all client.once() lines
 */
function startBot(){
    client.login(tokenDiscord);
}

module.exports = {
    startBot
};