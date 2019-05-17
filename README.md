# discord.js-lavalink-musicbot
A Lavalink music bot module based on [DarkoPendragon](https://github.com/DarkoPendragon)'s [discord.js-musicbot-addon](https://github.com/DarkoPendragon/discord.js-musicbot-addon) module.
[![npm package](https://nodei.co/npm/discord.js-lavalink-musicbot.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-lavalink-musicbot/)  

<br><br>
Please join my Discord server here for assistance with the module: [XeriApps Support](https://discord.gg/dNN4azK)
[![Discord Server](https://discordapp.com/api/guilds/483203473643405312/embed.png)](https://discord.gg/dNN4azK)

# Usage
Install [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1). An example
application.yml is provided in the "Lavalink" folder.

If you install the actual module, Lavalink should be provided.

To install the module, run `npm i -s discord.js-lavalink-musicbot`

# Notice
~~If you use Glitch, make sure you set the port to 3000 for both the application.yml and the configuration in the "lavalink" area, because Glitch only works on that port.~~
You are unable to use Glitch if you want to use this module, because Lavalink requires an insane amount of memory/RAM (approximately 500-600 MB) to run due to Java. Unfortunately, due to Glitch being limited to 512 MB of memory/RAM, this means you are unable to run Lavalink.

# Setup example
```javascript
const Discord = require('discord.js');
const bot = new Discord.Client();
const Music = require('discord.js-lavalink-musicbot');
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
	admins: ["455346525716086795"]
});

bot.login('bot token here');
```

# Options

| Option | Type | Required? | Description | Default
| --- | --- | --- | --- | --- |
| prefix | String | no | Shows what you want your bot to respond to. | ! |
| helpCmd | String | no | What should the help command be. | mhelp |
| playCmd | String | no | What should the play command be. | play |
| pauseCmd | String | no | What should the pause command be. | pause |
| stopCmd | String | no | What should the stop command be. | stop |
| queueCmd | String | no | What should the queue command be. | queue |
| npCmd | String | no | What should the Now Playing command be. | np |
| skipCmd | String | no | What should the skip command be. | skip |
| volumeCmd | String | no | What should the volume command be. | volume |
| resumeCmd | String | no | What should the resume command be. | resume |
| admins | Array | no | Who are the admins? | [] |
| customGame | Object | no | Set the custom game! | { name: '', type: 'PLAYING' } |
| lavalink | Object | yes, if you changed the default Lavalink settings | Lavalink settings! | (Check in the example) | 

# Changelog (only for v0.0.7 and later)
v0.0.8
---
- Switched from [snekfetch](https://npmjs.com/package/snekfetch) to [axios](https://npmjs.com/package/axios)
- Reconfigured the module to no longer require a token to use.
- Added discord.js v12 support (presumably)

v0.0.7
---
- Added volume command
- Fixed skip command (Probably)
- Reconfigured the module for the latest version of Lavalink