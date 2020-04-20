# discord.js-lavalink-musicbot
A Lavalink music bot module based on [DarkoPendragon](https://github.com/DarkoPendragon)'s [discord.js-musicbot-addon](https://github.com/DarkoPendragon/discord.js-musicbot-addon) module.
[![npm package](https://nodei.co/npm/discord.js-lavalink-musicbot.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-lavalink-musicbot/)  

<br><br>
Please join my Discord server here for assistance with the module: [XeriApps Support](https://discord.gg/dNN4azK)
[![Discord Server](https://discordapp.com/api/guilds/483203473643405312/embed.png)](https://discord.gg/dNN4azK)

# Prerequisites
- A Lavalink node.
- Java 13 (if you don't have one)
- Node.js 12
- A brain...

# Usage
Install [Lavalink](https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1). An example
application.yml is provided in the "Lavalink" folder.

If you install the actual module, Lavalink should be provided.

To install the module, run `npm i -s discord.js-lavalink-musicbot`

# Notice
If you use Glitch, make sure you set the port to 3000 for both the application.yml and the configuration in the "lavalink" area, because Glitch only works on that port.<br>
Make sure you use a completely separate Glitch project for Lavalink.<br>
Also please remember to limit the memory usage. That's all I'm telling you :)

# Setup example
```javascript
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.music = new (require('discord.js-lavalink-musicbot'))(bot, {
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
| loopCmd | String | no | What should the loop command be. | loop |
| admins | String[] | no | Who are the admins? | [] |
| customGame | PresenceData | no | Set the custom game! | { name: '', type: 'PLAYING' } |
| lavalink | LavalinkOptions | yes, if you changed the default Lavalink settings | Lavalink settings! | (Check in the example) | 

# Changelog (only for v0.0.7 and later)
v0.1.0
---
- Added typings file.
- Migrated from [discord.js-lavalink](https://npmjs.com/package/discord.js-lavalink) to [Lavacord](https://npmjs.com/package/lavacord)
- Added .gitignore and .npmignore
- Modified the README
- Cleared a lot of the commented code because that used a lot of space

v0.0.9
---
- Fixed queue being undefined in execQueue (wow I never noticed that, thanks Discord server!)
- Added loop and seek command.
- Updated all dependencies.
- Reconfigure for better connecting if host doesn't give port. (example: localhost:8538 -> 154.76.225.18/lavalink.djsl-host.com) by adding an address config. You're welcome.
- Updated literally everything to run better. Hopefully.

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