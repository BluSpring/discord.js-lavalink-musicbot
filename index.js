/*
	This is the Lavalink version of nexu-dev and DarkoPendragon's discord.js-musicbot-addon!
	Get Lavalink here: https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1
	
	Lavalink has also been included in this module's folder along with its settings.
	
	You require to manually run it due to me not being sure if this laptop can necessarily handle Lavalink.
	Damn ASUS EeePCs and Intel Atoms...
	
	You also don't require to add the Lavalink config into the options due to it already being included
	in the module, unless you changed its settings.
	
	This module, like a lot of my code, has loads of notes to help you out!
	
	My GitHub: https://github.com/BluSpring
	Support: https://discord.gg/dNN4azK
*/

const Discord = require('discord.js');
const PACKAGE = require('./package.json');
const Lavalink = require('discord.js-lavalink');
const { PlayerManager } = Lavalink;
const snekfetch = require('snekfetch');

const defaultRegions = {
    asia: ["sydney", "singapore", "japan", "hongkong"],
    eu: ["london", "frankfurt", "amsterdam", "russia", "eu-central", "eu-west"],
    us: ["us-central", "us-west", "us-east", "us-south", "brazil"]
};

let currentTrack = null;

module.exports = function (clientOriginal, options) {
	class LavalinkMusic { // Construct everything?
		constructor(clientOriginal, options) {
			this.prefix = (options && options.prefix) || '!';
			this.queues = {};
			this.loops = {};
			this.admins = (options && options.admins) || [];
			this.lavalink = (options && options.lavalink) || {
				restnode: {
					host: "localhost",
					port: 2333,
					password: "b1nzyR8l1m1t5"
				},
				nodes: [
					{ host: "localhost", port: 2333, region: "asia", password: "b1nzyR8l1m1t5" }
				],
			};
			this.token = (options && options.token);

			// Commands

			// List: mhelp, play, skip, queue, stop, np, pause, resume
			// Yes I made that list for myself so I don't randomly forget the commands.
			this.helpCmd = (options && options.helpCmd) || 'mhelp'; // M'helpy
			this.playCmd = (options && options.playCmd) || 'play'; // Let's play around... Okay that's sexual, nvm
			this.skipCmd = (options && options.skipCmd) || 'skip'; // Skip around.
			this.queueCmd = (options && options.queueCmd) || 'queue'; // Queue me in line for your loooove- That is still sexual...
			this.stopCmd = (options && options.stopCmd) || 'stop'; // IT'S TIME TO STAHP
			this.npCmd = (options && options.npCmd) || 'np'; // No problem
			this.pauseCmd = (options && options.pauseCmd) || 'pause'; // Pause that! *moves the girl's boyfriend into the trash*
			this.resumeCmd = (options && options.resumeCmd) || 'resume'; // Resume! Heeeey, gorgeous- *gets bitch slapped*
			this.volumeCmd = (options && options.volumeCmd) || 'volume'; // *EARRAPE*
			// Sorry for the puns btw


			this.customGame = (options && options.customGame) || { name: '', type: 'PLAYING' };
			this.logging = (options && options.logging) || false;
		}
		
	}
	
	var music = new LavalinkMusic(clientOriginal, options);
	var musicbot = music;
	
	class MusicClient extends Discord.Client { // Music client setup, sidenote this isn't my code once again.

		constructor(options) {
			super(options);

			this.player = null;

		}

	}
	
	var client = new MusicClient();
	client.login(music.token); // Relogin the bot just for the Lavalink thing.

	async function returnErr(objName, objType) {
		// Since I was getting fucking lazy, I decided to make this.
		console.log(new TypeError(`"${objName}" must be equivelent to type "${objType}"`));
		process.exit(1);
	}
	
	async function startBot() { // Start the damn bot.
		if (process.version.slice(1)
	    .split('.')[0] < 8) {
			console.log(new Error(`[LavalinkMusicBot] Node v8 or higher is required, please update!`));
			process.exit(1);
		}
		
		if(Discord.version.split('.')[0] > 12) {
			console.log(new Error(`[LavalinkMusicBot] Discord.JS version 12 and above is currently unsupported! Please use an older version!`));
			process.exit(1);
		}
	
		if (typeof music.admins !== 'object') {
			console.log(new TypeError(`"admins" must be an object (array)`));
			process.exit(1);
		}
		
		if(typeof music.prefix !== 'string') {
			console.log(new TypeError(`"prefix" must be a string`));
			process.exit(1);
		}

		if(typeof music.helpCmd !== 'string') {
			console.log(new TypeError('"helpCmd" must be a string'));
			process.exit(1);
		}

		// List: play, skip, queue, stop, np, pause, resume
		// Another list.. Laziness 100%
		if(typeof music.playCmd !== 'string') {
			returnErr('playCmd', 'string');
		}

		if(typeof music.queueCmd !== 'string') {
			returnErr('queueCmd', 'string');
		}
		if(typeof music.skipCmd !== 'string') {
			returnErr('skipCmd', 'string');
		}
		if(typeof music.stopCmd !== 'string') {
			returnErr('stopCmd', 'string');
		}
		if(typeof music.npCmd !== 'string') {
			returnErr('npCmd', 'string');
		}
		if(typeof music.pauseCmd !== 'string') {
			returnErr('pauseCmd', 'string');
		}
		if(typeof music.resumeCmd !== 'string') {
			returnErr('resumeCmd', 'string');
		}

		if(typeof music.volumeCmd !== 'string') {
			returnErr('volumeCmd', 'string');
		}
		
		
		if(typeof music.lavalink !== 'object') {
			console.log(new TypeError(`"lavalink" options must be an object!`));
			process.exit(1);
		}
		
		if(!music.lavalink.restnode || music.lavalink.nodes.length == 0) {
			console.log(new TypeError(`You seem to be missing restnode or a node.`));
			process.exit(1);
		}

		if(!music.token) {
			console.log(new TypeError('You require to add the token!'));
			process.exit(1);
		}

		if(typeof music.customGame !== 'object') {
			returnErr('customGame', 'object');
		}

		if(typeof music.customGame.name !== 'string') {
			returnErr('customGame.name', 'string');
		}

		if(typeof music.customGame.type !== 'string') {
			returnErr('customGame.type', 'string');
		}

		const custo = music.customGame.type;
		if(custo !== 'PLAYING' && custo !== 'STREAMING' && custo !== 'LISTENING' && custo !== 'WATCHING') {
			console.log(new TypeError(`"customGame.type" must be "PLAYING", "STREAMING', "LISTENING" or "WATCHING"! And also must be all uppercase!`));
			process.exit(1);
		}
	}
	startBot();
	
	
	var bot = client;
	
	client.on('message', async message => { // Triggered on a message.
		const msg = message.content.trim();
		const command = msg.substring(music.prefix.length).split(/[ \n]/)[0].toLowerCase().trim();
		const suffix = msg.substring(music.prefix.length + command.length).trim();

		try {
		
			if(msg.toLowerCase().startsWith(music.prefix.toLowerCase())) {
				switch(command) { // I'm copy pasting code. I don't actually understand how this works.
					case music.helpCmd:
						return music.help(message, suffix);
					case music.playCmd:
						return music.play(message, suffix);
					case music.skipCmd:
						return music.skip(message, suffix);
					case music.queueCmd:
						return music.queue(message, suffix);
					case music.stopCmd:
						return music.stop(message, suffix);
					case music.npCmd:
						return music.np(message, suffix);
					case music.pauseCmd:
						return music.pause(message, suffix);
					case music.resumeCmd:
						return music.resume(message, suffix);
					case music.volumeCmd:
						return music.volume(message, suffix);
				}
			}
		} catch (err) {
			message.channel.send(`Discovered an error: \`\`\`xl\n${err.stack}\`\`\``);
			console.error(`Discovered error: ${err.stack}`);
		}
	})
	.on('ready', async () => { // Once the bot is ready, this starts.
		client.player = new PlayerManager(client, music.lavalink.nodes, {
			user: client.user.id,
			shards: music.getShard()
		});
		console.log(`[LavalinkMusic] Running version ${PACKAGE.version}`);
		console.log(`[LavalinkMusic] Running NodeJS ${process.version}`);
		console.log(`[LavalinkMusic] Running Discord.JS ${Discord.version}`);
		console.log(`[LavalinkMusic] Logged in as ${bot.user.tag} (ID ${bot.user.id})`);
		console.log(`[LavalinkMusic] Listening to host ${music.lavalink.restnode.host} and port ${music.lavalink.restnode.port}`);
		console.log(`[LavalinkMusic] Prefix: ${music.prefix}`);
		if(music.customGame.type == 'STREAMING') {
			client.user.setPresence({ game: { name: music.customGame.name, type: 'STREAMING', url: 'https://twitch.tv/monstercat'}});
		} else {
			if(music.customGame.name == '') return;
			client.user.setPresence({ game: music.customGame });
		}
	});

	music.log = (message, type = 'INFO') => {
		type = type.toUpperCase();
		console.log(`[LavalinkMusic:${type}] ${message}`);
	}
	
	music.help = (message, suffix) => {
		// Yes. I use RichEmbed(). This is why Discord.JS v12 isn't supported.
		const embed = new Discord.RichEmbed()
		.setColor("RANDOM")
		.setTitle(`${bot.user.tag} music help`)
		.setDescription(`"${music.prefix}${music.helpCmd}" - Displays this message!
"${music.prefix}${music.playCmd}" - Adds a song to the queue and plays it!
"${music.prefix}${music.skipCmd}" - Skip a song!
"${music.prefix}${music.queueCmd}" - Displays the queue!
"${music.prefix}${music.stopCmd}" - Clears queue and stops the queue.
"${music.prefix}${music.npCmd}" - Check what's playing in the queue!
"${music.prefix}${music.pauseCmd}" - Pauses the queue!
"${music.prefix}${music.resumeCmd}" - Resumes the queue!
"${music.prefix}${music.volumeCmd}" - Change the volume!
		`)
		.setAuthor(`${message.author.tag}`, message.author.avatarURL)
		.setFooter(`Module: discord.js-lavalink-musicbot`)
		message.channel.send(embed);
	}
	
	music.getQueue = (server) => { // Get da queue!
		if(!music.queues[server]) music.queues[server] = [];
		return music.queues[server];
	}
	
	music.play = async (message, suffix) => { // Not willing to add notes here. Lazy.
		const args = message.content.split(' ').slice(music.prefix.split(' ').length);
		if(!args[0]) return message.channel.send('No arguments defined!')

        const player = await bot.player.join({
            guild: message.guild.id,
            channel: message.member.voiceChannelID,
            host: music.getIdealHost(bot, message.guild.region)
        }, { selfdeaf: true });
		if (!player) return message.channel.send("You need to be in a voice channel!")
		
		if(bot.player.get(message.guild.id).paused == true) music.resume(message, suffix);

		if(['https://', 'http://'].some(crx => args.join(' ').includes(crx))) {
			const queue = music.getQueue(message.guild.id);
			await music.getSong(args.join(' '))
			.then(song => {
			if(args.join(' ').includes('&list=')) {
				const urlParams = new URLSearchParams(args.join(' '));
				const myParam = urlParams.get('index');
				
				let cur = urlParams.get('index') || 1;
				const embed = new Discord.RichEmbed()
			.setColor([255, 69, 0])
			.setAuthor(`Play Command`, bot.user.avatarURL)
			.setTitle('Added to queue!')
			.setDescription(`• **Title**: ${song.tracks[cur - 1].info.title}
• **Author**: ${song.tracks[cur - 1].info.author}
• **URL**: [${song.tracks[cur - 1].info.uri}](${song.tracks[cur - 1].info.uri})
• **Length**: ${music.getYTLength(song.tracks[cur - 1].info.length)}
		`).setFooter(`Module: discord.js-lavalink-musicbot`)
			message.channel.send(embed);
				song.tracks.map(cr => {
					if(song.tracks[cur - 1] == undefined || song.tracks[cur] == undefined)
						return;
					queue.push(song.tracks[cur - 1]);
					music.log(`Added track "${song.tracks[cur - 1].info.title}" in server ${message.guild.name}`, 'ADDTRK-PLAYLIST');
					cur++;
				});

			} else {
				queue.push(song.tracks[0]);
				const embed = new Discord.RichEmbed()
				.setColor([255, 69, 0])
				.setAuthor(`Play Command`, bot.user.avatarURL)
				.setTitle('Added to queue!')
				.setDescription(`• **Title**: ${song.tracks[0].info.title}
	• **Author**: ${song.tracks[0].info.author}
	• **URL**: [${song.tracks[0].info.uri}](${song.tracks[0].info.uri})
	• **Length**: ${music.getYTLength(song.tracks[0].info.length)}
			`).setFooter(`Module: discord.js-lavalink-musicbot`)
				message.channel.send(embed);
				music.log(`Added track "${song.tracks[0].info.title}" in server ${message.guild.name}`, 'ADDTRK');
			}

			if(queue[0].track !== currentTrack) music.execQueue(message, queue, player);
		});
		} else {
			const queue = music.getQueue(message.guild.id);
			const song = await music.getSong(`ytsearch:${args.join(' ')}`);
			queue.push(song.tracks[0]);
			const embed = new Discord.RichEmbed()
			.setColor([255, 69, 0])
			.setAuthor(`Play Command`, bot.user.avatarURL)
			.setTitle('Added to queue!')
			.setDescription(`• **Title**: ${song.tracks[0].info.title}
• **Author**: ${song.tracks[0].info.author}
• **URL**: [${song.tracks[0].info.uri}](${song.tracks[0].info.uri})
• **Length**: ${music.getYTLength(song.tracks[0].info.length)}
			`).setFooter(`Module: discord.js-lavalink-musicbot`)
			message.channel.send(embed);
			music.log(`Added track "${song.tracks[0].info.title}" in server ${message.guild.name}`, 'ADDTRK');
			if(queue.length === 1) music.execQueue(message, queue, player);
		}
	}
	
	music.getRegion = (bot, region) => {// This is not my code.
		region = region.replace("vip-", "");
		for (const key in defaultRegions) {
			const nodes = bot.player.nodes.filter(node => node.connected && node.region === key);
			if (!nodes) continue;
			for (const id of defaultRegions[key]) {
				if (id === region || region.startsWith(id) || region.includes(id)) return key;
			}
		}
		return "asia";
	}
	
	music.getIdealHost = (bot, region) => {// This is not my code.
		region = music.getRegion(bot, region);
		const foundNode = bot.player.nodes.find(node => node.ready && node.region === region);
		if (foundNode) return foundNode.host;
		return bot.player.nodes.first().host;
	}
	
	music.getSong = async (string) => {
		// This is not my code.
		const res = await snekfetch.get(`http://${music.lavalink.restnode.host}:${music.lavalink.restnode.port}/loadtracks`)
			.query({ identifier: string })
			.set("Authorization", music.lavalink.restnode.password)
			.catch(err => {
				console.error(err);
				return null;
			});
		if (!res) return "User doesn't exist!";

		return res.body;
	}
	
	music.execQueue = async (message, queue, player, type = 0) => {
		//console.log(queue[0]);
		if(queue[0] == undefined) {
			message.channel.send(`Queue seems to be empty... Weird. Time to leave the VC!`);
			await bot.player.leave(message.guild.id);
			currentTrack = null;
		} else {
		player.play(queue[0].track); // Plays the first item in the queue.
		const embed = new Discord.RichEmbed()
				.setColor([255, 69, 0])
				.setAuthor(`Music`, bot.user.avatarURL)
				.setTitle('Now playing new song!')
				.setDescription(`• **Title**: ${queue[0].info.title}
• **Author**: ${queue[0].info.author}
• **URL**: [${queue[0].info.uri}](${queue[0].info.uri})
• **Length**: ${music.getYTLength(queue[0].info.length)}
				`).setFooter(`Module: discord.js-lavalink-musicbot`)
		message.channel.send(embed);
		currentTrack = queue[0].track;

		player.once("end", async data => {
			if(queue.length > 0) { // So, if there's more than one item in the queue, play the new item.
				setTimeout(() => {
					queue.shift(); // Switch songs.
					music.execQueue(message, queue, player);
				}, 1000) // Wait a second.	
			} else { // If not, just stop the queue and leave.
				queue.shift(); 
				message.channel.send(`Queue is now empty! Leaving voice channel...`)
				await bot.player.leave(message.guild.id);
				currentTrack = null;
			}
		});
	}
		}
	music.getYTLength = (millisec) => {
    // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
		var seconds = (millisec / 1000).toFixed(0);
		var minutes = Math.floor(seconds / 60);
		var hours = "";
		if (minutes > 59) {
			hours = Math.floor(minutes / 60);
			hours = (hours >= 10) ? hours : "0" + hours;
			minutes = minutes - (hours * 60);
			minutes = (minutes >= 10) ? minutes : "0" + minutes;
		}
		// Normally I'd give notes here, but I actually don't understand how this code works.
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		if (hours != "") {
			return hours + ":" + minutes + ":" + seconds;
		}
		return minutes + ":" + seconds;
	}
	
	music.getShard = () => { // This should supposedly return the shard.
		let shardin = Math.floor(clientOriginal.guilds.size / 2500);
		if(!shardin || shardin == null || shardin == 0)
			shardin = 1;
		
		return shardin;
	}
	
	music.np = async (message, suffix) => {
		try {
			const player = bot.player.get(message.guild.id);
			if(!player) // This actually isn't how you do it. I don't know the proper way, don't judge me.
				return message.channel.send("Currently not playing anything.")


			const queue = music.getQueue(message.guild.id);
			
			const embed = new Discord.RichEmbed()
				.setAuthor(`Music - Now Playing`, bot.user.avatarURL)
				.setColor([255, 69, 0])
				.setDescription(`• **Title**: ${queue[0].info.title}
• **Author**: ${queue[0].info.author}
• **URL**: [${queue[0].info.uri}](${queue[0].info.uri})
• **Length**: ${music.getYTLength(queue[0].info.length)}
				`).setFooter(`Module: discord.js-lavalink-musicbot`)
		message.channel.send(embed);
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``)
		}
	}

	music.pause = (message, suffix) => {
		try {
			const player = bot.player.get(message.guild.id);
			if(!bot.player.get(message.guild.id))
				return message.channel.send(`No music is being played in this guild.`)
			player.pause(true);
			message.channel.send(`Paused the player!`);
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``)
		}
	}

	music.resume = (message, suffix) => {
		try {
			const player = bot.player.get(message.guild.id);
			if(!bot.player.get(message.guild.id))
				return message.channel.send(`No music is being played in this guild.`)
			player.pause(false);
			message.channel.send(`Resumed the player!`);
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``)
		}
	}

	music.stop = (message, suffix) => {
		try {
			const queue = music.getQueue(message.guild.id);
			const player = bot.player.get(message.guild.id);
			if(!player)
				return message.channel.send(`No music is playing in this guild!`);
			
			queue.splice(0, queue.length);
			bot.player.leave(message.guild.id);

			message.channel.send(`Left the voice channel.`);

		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``)
		}
	}

	music.queue = (message, suffix) => {
		const queue = music.getQueue(message.guild.id);
		if(!bot.player.get(message.guild.id))
			return message.channel.send(`No music is being played in this guild.`)
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.info.title + ` (**${music.getYTLength(video.info.length)}**)`
		)).join('\n');
		message.channel.send('Queue:\n' + text)
	}

	music.skip = (message, suffix) => {
		try {
			const args = parseInt(message.content.split(' ').slice(1)[0]);
			const player = bot.player.get(message.guild.id);
			if(!player)
				return message.channel.send(`No music playing!`);
			const queue = music.getQueue(message.guild.id);
			let sum = 1;

			if(args && !isNaN(args))
				sum = args;

			sum = Math.min(sum, queue.length);

			queue.splice(0, sum);

			message.channel.send(`Skipped ${sum} songs!`);
			if(player.paused)
				player.resume();
			//player.emit('end', message);
			player.stop();
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``);
		}
	}

	music.volume = async (message, suffix) => {
		try {
			const args = message.content.split(' ').slice(1)[0];
			const player = bot.player.get(message.guild.id);
			if(!player)
				return message.channel.send("No music playing!");

			if(isNaN(args))
				return message.channel.send(`Volume specified is not a number!`);

			const volume = parseInt(args);
			if(volume < 0 || volume > 100) 
				return message.channel.send(`Volume can't be below 0 or above 100!`);

			player.volume(volume);

			message.channel.send(`Set the volume to ${volume}!`);
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``);
		}
	}
}