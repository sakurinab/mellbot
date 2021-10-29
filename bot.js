// ______    ______      _     _     _ _     ______       _        
// |  _  \   | ___ \    | |   | |   (_| |    | ___ \     | |       
// | | | |___| |_/ /__ _| |__ | |__  _| |_   | |_/ / ___ | |_      
// | | | / _ |    // _` | '_ \| '_ \| | __|  | ___ \/ _ \| __|     
// | |/ |  __| |\ | (_| | |_) | |_) | | |_   | |_/ | (_) | |_      
// |___/ \___\_| \_\__,_|_.__/|_.__/|_|\__|  \____/ \___/ \__|     
//  _              _   __     _     _              _               
// | |            | | / /    (_)   | |            | |              
// | |__  _   _   | |/ / _ __ _ ___| |_ ___  _ __ | |__   ___ _ __ 
// | '_ \| | | |  |    \| '__| / __| __/ _ \| '_ \| '_ \ / _ | '__|
// | |_) | |_| |  | |\  | |  | \__ | || (_) | |_) | | | |  __| |   
// |_.__/ \__, |  \_| \_|_|  |_|___/\__\___/| .__/|_| |_|\___|_|   
//         __/ |                            | |                    
//        |___/                             |_|                    
//          __         ____       _____                            
//         /  |       / ___|     |  _  |                           
// __   __ `| |      / /___      | |_| |                           
// \ \ / /  | |      | ___ \     \____ |                           
//  \ V /  _| |_  _  | \_/ |  _  .___/ /                           
//   \_/   \___/ (_) \_____/ (_) \____/                            
//
//
const Discord = require('discord.js');
const bot = new Discord.Client();
const disbut = require('discord-buttons');
disbut(bot);

bot.commands = new Discord.Collection();
const mongoose = require('mongoose');
const fs = require('fs');
const helloWords = ["welcome", "добро пожаловать", "welc", "приветствую", "привет", "хай", "хааай", "хаай", "приветик", "ласкаво просимо"];
const repWords = ["welcome", "добро пожаловать", "welc", "приветствую", "привет", "хай", "хааай", "хаай", "приветик", "ласкаво просимо", "красиво", "ты молодец", "красивая", "красивый", "прекрасный", "прекрасная", "хороший", "хорошая", "классно", "круто", "крутой", "крутая", "крутышка", "+реп", "+ реп", "+ репутация", "+репутация", "плюс реп", "плюс репутация", ":)", "♥", ")", "))", ")))"];
const minusRepWorld = ["хуй", "пизда", "залупа", "уебан", "уёбок", "уебок", "хуесос", "блядина", "пиздолиз", "пошёл нахуй", "пошёл на хуй", "нахуй пошёл", "чурка", "мать ебал", "мать твою ебал", "ебал мать", "чё с хуя", "че с хуя", "псина ебаная", "псина ёбаная"];
const config = require("./botconfig.json");
const token = config.token;
const prefix = config.prefix;
//mongoose
//подключение моделей
const profileModel = require('./schemas/profileSchema.js');
const pvcModel = require('./schemas/pvcSchema.js');
const dailyModel = require('./schemas/dailySchema.js');
const vctimeModel = require('./schemas/vctimeSchema.js');
const rbModel = require('./schemas/rbSchema.js');
const loveroomModel = require('./schemas/loveroomSchema.js');
const clanModel = require('./schemas/clanSchema.js');
const botUptime = require('./schemas/uptime.js');
const actionModel = require('./schemas/actionSchema.js');
const roleModel = require('./schemas/rolesSchema.js');
//Цены
const prCost = 60;
//Кланы
const xplvlmult = 4320;
//Роли на реакции
//Типы:
//      0 - добавлять и убирать
//      1 - только добавлять
//      2 - только удалять
const reactrole = [{
        emoji: "🌟",
        roleID: "836158848757923871",
        channelID: "836828078256816129",
        messageID: "836936657709170728",
        type: 0,
        single: 1,
    },
    {
        emoji: "♂",
        roleID: "835508069575426048",
        channelID: "836828078256816129",
        messageID: "836938921115516969",
        type: 0,
        single: 1,
    },
    {
        emoji: "♀",
        roleID: "835508077671088138",
        channelID: "836828078256816129",
        messageID: "836938921115516969",
        type: 0,
        single: 0,
    }
];

//подключение манго
mongoose.connect(config.mongodb_srv, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.info('---MONGO---');
	console.info('Connected to the database!');
	console.info('---MONGO---');
}).catch((err) => {
	console.warn('---MONGO-ERROR---');
	console.warn(err);
	console.warn('---MONGO-ERROR---');
})

//чтение команд и их загрузка
fs.readdir('./cmds/', (err, files) => {
	if (err) console.log(err);
	let jsfiles = files.filter(f => f.split(".").pop() === "js")
	if (jsfiles.length <= 0) console.log("нет команд для загрузки!");
	console.log(`загружено ${jsfiles.length} команд`);
	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i+1}. ${f} загружен!`);
		bot.commands.set(props.help.name, props);
		bot.commands.set(props.help.alias, props);
	})
})

//запуск бота
bot.on('ready', async () => {
	try {
		const channels = bot.channels.cache.filter(c => c.type === 'voice');

		bot.generateInvite(["ADMINISTRATOR"]).then(link => {
			console.log(link);
		})
		console.log(`Запустился бот ${bot.user.username}\n\n`);
		console.info(' ______   _______  ______    _______  _______  _______  ___   _______       ');
		console.info('|      | |       ||    _ |  |   _   ||  _    ||  _    ||   | |       |      ');
		console.info('|  _    ||    ___||   | ||  |  |_|  || |_|   || |_|   ||   | |_     _|      ');
		console.info('| | |   ||   |___ |   |_||_ |       ||       ||       ||   |   |   |        ');
		console.info('| |_|   ||    ___||    __  ||       ||  _   | |  _   | |   |   |   |   ___  ');
		console.info('|       ||   |___ |   |  | ||   _   || |_|   || |_|   ||   |   |   |  |   | ');
		console.info('|______| |_______||___|  |_||__| |__||_______||_______||___|   |___|  |___| ');
		bot.user.setPresence({
			status: "online",
			activity: {
				name: "Metanora🪐",
				type: "LISTENING"
			}
		});

		await actionModel.updateMany({ inAction: { $gt: 0 } }, { $set: {inAction: 0} });

		uptimeData = await botUptime.findOne({
			name: 'Silent_bot'
		});
		if (!uptimeData) {
			let newUptime = await botUptime.create({
				name: 'Silent_bot',
				uptime: 0,
			});
			//сохранение записи
			newUptime.save();
		}

		//цикл раз в секунду
		setInterval(async function() {
			try {
				//снимать роль РБ, если время наказания прошло
				let memberList = bot.guilds.cache.get(config.serverId).roles.cache.get(config.rbRole).members.map(m => m);

				memberList.forEach(async user => {
					try {
						rbData = await rbModel.findOne({
							userID: user.id,
						});
						if (rbData) {
							let reason = rbData.reason;
							let unrbEmd = new Discord.MessageEmbed()
								.setColor(`${config.defaultColor}`)
								.setTitle("⸝⸝ ♡₊˚ Наказания◞")
								.setFooter(`${user.user.tag}`, `${user.user.displayAvatarURL({dynamic: true})}`)
								.setDescription(`С ${user} было снято наказание за ` + "`" + reason + "`")
								.setTimestamp();

							let userTimeout = rbData.timeout;
							let userGetRb = rbData.rbGet;
							if (Date.now() > (userGetRb + userTimeout)) {
								user.roles.remove(config.rbRole);
								bot.channels.cache.get(config.floodChannel).send(unrbEmd);
							}
						}
					} catch (err) {
						console.log(err);
					}
				});

				for (const [channelID, channel] of channels) {
					for (const [memberID, member] of channel.members) {
						let uid = memberID;
						if (!member.user.bot) {
							//чек есть ли профиль войс актива
							vctimeData = await vctimeModel.findOne({
								userID: member.id
							});
							//создание профиля войс актива
							if (!vctimeData) {
								let vctime = await vctimeModel.create({
									userID: uid,
									vctime: 0,
								});
								//сохранение записи
								vctime.save();
							}

							//добавление 1 секунды в профиль войс актива
							vctimeResponse = await vctimeModel.updateOne({
								userID: uid,
							}, {
								$inc: {
									vctime: 1,
								}
							});
						}
					}
				}

				// const category = await bot.channels.cache.get(config.createChannelCategory);
				// category.children.forEach(channel => {
				//  if (channel.members.size <= 0 && channel.id != config.createChannelId) {
				//      channel.delete()
				//  }
				// });

			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		}, 1000);
		const guild = bot.guilds.cache.get('846742457571213313');
		setInterval(() => {
			const memberCount = guild.memberCount;
			const channel = guild.channels.cache.get('870669821342285864')
			channel.setName(`Member: ${memberCount.toLocaleString()}`)
		}, 5000);
		//выдача подарков юзерам
		setInterval(async function() {
			let usersInVoiceChannels = [];
			for (const [channelID, channel] of channels) {
				for (const [memberID, member] of channel.members) {
					if (!member.user.bot) usersInVoiceChannels.push(member.id);
				}
			}
			if (usersInVoiceChannels.length > 0) {
				let randomUserId = usersInVoiceChannels[Math.floor(Math.random() * usersInVoiceChannels.length)];
				let randCoins = Math.floor(Math.random() * 170) + 30;

				let giftEmbed = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Вам подарок. У Вас есть 2 минуты, чтобы забрать его.**\n**Нажмите на 🎁, чтобы забрать его.**`)
					.setColor(3092790)
					.setTimestamp();

				let giftEmbedSuccess = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Вы забрали свой подарок!**\n**Получено:** ${randCoins} ${config.silverCoin}`)
					.setColor(3092790)
					.setTimestamp();

				let giftEmbedCancel = new Discord.MessageEmbed()
					.setTitle(`♡𓂃˚ Подарок◞`)
					.setDescription(`**Подарок не забрали.**`)
					.setColor(3092790)
					.setTimestamp();

				const msg = await bot.channels.cache.find(ch => ch.id == config.mainChannel).send(`<@${randomUserId}>`, giftEmbed);
				await msg.react("🎁");
				await msg.awaitReactions((reaction, user) => user.id == randomUserId && (reaction.emoji.name == "🎁"), {
						max: 1,
						time: 120000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "🎁") {

							msg.reactions.removeAll();

							profileData = await profileModel.updateOne({
								userID: randomUserId,
							}, {
								$inc: {
									silverCoins: randCoins,
								}
							});

							msg.edit(giftEmbedSuccess);

							return;
						} else {
							return console.log("Ошибка реакции");
						}
					}).catch(async err => {
						msg.edit(giftEmbedCancel);
						msg.reactions.removeAll();
						return;
					});
			}
		}, 1000 * 60 * 30 * (Math.floor(Math.random() * 3) + 1));
		//цикл, который срабатывает раз в минуту
		setInterval(async function() {
			try {
				for (const [channelID, channel] of channels) {
					for (const [memberID, member] of channel.members) {
						let uid = memberID;
						//создание нового документа в базе данных манго, если юзер не является ботом
						if (!member.user.bot) {
							//чек есть ли профиль
							profileData = await profileModel.findOne({
								userID: uid,
							});
							//создание основного профиля
							if (!profileData) {
								let profile = await profileModel.create({
									userID: uid,
									silverCoins: 200,
									goldCoins: 0,
									xp: 0,
									lvl: 1,
									msgs: 0,
									msgsForCoinGet: 0,
									reputation: 0,
									clan: "Нет",
									marriage: "Нет",
									profileStatus: config.defaultPStatus,
									profileBanner: config.defaultPBanner,
									profileLine: config.defaultPLine,
									achievements: " ",
								});
								//сохранение записи
								profile.save();
							}

							//добавить минуту в uptime
							uptimeData = await botUptime.updateOne({
								name: 'Silent_bot'
							}, {
								$inc: {
									uptime: 60000,
								}
							});

							silCoinsRes = await profileModel.updateOne({
								userID: uid,
							}, {
								$inc: {
									silverCoins: 3,
								}
							});



							//добавление серебра, ХР и репутации, если человек находится в войсе
							let userClan = profileData.clan;
							let clanCoinBoost = 1;
							let clanLvlBoost = 1;
							if (!(userClan == "" || userClan == " " || userClan == null || userClan == "Нет")) {
								clanData = await clanModel.findOne({
									name: userClan
								});
								if (clanData) {
									clanCoinBoost = clanData.coinMultiply;
									clanLvlBoost = clanData.lvlMultiply;
								}
							}
							profileData = await profileModel.updateOne({
								userID: uid,
							}, {
								$inc: {
									silverCoins: Math.abs(2 * clanCoinBoost),
									xp: Math.abs(2 * clanLvlBoost),
									reputation: 1
								}
							});

							let userXP = profileData.xp;
							let userLvl = profileData.lvl;
							let userCoins = profileData.silverCoins

							if (userXP >= 100 * userLvl) {
								xpAddResponce = await profileModel.updateOne({
									userID: uid,
								}, {
									$set: {
										xp: 0
									},
									$inc: {
										lvl: 1,
									}
								});
							}

							//кланы и опыт клана
							if (!(userClan == "" || userClan == " " || userClan == null || userClan == "Нет")) {
								clanData = await clanModel.findOne({
									name: userClan
								});
								if (clanData) {
									//найти клан, если существует и добавить опыт
									clanData = await clanModel.updateOne({
										name: userClan,
									}, {
										$inc: {
											xp: 2
										}
									});
									clanData = await clanModel.findOne({
										name: userClan
									});
									let clanXp = clanData.xp;
									let clanLvl = clanData.level;

									let clanMembers = clanData.members;
									let clanOfficers = clanData.officers;
									let memberAmount = clanMembers.length + clanOfficers.length;
									let clanxpmult = 1;
									if (Math.floor(memberAmount / 2) > 0) {
										clanxpmult = Math.floor(memberAmount / 2);
									}
									if (clanXp >= (xplvlmult * clanLvl * clanxpmult)) {
										clanData = await clanModel.updateOne({
											name: userClan,
										}, {
											$set: {
												xp: 0
											},
											$inc: {
												level: 1
											}
										});
									}
								} else {
									console.warn("No Data about clan: " + userClan);
								}
							}
						}
					}
				}

				//переписывание прав для канала создания приваток
				//NOTE: УБРАТЬ И НАПИСАТЬ 1с ЦИКЛ ПОД УДАЛЕНИЕ ПУСТЫХ ВОЙСОВ
				//NOTE: Если владелец приватки ливает с приватки - она удаляется
				// bot.channels.cache.filter(channel => channel.id === config.createChannelCategory).forEach(channel => {
				//  if (channel.children.size <= 1) {
				//      bot.channels.cache.find(ch => ch.id == config.createChannelId).overwritePermissions([{
				//          id: `${config.everyoneID}`,
				//          allow: ['CONNECT']
				//      }]);
				//  }
				// });
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		}, 60000);
		bot.channels.cache.get(config.verificationChannel).messages.fetch(config.verificationMessage).then(m => {
			m.react("✅");
		});
		reactrole.forEach(obj => {
			bot.channels.cache.get(obj.channelID).messages.fetch(obj.messageID).then(m => {
				m.react(obj.emoji).catch(err => {console.log(err);})
			})
		})

		serverClans = await clanModel.find({});
		if (serverClans.length > 0) {
			serverClans.forEach(async obj => {
				if (obj.underAttack == 1) {
					let errOfAttack = new Discord.MessageEmbed()
						.setColor(`${config.errColor}`)
						.setTitle("⸝⸝ X ₊˚ Критическая ошибка◞")
						.setDescription(`**Бот сервера был перезагружен, а атака на ваш клан остановлена.**`)
						.setTimestamp();
					bot.channels.cache.find(ch => ch.id == obj.clanChat).send(errOfAttack);
					clanData = await clanModel.updateOne({
						userID: obj.userID
					}, {
						$set: {
							underAttack: 0
						}
					});
					console.info('---CLAN DEBUG---');
					console.info(`'underAttack' FOR CLAN ${obj.name} (${obj.userID}) IS FIXED AND SET TO '0'`);
					console.info('---CLAN DEBUG---');
				}
			});
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.on("messageReactionAdd", async (reaction, user) => {
	try {
		if (!user || user.bot || !reaction.message.channel.guild) return;
		let msg = reaction.message;
		let member = bot.guilds.cache.get(config.serverId).members.cache.get(user.id);
		let indexes = [];
		for (let i = 0; i < reactrole.length; i++) {
			if (reactrole[i].messageID == msg.id) indexes.push(i);
		}
		indexes.forEach(index => {
			let emojiName = reactrole[index].emoji.split(":");
			emojiName = emojiName[1];
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && member.roles.cache.has(reactrole[index].roleID) && reactrole[index].single == 1 && (reactrole[index].emoji != reaction.emoji.name || emojiName != reaction.emoji.name)) {
				member.roles.remove(reactrole[index].roleID);
			}
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && (reactrole[index].emoji == reaction.emoji.name || emojiName == reaction.emoji.name)) {
				if (reactrole[index].type == 0 || reactrole[index].type == 1) {
					member.roles.add(reactrole[index].roleID);
				} else if (reactrole[index].type == 2) {
					member.roles.remove(reactrole[index].roleID);
					msg.reactions.cache.find(r => r.emoji.name == reaction.emoji.name).users.remove(member);
				}
			}
		});
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.on("messageReactionRemove", async (reaction, user) => {
	try {
		if (!user || user.bot || !reaction.message.channel.guild) return;
		let msg = reaction.message;
		let msgReactIndex = reactrole.findIndex(x => x.messageID === msg.id);
		let member = bot.guilds.cache.get(config.serverId).members.cache.get(user.id);

		let indexes = [];
		for (let i = 0; i < reactrole.length; i++) {
			if (reactrole[i].messageID == msg.id) indexes.push(i);
		}
		indexes.forEach(index => {
			let emojiName = reactrole[index].emoji.split(":");
			emojiName = emojiName[1];
			if (msg.id == reactrole[index].messageID && reactrole[index].channelID == msg.channel.id && (reactrole[index].emoji == reaction.emoji.name || emojiName == reaction.emoji.name) && (reactrole[index].type == 0 || reactrole[index].type == 2)) {
				member.roles.remove(reactrole[index].roleID);
			}
		});
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

//делать что-то при ВЫХОДЕ юзера с сервера
bot.on('guildMemberRemove', async member => {
	try {
		let uid = member.id;
		//Удалять брак
		profileData = await profileModel.findOne({
			userID: uid
		});
		let userMarriage = profileData.marriage;
		if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) {
			profileData = await profileModel.updateOne({
				userID: uid,
			}, {
				$set: {
					marriage: "Нет"
				}
			});

			profileData = await profileModel.updateOne({
				userID: userMarriage,
			}, {
				$set: {
					marriage: "Нет"
				}
			});

			let divorceByLeave = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Браки◞")
				.setDescription(`К сожалению, Ваш партнёр вышел с сервера и ваш брак был расторгнут.`)
				.setTimestamp();

			bot.users.cache.get(userMarriage).send(divorceByLeave);
			bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage).roles.remove(config.inLoveRole);

			let loveroomId = 0;
			clrData = await loveroomModel.findOne({
				userID: uid
			});
			if (clrData) {
				loveroomId = clrData.loveroomID;
				if (!(loveroomId == 0)) {
					clrResponce = await loveroomModel.updateOne({
						userID: uid,
					}, {
						$set: {
							loveroomID: 0,
							loveroomTimestamp: 0,
							loveroomLastpayment: 0
						}
					});

					clrResponce = await loveroomModel.updateOne({
						userID: userMarriage,
					}, {
						$set: {
							loveroomID: 0,
							loveroomTimestamp: 0,
							loveroomLastpayment: 0
						}
					});

					bot.channels.cache.get(loveroomId).delete();
				}
			}
		}

		//удалять клан или убирать юзера из клана
		let userClan = profileData.clan;
		if (!(userClan == "" || userClan == " " || userClan == null || userClan == "Нет")) {
			ownClanData = await clanModel.findOne({
				userID: uid
			})
			if (ownClanData) {
				let clanMembers = clanData.members;
				let clanOfficers = clanData.officers;
				let clanRoleId = clanData.clanRole;
				let clanName = clanData.name;

				clanDeleteResponce = await clanModel.deleteOne({
					userID: uid
				});

				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						clan: "Нет"
					}
				});

				if (clanMembers.length > 0) {
					clanMembers.forEach(async user => {
						try {
							profileData = await profileModel.updateOne({
								userID: user.memberID,
							}, {
								$set: {
									clan: "Нет"
								}
							});
						} catch (err) {
							if (err.name === "ReferenceError")
								console.log("У вас ошибка")
							console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
						}
					})
				}
				if (clanOfficers.length > 0) {
					clanOfficers.forEach(async user => {
						try {
							profileData = await profileModel.updateOne({
								userID: user.memberID,
							}, {
								$set: {
									clan: "Нет"
								}
							});
						} catch (err) {
							if (err.name === "ReferenceError")
								console.log("У вас ошибка")
							console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
						}
					})
				}

				message.guild.roles.cache.get(clanRoleId).delete();

				message.guild.channels.cache.forEach((channel) => {
					if (channel.name == clanName)
						channel.delete()
						.catch((e) => console.log(`Could not delete ${channel.name} because of ${e}`))
				});
			} else {
				clanData = await clanModel.findOne({
					name: userClan
				});
				let clanName = clanData.name;
				let clanMembers = clanData.members;
				let clanOfficers = clanData.officers;

				let membersArray = clanMembers;
				let officersArray = clanOfficers;

				let indexMember = membersArray.findIndex(x => x.memberID === uid);
				let indexOfficer = officersArray.findIndex(x => x.memberID === uid);

				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						clan: "Нет"
					}
				});

				if (indexMember > -1) {
					membersArray.splice(indexMember, 1);
					clanData = await clanModel.updateOne({
						name: clanName,
					}, {
						$set: {
							members: membersArray
						}
					});
				} else {
					officersArray.splice(indexOfficer, 1);
					clanData = await clanModel.updateOne({
						name: clanName,
					}, {
						$set: {
							officers: officersArray
						}
					});
				}

				bot.channels.cache.find(ch => ch.name == clanName && ch.type == 'voice').permissionOverwrites.get(uid).delete();
				bot.channels.cache.find(ch => ch.name == clanName && ch.type == 'text').permissionOverwrites.get(uid).delete();
			}
		}
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}

});

//делать что-то при ВХОДЕ юзера на сервер
bot.on('guildMemberAdd', async member => {
	try {
		//выкинуть юзера с сервера, если аккаунт создан меньше недели назад
		if (member.user.createdTimestamp > Date.now() - (1000 * 60 * 60 * 24 * 31)) {
			let accountKick = new Discord.MessageEmbed()
				.setColor(config.defaultColor)
				.setTitle("⸝⸝🪐₊˚ Metanora◞")
				.setDescription(`Вы были кикнуты с сервера **Metanora🪐.**\n\nПричина: к сожалению, Ваш аккаунт был создан менее 3 месяцев назад.`)
				.setTimestamp();
			bot.users.cache.get(member.user.id).send(accountKick, "https://discord.gg/VJrvuHsrdf").then(() => {
				member.kick();
			});
		}
		//чекнуть не бот ли юзер, чтобы лишний раз не засирать БД
		if (member.user.bot) return;
		let uid = member.id;
		//создание основного профиля
		//чек есть ли профиль
		profileData = await profileModel.findOne({
			userID: member.id
		});
		//создание основного профиля
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: "Нет",
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			//сохранение записи
			profile.save();
		}

		//отправить сообщение в чат, при входе нового юзера
		//NOTE: сделать отправку сообщения, только при нажатии на реакцию верификации
		let embed = new Discord.MessageEmbed()
            .setColor(config.defaultColor)
            .setTitle('╸                          Добро пожаловать                          ╺')
            .setDescription(`Мы рады приветствовать тебя здесь и хотим, и надеемся, что ты замечательно проведёшь время на нашем серверу.\nМы настоятельно рекомендуем ознакомиться с каналами <#891058992107896882> и <#891059046377988147>`)
            //.setThumbnail(`${member.user.displayAvatarURL({dynamic: true})}`)
        //member.guild.channels.cache.get(config.mainChannel).send(`${member}`, embed);
		let piar = new Discord.MessageEmbed()
		.setColor("#2f3136")
		.setDescription(`Спасибо что ты присоединился на наш сервер!\nЗаходи сюда тоже! - [тык](https://discord.gg/VJrvuHsrdf)`)
		bot.users.cache.get(member.user.id).send("https://discord.gg/VJrvuHsrdf", piar)
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

//chat log
bot.on('messageDelete', message => {
    if (message.author.bot) return;
    let deletedMessage = new Discord.MessageEmbed()
        .setTitle("Сообщение удалено:")
        .setColor(config.defaultColor)
        .setDescription("")
        .addField(`> Содержание:`, "```" + message.content + "```", inline = false)
        .addField(`> Отправитель:`, "```" + message.author.tag + "```", inline = true)
        .addField(`> ID Отправителя`, "```" + message.author.id + "```", inline = true)
        .setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({ format: "png", dynamic: true })}`)
        .setTimestamp(message.createdAt)
    bot.channels.cache.get(config.chatLogChannel).send(deletedMessage);
});

bot.on('messageUpdate', (oldMessage, newMessage) => {
    if (!oldMessage.author) return;
    const MessageLog = bot.channels.cache.find(channel => channel.id === '836155063445487655');
    var embed = new Discord.MessageEmbed()
        .setTitle(`Сообщение отредактировано:`)
        .setTimestamp()
        .setColor('#2f3136')
        .addField("> Автор:", "```" + newMessage.author.tag + "```", inline = false)
        .addField("> Оригинал:", "```" + oldMessage.content + "```", inline = true)
        .addField("> Редакт:", "```" + newMessage.content + "```", inline = true)
    bot.channels.cache.get(config.chatLogChannel).send(embed);
});

bot.on('message', async message => {
	try {
		const isInvite = async (guild, code) => {
			return await new Promise((resolve) => {
				guild.fetchInvites().then((invites) => {
					for (const invite of invites) {
						if (code === invite[0]) {
							resolve(true)
							return
						}
					}
					resolve(false)
				})
			})
		}
		const {
			guild,
			member,
			content
		} = message

		const code = content.split('discord.gg/')[1]

		if (content.includes('discord.gg/')) {
			const isOurInvite = await isInvite(guild, code)
			if (!isOurInvite) {
				let antiad = new Discord.MessageEmbed()
					.setColor(config.warnColor)
					.setTitle("🛑 РЕКЛАМА 🛑")
					.setDescription(`Пользователь ${message.author} (id: ${message.author.id}) отправил ссылку на другой сервер (${message})`)
					.setFooter(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				bot.channels.cache.get(config.chatLogChannel).send(antiad);
				message.delete();
			}
		}
		if (message.author.bot) return;
		if (message.channel.type == "dm") return;
		let uid = message.author.id;
		let msgAuthor = message.author;
		profileData = await profileModel.findOne({
			userID: uid
		});
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: "Нет",
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			profile.save();
		}
		//чек есть ли профиль войс актива
		vctimeData = await vctimeModel.findOne({
			userID: member.id
		});
		//создание профиля войс актива
		if (!vctimeData) {
			let vctime = await vctimeModel.create({
				userID: uid,
				vctime: 0,
			});
			//сохранение записи
			vctime.save();
		}
		//выдавать роль darkness
		const now = new Date();


		//добавить коины при отправке сообщений
		let userClan = "Нет";
		userClan = profileData.clan;
		let clanCoinBoost = 1;
		let clanLvlBoost = 1;
		if (!(userClan == "" || userClan == " " || userClan == null || userClan == "Нет")) {
			clanData = await clanModel.findOne({
				name: userClan
			});
			if (clanData) {
				clanCoinBoost = clanData.coinMultiply;
				clanLvlBoost = clanData.lvlMultiply;
			}
		}
		profileData = await profileModel.findOne({
			userID: uid
		});
		if (profileData) {
			profileData = await profileModel.updateOne({
				userID: uid,
			}, {
				$inc: {
					msgs: 1,
					msgsForCoinGet: 1,
					xp: 1 * clanLvlBoost
				}
			});
		}

		profileData = await profileModel.findOne({
			userID: uid
		});
		let userXP = profileData.xp;
		let userLvl = profileData.lvl;
		let msgsForCoinGet = profileData.msgsForCoinGet;
		if(message.content.startsWith(prefix + 'verifyu')){
			let bottom = new disbut.MessageButton()
			.setEmoji('893561830688034876')
			.setID('verification_msg_id')
			.setStyle('grey')


			let embed = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle(`Верификация`)
			.setDescription(`Мы рады приветствовать тебя на нашем сервере\n\n**Для получения доступа к серверу нажмите на "сердечко"**`)
			message.channel.send(embed, bottom)
		}
		if (userXP >= 100 * userLvl) {
			xpAddResponce = await profileModel.updateOne({
				userID: uid,
			}, {
				$set: {
					xp: 0
				},
				$inc: {
					lvl: 1
				}
			});
			message.reply("ok")
		}
		if (msgsForCoinGet >= 3) {
			coinAddResponce = await profileModel.updateOne({
				userID: uid,
			}, {
				$set: {
					msgsForCoinGet: 0
				},
				$inc: {
					silverCoins: Math.abs(1 * clanCoinBoost)
				}
			});
		}
		//Ставить реакцию на сообщение с фотографией в чате селфи
		//И удалять сообщения без фотографий
		if (message.channel.id == bot.channels.cache.get(config.selfiesChannel) && !message.author.bot) {
			if (message.attachments.size <= 0) {
				message.delete();
			} else {
				message.react("<a:M_Like:889129087342379099>");
				message.member.roles.add("891293158191796324")
			}
		}
		repWords.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					profileData = await profileModel.updateOne({
						userID: uid,
					}, {
						$inc: {
							reputation: 5,
						}
					});
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		minusRepWorld.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					profileData = await profileModel.updateOne({
						userID: uid,
					}, {
						$inc: {
							reputation: -10,
						}
					});
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		//реакция на сообщение добро пожаловать
		helloWords.forEach(async word => {
			try {
				if (message.content.toLowerCase().includes(word)) {
					message.react("<a:M_Heart:893561830688034876>");
				}
			} catch (err) {
				if (err.name === "ReferenceError")
					console.log("У вас ошибка")
				console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
			}
		})
		//разная дичь
		let messageArray = message.content.split(" ");
		let command = messageArray[0].toLowerCase();
		let args = messageArray.slice(1);
		if (!message.content.startsWith(prefix)) return;
		let cmd = bot.commands.get(command.slice(prefix.length));
		if (cmd) cmd.run(bot, message, args, profileData);

		//знак отличия
		profileData = await profileModel.findOne({
			userID: uid
		});
		let achieve = profileData.achievements;
		let userMsgs = profileData.msgs;
		let rUser = message.author;
		if (userMsgs >= 10000) {
			const exclsName = `"Клавишник"`;
			const exclsEmoji = "🎹";

			let newExclsEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
				.setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

			achieveNew = achieve.toString();
			if (achieveNew.indexOf(exclsEmoji) > -1) {
				return;
			} else {
				achieveNew = achieveNew + exclsEmoji + " ";
				profileData = await profileModel.updateOne({
					userID: uid,
				}, {
					$set: {
						achievements: achieveNew
					}
				});
				let exclsGet = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
					.setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
					.setTimestamp();

				bot.users.cache.get(rUser.id).send(exclsGet);
				bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
			}
		}

	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});


bot.on('message', async (message) => {
	if(message.content.startsWith(prefix + 'private')){
			let bottom = new disbut.MessageButton()
			.setEmoji('889133276969697330')
			.setID('priv_msg_id')
			.setStyle('grey')


			let embed = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle(`Управление приватными комнатами`)
			.setDescription(`Нажми на кнопку ниже, чтобы изменить название комнаты`)
			const msg = await message.channel.send(embed, bottom)

			}
})
bot.on('clickButton', async (button, message, args, content) => {
	if(button.id === 'verification_msg_id') {
		button.clicker.member.roles.add("889525768114274356")
		bot.channels.cache.get(config.mainChannel).send("welcome " + `${button.clicker.user}`)
	}

	if(button.id === 'priv_msg_id') {
		button.channel.send('укажите новое название приватного канала')
		.then(async collected => {
			if(message.content.slice(8)) {
				message.channel.send("hui")
			}
			})
		//bot.channels.cache.get("892000407566565426").send(private)
	}
})
bot.on('voiceStateUpdate', async (oldState, newState) => {
	try {
		if (newState.member.user.bot) return;

		let uid = newState.member.user.id;

		//чек есть ли профиль для приваток
		pvcData = await pvcModel.findOne({
			userID: uid
		});
		//создание профиля для приваток
		if (!pvcData) {
			let pvc = await pvcModel.create({
				userID: uid,
				ownvc: 0,
			});
			//сохранение записи
			pvc.save();
		}
		//чек есть ли профиль
		profileData = await profileModel.findOne({
			userID: uid
		});
		//создание основного профиля
		if (!profileData) {
			let profile = await profileModel.create({
				userID: uid,
				silverCoins: 200,
				goldCoins: 0,
				xp: 0,
				lvl: 1,
				msgs: 0,
				msgsForCoinGet: 0,
				reputation: 0,
				clan: "Нет",
				marriage: "Нет",
				profileStatus: config.defaultPStatus,
				profileBanner: config.defaultPBanner,
				profileLine: config.defaultPLine,
				achievements: " ",
			});
			//сохранение записи
			profile.save();
		}
		//создание профиля для войсактива
		profileData = await profileModel.findOne({
			userID: uid
		});
		let userCoins = profileData.silverCoins;
		pvc = await pvcModel.findOne({
			userID: uid
		});
		let ownvc = pvc.ownvc;

		// const seconds = Math.floor((uvc.vctime / 1000) % 60);
		// const minutes = Math.floor((uvc.vctime / 1000 / 60) % 60);
		// const hours = Math.floor((uvc.vctime / 1000 / 60 / 60) % 24);
		// const days = Math.floor(uvc.vctime / 1000 / 60 / 60 / 24);
		//
		//---приватные комнаты---
		//
		if (newState.channelID == config.createChannelId) { //проверка на заход в канал создания румы
			//создание самой румы, сделать лимит в 1 человека и позволить владельцу видеть канал
			//кикнуть, если нет бабок
			//if (userCoins < prCost) {
			//	newState.setChannel(null);
			//	let errorCoins = new Discord.MessageEmbed()
			//		.setColor(`${config.errColor}`)
			//		.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			//		.setDescription(`У Вас недостаточно средств для создания приватной комнаты.\nВаш баланс: ${userCoins} ${config.silverCoin}\nСтоимость приватной комнаты ${prCost} ${config.silverCoin}`)
			//		.setTimestamp();
			//	bot.users.cache.get(newState.member.user.id).send(errorCoins);
			//	return;
			//} else {
			//	profileData = await profileModel.updateOne({
			//		userID: uid,
			//	}, {
			//		$inc: {
			//			silverCoins: -prCost
			//		}
			//	});
				profileData = await profileModel.findOne({userID: uid});
				let userCoins = profileData.silverCoins;
				let vcCreate = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Приватные комнаты◞")
					.setDescription(`C Вас было списано ${prCost} ${config.silverCoin} за создание приватной комнаты.\nВаш баланс: ${userCoins - prCost} ${config.silverCoin}`)
					.setTimestamp();
			//	bot.users.cache.get(newState.member.user.id).send(vcCreate);

				newState.guild.channels.create(`・` + oldState.member.user.username, {
					type: 'voice',
					userLimit: 2,
					parent: config.createChannelCategory,
					permissionOverwrites: [{
						id: newState.id,
						allow: ['VIEW_CHANNEL']
					}]
				}).then(
					async c => {
						try {
							//переместить участника
							newState.setChannel(c);
							//присвоить айди созданного канала к профайлу
							newOwnvcID = `${bot.channels.cache.find(channel => channel.name === newState.member.user.username).id}`;
							pvcResponce = await pvcModel.updateOne({
								userID: uid,
							}, {
								$set: {
									ownvc: newOwnvcID
								}
							});
						} catch (err) {
							console.warn(err);
						}
					}
				)
			//}
		}
		//если владелец канала выходит с него, то удалить канал
		if (oldState.channel != null) {
			if (oldState.channel.members.size <= 0 && config.createChannelCategory == oldState.channel.parentID && oldState.channel.id != config.createChannelId) {
				bot.channels.cache.find(ch => ch.id == oldState.channel.id).delete();
			}
		}
		const category = await bot.channels.cache.get(config.createChannelCategory);
		category.children.forEach(channel => {
			if (channel.members.size <= 0 && channel.id != config.createChannelId) {
				channel.delete()
			}
		});
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
});

bot.login(token);