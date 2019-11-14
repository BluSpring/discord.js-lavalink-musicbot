/*
	This is the Lavalink version of nexu-dev and DarkoPendragon's discord.js-musicbot-addon!
	Get Lavalink here: https://ci.fredboat.com/viewLog.html?buildId=lastSuccessful&buildTypeId=Lavalink_Build&tab=artifacts&guest=1
	
	Lavalink has also been included in this module's folder along with its settings.
	
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
const axios = require('axios');
try {
	if(!Discord.RichEmbed && Discord.version.split('.')[0] == '12')
		Discord.RichEmbed = Discord.MessageEmbed;
} catch(err) {}

const defaultRegions = {
    asia: ["sydney", "singapore", "japan", "hongkong"],
    eu: ["london", "frankfurt", "amsterdam", "russia", "eu-central", "eu-west"],
    us: ["us-central", "us-west", "us-east", "us-south", "brazil"]
};

//let currentTrack = {}; // wtf did I even use this for

module.exports = function (client, options) {
	class LavalinkMusic { // Construct everything?
		constructor(clientt, options) {
			this.prefix = (options && options.prefix) || '!';
			this.queues = {};
			this.loops = {};
			this.admins = (options && options.admins) || [];
			this.lavalink = (options && options.lavalink) || {
				restnode: {
					host: "localhost",
					port: 8643,
					password: "youshallnotpass"
				},
				nodes: [
					{ host: "localhost", port: 8643, region: "asia", password: "youshallnotpass" }
				]
			};
			this.package = PACKAGE;

			clientt.player = null;
			//this.token = (options && options.token);

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
			this.seekCmd = (options && options.seekCmd) || 'seek'; // I seek a person.
			this.loopCmd = (options && options.loopCmd) || 'loop'; // Loops. I'm out of terrible puns.
			// Sorry for the puns btw


			this.customGame = (options && options.customGame && options.customGame.type.toUpperCase()) || { name: '', type: 'PLAYING' };
			this.logging = (options && options.logging) || false;
			//this.runLavalink = (options && options.runLavalink) || false;
		}
		
	}
	
	var music = new LavalinkMusic(client, options);
	var musicbot = music;
	
	/*class MusicClient extends Discord.Client { // Music client setup, sidenote this isn't my code once again.

		constructor(options) {
			super(options);

			this.player = null;

		}

	}*/

	process.on('unhandledRejection', (reason) => {
		console.error(`[discord.js-lavalink-musicbot] Caught unhandled rejection: ${reason.stack}\nIf this is causing issues, head to the support server at https://discord.gg/dNN4azK`);
	});

	process.on('uncaughtException', (err) => {
		console.error(`[discord.js-lavalink-musicbot] Uncaught Exception - ${err.stack}\n\nIf this is causing issues, head to the support server at https://discord.gg/dNN4azK`);
	});
	
	//var client = new MusicClient();
	//client.login(music.token); // Relogin the bot just for the Lavalink thing.

	async function returnErr(objName, objType) {
		// Since I was getting lazy, I decided to make this.
		console.log(new TypeError(`"${objName}" must be equivalent to type "${objType}"`));
		process.exit(1);
	}

	let isLavalinkDone = false;
	
	async function startBot() { // Start the damn bot.
		if (process.version.slice(1)
	    .split('.')[0] < 8) {
			console.log(new Error(`[LavalinkMusicBot] Node v8 or higher is required, please update!`));
			process.exit(1);
		}
		
		/*if(Discord.version.split('.')[0] > 12) {
			console.log(new Error(`[LavalinkMusicBot] Discord.JS version 12 and above is currently unsupported! Please use an older version!`));
			process.exit(1);
		}*/
	
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

		if(typeof music.loopCmd !== 'string') {
			returnErr('loopCmd', 'string');
		}

		if(typeof music.seekCmd !== 'string') {
			returnErr('seekCmd', 'string');
		}
		
		
		if(typeof music.lavalink !== 'object') {
			console.log(new TypeError(`"lavalink" options must be an object!`));
			process.exit(1);
		}
		
		if(!music.lavalink.restnode || music.lavalink.nodes.length == 0) {
			console.log(new TypeError(`You seem to be missing restnode or a node.`));
			process.exit(1);
		}

		/*if(!music.token) {
			console.log(new TypeError('You require to add the token!'));
			process.exit(1);
		}*/

		if(typeof music.customGame !== 'object') {
			returnErr('customGame', 'object');
		}

		if(typeof music.customGame.name !== 'string') {
			returnErr('customGame.name', 'string');
		}

		if(typeof music.customGame.type !== 'string') {
			returnErr('customGame.type', 'string');
		}

		/*const custo = music.customGame.type;
		if(custo !== 'PLAYING' && custo !== 'STREAMING' && custo !== 'LISTENING' && custo !== 'WATCHING') {
			console.log(new TypeError(`"customGame.type" must be "PLAYING", "STREAMING', "LISTENING" or "WATCHING"! And also must be all uppercase!`));
			process.exit(1);
	}*//*
		if(typeof music.runLavalink !== 'boolean') {
			returnErr('music.runLavalink', 'boolean');
		}
		
		if(music.runLavalink) {
			const child_process = require('child_process');
			console.log(`[Lavalink] Starting Lavalink...`);
			const lavalink = child_process.spawn(`java`,['-jar','Lavalink/Lavalink.jar', '-Xmx512M']); /*(err, stdout, stderr) => {
				if(err)
					console.error(`[Lavalink] Error creating Lavalink child process! ${err.stack}\Head to the support server at https://discord.gg/dNN4azK for assistance!`) && process.exit(1);

				if(stderr)
					console.error(`[Lavalink] Received Lavalink stderr - ${stderr}\Head to the support server at https://discord.gg/dNN4azK for assistance if this is causing issues!`);

				console.log(`[Lavalink] Lavalink started!`);
				isLavalinkDone = true;
			});*//*

			lavalink.on('message', (data) => {
				console.log(`[Lavalink] ${data}`);
				isLavalinkDone = true;
			});
			lavalink.stdout.on('data', (data) => {
				//console.log(`[Lavalink stdout] ${data}`);
				if(data.includes('Started Launcher in') && !client.player) {
					isLavalinkDone = true;
					client.player = new PlayerManager(client, music.lavalink.nodes, {
						user: client.user.id,
						shards: (client.shard && client.shard.count) || 1
					});
					console.log(`[Lavalink] Finished loading!`);
				}
			});
		}*/
	}
	startBot();
	
	
	var bot = client;
	
	client.on('message', async message => { // Triggered on a message.
		const msg = message.content.trim();
		const command = msg.substring(music.prefix.length).split(/[ \n]/)[0].toLowerCase().trim();
		const suffix = msg.substring(music.prefix.length + command.length).trim().split(' ');

		try {
			if(msg.toLowerCase().startsWith(music.prefix.toLowerCase())) {
				switch(command) { // I'm copy pasting code. I don't actually understand how this works.
					// A year or two later, nevermind, I understand now.
					// It's basically a shorter if...else statement kinda thing.
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
					case music.seekCmd:
						return music.seek(message, suffix);
					case music.loopCmd:
						return music.loop(message, suffix);
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
			shards: (client.shard && client.shard.count) || 1
		});
		console.log(`[LavalinkMusic] Running discord.js-lavalink-musicbot v${PACKAGE.version}`);
		console.log(`[LavalinkMusic] Running NodeJS ${process.version}`);
		console.log(`[LavalinkMusic] Running Discord.JS v${Discord.version}`);
		console.log(`[LavalinkMusic] Logged in as ${bot.user.tag} (ID ${bot.user.id})`);
		console.log(`[LavalinkMusic] Listening to REST node host ${music.lavalink.restnode.host} and port ${music.lavalink.restnode.port}`);
		console.log(`[LavalinkMusic] Prefix: ${music.prefix}`);
		if(music.customGame.type == 'STREAMING') {
			client.user.setPresence({ activity: { name: music.customGame.name, type: 'STREAMING', url: 'https://twitch.tv/monstercat'}});
		} else {
			if(music.customGame.name == '') return;
			client.user.setPresence({ activity: music.customGame });
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
"${music.prefix}${music.loopCmd}" - Loops the queue!
"${music.prefix}${music.seekCmd}" - Seeks through the queue!
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
		/*const args = message.content.split(' ').slice(music.prefix.split(' ').length);
		if(!args[0]) return message.channel.send('No arguments defined!')

        const player = await bot.player.join({
            guild: message.guild.id,
            channel: message.member.voiceChannelID,
            host: music.getIdealHost(bot, message.guild.region)
        }, { selfdeaf: true });
		if (!player) return message.channel.send("You need to be in a voice channel!")
		
		const queue = music.getQueue(message.guild.id);
		if(bot.player.get(message.guild.id).paused == true) music.resume(message, suffix);

		if(['https://', 'http://'].some(crx => args.join(' ').includes(crx))) {
			await music.getSong(args.join(' '))
			.then(song => {
			if(args.join(' ').includes('&list=')) {
				const urlParams = new URLSearchParams(args.join(' '));
				const myParam = urlParams.get('index');
				
				let cur = urlParams.get('index') || 0;
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
				song.tracks.map(cr => {
					if(song.tracks[cur - 1] == undefined && song.tracks[0] == undefined)
						return;
					queue.push(song.tracks[0]);
					music.log(`Added track "${song.tracks[0].info.title}" in server ${message.guild.name}`, 'ADDTRK-PLAYLIST');
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

			//console.log(queue);
			if(queue[0].track !== currentTrack[message.guild.id]) music.execQueue(message, queue, player);
		})
		.catch(err => {
			console.error(err.stack);
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
		}*/
		const msg = message;
		const betterArgs = suffix.join(' ').trim();
		let canPlay = false;
		await message.channel.send(`Hold on...`);
		if(bot.player.get(message.guild.id) && bot.player.get(message.guild.id).paused) music.resume(message, suffix);
		if (!msg.member.voiceChannelID)
			return message.channel.send(`You're not in a voice channel!`);

		if (bot.player.get(message.guild.id) && msg.member.voiceChannelID !== bot.player.get(message.guild.id).channel)
			return message.channel.send(`You're not in the playing voice channel!`);

		if (!betterArgs && !bot.player.get(message.guild.id))
			return message.channel.send(`You didn't give anything to play!`);

		var queue = music.getQueue(message.guild.id);
		var track = await music.getSong(betterArgs.startsWith(`http`) ? betterArgs : `ytsearch:${betterArgs}`);
		if (track instanceof Error)
			return message.channel.send(`Track search failed with error \n\`\`\`xl\n${track.toString()}\n\`\`\``);
		const urlParams = new URLSearchParams(suffix.join(' '));
		const myParam = parseInt(urlParams.get('index'));
		if (!track[0]) return message.channel.send(`No results found.`);
		if (!queue[0]) canPlay = true;
		if (urlParams.get('list') && myParam) {
			track = track.splice(myParam - 1, track.length);
			track.forEach((cr) => {
				queue.push(cr);
			});
		} else if (urlParams.get('list')) {
			track.forEach((cr) => {
				queue.push(cr);
			});
		} else {
			queue.push(track[0]);
		}

		message.channel.send(`:musical_note: Added ${urlParams.get('list') ? "playlist" : "song"} to queue!`, new Discord.RichEmbed()
			.setColor("RED")
			.setTitle(track[0].info.title)
			.setThumbnail(`https://i.ytimg.com/vi/${track[0].info.identifier}/hqdefault.jpg`)
			.setDescription(`
• **Author**: ${track[0].info.author}
• **URL**: [${track[0].info.uri}](${track[0].info.uri})
• **Length**: ${music.getYTLength(track[0].info.length)}
		`));

		if (canPlay) {
			var theHost = music.getIdealHost(bot, message.guild.region);
			const player = await bot.player.join({
				guild: message.guild.id,
				channel: message.member.voiceChannelID,
				host: theHost
			});
			bot.player.get(message.guild.id).node = bot.player.nodes.get(theHost);
			music.execQueue(message, queue, player);
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
		/*return new Promise(async (resolve, reject) => {
			const res = await axios.get(`http://${music.lavalink.restnode.host}:${music.lavalink.restnode.port}/loadtracks?identifier=${string}`, {headers: {Authorization: music.lavalink.restnode.password}})
			.catch(err => {
				console.error(err.stack);
				reject(null);
			});
			if (!res.data) reject("User doesn't exist!");

			//console.log(res.data);

			resolve(res.data);
		});*/

		// THIS is my code
		// See I learned, are you proud of me?
		return new Promise(async(resolve, rej) => {
			try {
				const res = await axios.get(`${music.lavalink.restnode.address ? music.lavalink.restnode.address : `https://${music.lavalink.restnode.host}:${music.lavalink.restnode.port}`}/loadtracks?identifier=${encodeURIComponent(string)}`, {
					headers: {
						Authorization: music.lavalink.restnode.password
					}
				});
				resolve(res.data.tracks);
			} catch (e) {
				//message.channel.send(`Track not found.`);
				resolve(e); // I know this makes no sense shush
			}
		});
	}
	
	music.execQueue = async (message, queue, player) => {

		// This is old af

		//console.log(queue[0]);
		/*if(queue[0] == undefined) {
			message.channel.send(`Queue seems to be empty... Weird. Time to leave the VC!`);
			await bot.player.leave(message.guild.id);
			delete currentTrack[message.guild.id];
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
		currentTrack[message.guild.id] = queue[0].track;

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
					delete currentTrack[message.guild.id];
				}
			});
		}*/

		// Here's some better code :D

		player.play(queue[0].track);
		message.channel.send(`Now playing **${queue[0].info.title}**`);
		  
		player.once('end', async () => {
			if(!music.loops[message.guild.id] || music.loops[message.guild.id] == 0)
				queue.shift();
			else if(music.loops[message.guild.id] == 2) {
				queue.push(queue[0]);
				queue.shift();
			}
			if(queue.length > 0) {
				setTimeout(() => {
					music.execQueue(message, queue, player);
				}, 1000);
			} else {
				message.channel.send(`Queue is now empty! Leaving the voice channel.`);
				await client.player.leave(message.guild.id);
				delete music.queues[message.guild.id];
				if(music.loops[message.guild.id])
					delete music.loops[message.guild.id];
			}
		});
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
	

	// Looking back, why the fuck did I use this
	/*music.getShard = () => { // This should supposedly return the shard.
		let shardin = Math.floor(client.guilds.size / 1000);
		if(!shardin || shardin == null || shardin == 0)
			shardin = 1;
		
		music.log(`Detected ${shardin} shards`);
		return shardin;
	}*/
	
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
				`);
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
			/*const args = parseInt(message.content.split(' ').slice(1)[0]);
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
			player.stop();*/

			const msg = message;
			if(!msg.member.voiceChannelID)
				return message.channel.send(`You're not in a voice channel!`);

			if(bot.player.get(message.guild.id) && msg.member.voiceChannelID !== bot.player.get(message.guild.id).channel)
				return message.channel.send(`You're not in the playing voice channel!`);
			var queue = music.getQueue(message.guild.id);
			if(!queue || queue.length == 0)
				return message.channel.send(`No music is playing!`);
			let howMany = 1;
			if(suffix[0])
				howMany = Math.min(parseInt(suffix[0]), queue.length);

			queue.splice(0, howMany - 1);
			message.channel.send(`Skipped ${howMany} songs.`);
			client.player.get(message.guild.id).stop();
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``);
		}
	}

	music.volume = async (message, suffix) => {
		try {
			const player = bot.player.get(message.guild.id);
			if(!player)
				return message.channel.send("No music playing!");

			/*if(isNaN(args))
				return message.channel.send(`Volume specified is not a number!`);*/

			const volume = parseInt(suffix[0]) || 50;
			if(volume < 0 || volume > 100) // Limit the volume cuz fucking hell volume can be high
				return message.channel.send(`Volume can't be below 0 or above 100!`);

			player.volume(volume);

			message.channel.send(`Set the volume to ${volume}!`);
		} catch (err) {
			message.channel.send(`Error executing this command! \`\`\`xl\n${err.stack}\n\`\`\``);
		}
	}

	music.loop = async (message, args) => {
		if(!bot.player.get(message.guild.id))
			return message.channel.send(`Currently not playing anything!`);

		if(!music.loops[message.guild.id])
			music.loops[message.guild.id] = 0;

		var ms = music.loops[message.guild.id]

		if(!args[0]) {
			if(ms == 0) {
				message.channel.send(`Arguments not found. Looping one song only :repeat_one:\n\n**Note**: \`0/off\` is to turn off loop, \`1/one\` is to loop one song, \`2/multi/all\` is to loop the whole queue.`);
				ms = 1;
			} else {
				message.channel.send(`Arguments not found. Loop disabled.\n\n**Note**: \`0/off\` is to turn off loop, \`1/one\` is to loop one song, \`2/multi/all\` is to loop the whole queue.`);
				ms = 0;
			}
		} else {
			var ar = args[0].toLowerCase();
			if(ar == '0' || ar == 'off') {
				ms = 0;
				message.channel.send(`Loop disabled.`);
			} else if(ar == '1' || ar == 'one') {
				ms = 1;
				message.channel.send(`Loop set to one song. :repeat_one:`);
			} else if(ar == '2' || ar == 'multi' || ar == 'all') {
				ms = 2;
				message.channel.send(`Loop set to multiple songs. :repeat:`);
			} else {
				message.channel.send(`Invalid loop type. \n\`0/off\` is to turn off loop, \`1/one\` is to loop one song, \`2/multi/all\` is to loop the whole queue.`);
			}
		}
	}

	music.seek = async (message, args) => {
		// Thanks to TheChicken14 for the loop code!
		var queue = music.getQueue(message.guild.id);
		if(!queue || queue.length == 0)
			return message.channel.send(`No music is playing!`);
		
		if(!message.member.voiceChannelID)
			return message.channel.send(`You're not in a voice channel!`);
	
		if(client.player.get(message.guild.id) && message.member.voiceChannelID !== client.player.get(message.guild.id).channel)
			return message.channel.send(`You're not in the playing voice channel!`);
		
		var pos = args[0] * 1000;
		if(!pos || pos.length < 1)
			return message.channel.send(`You must define a position in seconds.`);
		
		message.channel.send(`Position set to ${music.getYTLength(pos)}`);
		client.player.get(message.guild.id).seek(pos);
	}
}