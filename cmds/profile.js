const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const vctimeModel = require('../schemas/vctimeSchema.js');
const warnModel = require('../schemas/warnSchema.js');
const invModel = require('../schemas/inventorySchema.js');
const actionModel = require('../schemas/actionSchema.js');
module.exports.run = async (bot, message, args) => {
	try {
		//Цены
		const bannerCost = 2000;
		const lineCost = 800;
		const statusCost = 200;

		let rUser = message.author;
		let uid = message.author.id;

		let inActionData = await actionModel.findOne({ userID: uid });
		let inAction = !inActionData ? (newInActionUser = await actionModel.create({ userID: uid, inAction: 0 }), newInActionUser.save(), 0) : (inActionData.inAction);

		profileData = await profileModel.findOne({
			userID: uid
		});
		let userCoins = profileData.silverCoins;
		let userGoldCoins = profileData.goldCoins;
		let userPStatus = profileData.profileStatus;
		let userPBanner = profileData.profileBanner;
		let userPLine = profileData.profileLine;
		let userRep = profileData.reputation;
		let userMsgs = profileData.msgs;
		let userXP = profileData.xp;
		let userLvl = profileData.lvl;
		let userAchievements = profileData.achievements;
		let userClan = profileData.clan;
		let userMarriage = profileData.marriage;
		if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) {
			userMarriage = bot.users.cache.get(userMarriage).tag;
		}

		vctimeData = await vctimeModel.findOne({
			userID: uid
		});
		let userVCTime = vctimeData.vctime;

		let userWarns = 0;
		warnData = await warnModel.findOne({
			userID: uid
		});
		if (warnData) {
			userWarns = warnData.warnsNumber;
		}

		let cantOpenNewDialogue = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Сначала закройте Ваше последнее диалогове окно.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let errorCoins = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Недостаточно серебра.\nВаш баланс: ${userCoins} ${config.silverCoin}`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buyErr = new Discord.MessageEmbed()
			.setColor(`${config.errColor}`)
			.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
			.setDescription(`Ошибка покупки.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buySuccess = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Профиль◞")
			.setDescription(`Покупка совершена!`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		let buyCancel = new Discord.MessageEmbed()
			.setColor(`${config.defaultColor}`)
			.setTitle("⸝⸝ ♡₊˚ Профиль◞")
			.setDescription(`Покупка отменена.`)
			.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setTimestamp();

		function isHexColor(h) {
			var a = parseInt(h, 16);
			return (a.toString(16) === h)
		}

		if (!args[0]) {
			const seconds = Math.floor(userVCTime % 60)
			const minutes = Math.floor((userVCTime / 60) % 60)
			const hours = Math.floor((userVCTime / 60 / 60))
			//const hours = Math.floor(seconds % 60)
			//const seconds = Math.floor((userVCTime / 1000) % 60);
			//const minutes = Math.floor((userVCTime / 1000 / 60) % 60);
			//const hours = Math.floor((userVCTime / 1000 / 60 / 60) % 24);
			//const days = Math.floor(userVCTime / 1000 / 60 / 60 / 24);

			invData = await invModel.findOne({
				userID: uid
			});
			eqEmoji = 0;
			userEmoji = "";
			if (!invData) {
				inv = await invModel.create({
					userID: uid,
					eqEmoji: 0
				});
				//сохранение документа
				inv.save();
			} else {
				eqEmoji = invData.eqEmoji;
				userEmoji = invData.invEmoji;
			}	
			let userEmb = new Discord.MessageEmbed()
			.setColor(userPLine)
			.setAuthor(`⁣⁣Профиль — ${rUser.tag}`)
			.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)
			.addField(`> Статус`, "```" + userPStatus + "```", inline = false)
			.addField(`> Баланс`, "```" + userCoins + "```", inline = true)
			.addField(`> Голосовой онлайн`, "```" + `${hours} ч, ${minutes} м.` + "```", inline = true)

			//.addField(`Личная комната`, "```" + userClan + "```", inline = true)
			.addField(`> Отношения`, "```diff\n- " + userMarriage + "```", inline = true)
			//.setImage("https://images-ext-2.discordapp.net/external/39Iveph9nBPs4KRbNHnbjCWZUBlrs3t1WHecPnRM-cM/https/images-ext-2.discordapp.net/external/fv4ZOraVUJoIgcz8HTWdcRZthy7TsJWOj4NevDZQWa0/https/media.discordapp.net/attachments/823681920411107348/825483461040799784/1111.png")
			message.channel.send(userEmb)



			//if (eqEmoji > 0) {
				//emojiList = userEmoji.find(x => x.index == eqEmoji).emojis;

				//let [silverE, goldE, chatE, warnsE, xpE, lvlE, repE, marE, clanE, voiceE, achievE] = emojiList.split(" ");


				//let profileembed = new Discord.MessageEmbed()
				//	.setTitle(`<:M_User:889132424406118411> Профиль — ${rUser.tag}`)
				//	.setColor(`${userPLine}`)
				//	.addField("<:M_Say:889133276969697330>Статус:", "```" + userPStatus + "```", inline = false)
					//.addField("<:M_Crown:889132424825540638>Уровень:", '```' + userLvl + ` (` + userXP+ `/` + 100 * userLvl + `)` + '```', inline = true)
					//.addField("Репутация:", '```' + userRep + '```', inline = true)
				//	.addField("Отношения:", '```' + userMarriage + '```', inline = true)

				//	.addField(`Баланс:`, '```' + userCoins + '```', inline = true)
				//	.addField("Голосовой онлайн:", '```' + `${hours} ч, ${minutes} м.` + '```', inline = true)
				//	.addField("Клан:", '```' + userClan + '```', inline = true)

					//.addField("Сообщений:", '```' + userMsgs + '```', inline = true)
					//.addField("Отношения:", '```' + userMarriage + '```', inline = true)
					//.addField("Клан:", '```' + userClan + '```', inline = true)
					//.addField("Репутация:", '```' + userRep + '```', inline = true)
					//.addField("Голосовой онлайн:", '```' + `${hours} ч, ${minutes} м.` + '```', inline = true)
				//	.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)

				//message.channel.send(profileembed);
			//} else {
				//let profileembed = new Discord.MessageEmbed()
				//	.setTitle(`Профиль — ${rUser.tag}`)
				//	.addField("Статус:", "```" + userPStatus + "```", inline = false)
				//	.setColor(`${userPLine}`)
				//	.addField("Уровень:", '```' + userLvl + ` (` + userXP+ `/` + 100 * userLvl + `)` + '```', inline = true)
				//	.addField("Репутация:", '```' + userRep + '```', inline = true)
				//	.addField("Отношения:", '```' + userMarriage + '```', inline = true)

				//	.addField(`Баланс:`, '```' + userCoins + '```', inline = true)
				//	.addField("Голосовой онлайн:", '```' + `${hours} ч, ${minutes} м.` + '```', inline = true)
				//	.addField("Клан:", '```' + userClan + '```', inline = true)

					//.addField("Сообщений:", '```' + userMsgs + '```', inline = true)
					//.addField("Отношения:", '```' + userMarriage + '```', inline = true)
					//.addField("Клан:", '```' + userClan + '```', inline = true)
					//.addField("Репутация:", '```' + userRep + '```', inline = true)
					//.addField("Голосовой онлайн:", '```' + `${hours} ч, ${minutes} м.` + '```', inline = true)
				//	.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)

				//message.channel.send(profileembed);
			//}


		}/** else if (args[0] == "color") {
			if (userCoins >= lineCost) {
				//не давать открыть диалоговое окно, если прошлое не закрыто
				if (inAction == 1) return message.channel.send(cantOpenNewDialogue);
				await actionModel.updateOne({ userID: uid }, { $set: {inAction: 1} });
				let buyLineEmbed = new Discord.MessageEmbed()
					.setColor(`${args.slice(1).join(' ')}`)
					.setTitle("⸝⸝ ♡₊˚ Профиль◞")
					.setDescription(`Вы уверены, что хотите установить цвет линии "${args.slice(1).join(' ')}"? Стоимость ${lineCost} ${config.silverCoin}\nВаш баланс: ${userCoins} ${config.silverCoin}`)
					.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
					.setTimestamp();
				let lineMsg = await message.channel.send(buyLineEmbed);
				await lineMsg.react("✅");
				await lineMsg.react("❌");
				await lineMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
						max: 1,
						time: 20000
					})
					.then(async collected => {
						if (collected.first().emoji.name == "✅") {
							lineMsg.reactions.removeAll();
							lineMsg.edit(buySuccess);

							if (!args[1] || isHexColor(args.slice(1).join(' '))) {
								let errorLine = new Discord.MessageEmbed()
									.setColor(`${config.errColor}`)
									.setTitle("⸝⸝ ♡₊˚ Ошибка◞")
									.setDescription(`Укажите HEX код линии.`)
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(errorLine);

								statusMsg.edit(buyErr);
								await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
								return;
							} else {
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									profileLine: args.slice(1).join(' '),
								});

								let profileLine = new Discord.MessageEmbed()
									.setColor(args.slice(1).join(' '))
									.setTitle("⸝⸝ ♡₊˚ Профиль◞")
									.setDescription(`Цвет вашей линии: ` + args.slice(1).join(' '))
									.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
									.setTimestamp();
								message.channel.send(profileLine);
								profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									$inc: {
										silverCoins: -lineCost
									}
								});
								await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
								return;
							}
							await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
							return;
						} else if (collected.first().emoji.name == "❌") {
							lineMsg.reactions.removeAll();
							lineMsg.edit(buyCancel);
							await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
							return;
						} else {
							await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
							return lineMsg.edit(buyErr);
						}
					}).catch(async () => {
						lineMsg.edit(buyCancel);
						lineMsg.reactions.removeAll();
						await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
						return;
					});
			} else {
				message.channel.send(errorCoins);
			}

		} else {
			let allCommands = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle("⸝⸝ ♡₊˚ Команды профиля◞")
				.setDescription(`Вы указали неправильную команду, список всех команд [здесь](https://discord.gg/ZK4GCA2rAy)`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();
			message.channel.send(allCommands);
		}**/
	} catch (err) {
		if (err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "profile",
	alias: "профиль"
};