# discord.js-lavalink-musicbot
A Lavalink music bot module based on [DarkoPendragon](https://github.com/DarkoPendragon)'s [discord.js-musicbot-addon](https://github.com/DarkoPendragon/discord.js-musicbot-addon) module.

<br><br>
Please join my bot's Discord server here for assistance with the module: [FoozBallKing Bot Official](https://discord.gg/CYVBkej)

# Usage
Install [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1). An example
application.yml is provided in the "Lavalink" folder.

# Setup example
```javascript
const Discord = require('discord.js');
const bot = new Discord.Client();
const Music = require('discord.js-lavalink-musicbot');
const music = new Music(bot, {
	lavalink: {
		"restnode": {
			"host": "localhost",
			"port": 2333,
			"password":"b1nzyR8l1m1t5"
		},
		"nodes": [
			{ "host": "localhost", "port": 80, "region": "asia", "password": "b1nzyR8l1m1t5" }
		],
	},
	admins: ["455346525716086795"],
	token: "bot token here"
});
```