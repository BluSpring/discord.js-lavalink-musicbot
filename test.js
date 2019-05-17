const Discord = require('discord.js');
const bot = new Discord.Client();
const Music = require('./index.js');
const music = new Music(bot, {
	lavalink: {
		"restnode": {
			"host": "localhost",
			"port": 8643,
			"password":"youshallnotpass"
		},
		"nodes": [
			{ "host": "localhost", "port": 8643, "region": "asia", "password": "youshallnotpass" }
		]
	},
	admins: ["455346525716086795"],
    runLavalink: true
});

bot.login("TR0_L0-LOLOLOLOL0-l0l0l0l0");