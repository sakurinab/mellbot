const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const actionModel = require('../schemas/actionSchema.js');
const loveroomModel = require('../schemas/loveroomSchema.js');
//цены
marriageCost = 3000;
let loveroomId = 0;

module.exports.run = async(bot,message,args) => {
		let rUser = message.author;
		let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
		let uid = message.author.id;
		let rMember = message.member;

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userGoldCoins = profileData.goldCoins;
        let userMarriage = profileData.marriage;

        let marryConf = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${mUser}, ${rUser} **предлагает** Вам заключить брак`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

        let success = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, ${mUser} принял(-а) предложение на создание любовной комнаты. Со счёта ${rUser} было списано ${marriageCost} ${config.silverCoin}`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

        let errCoins = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, у Вас недостаточно ${config.silverCoin}.\nНеобходимо ${marriageCost} ${config.silverCoin}`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		let time = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, ${mUser} не успел (-а) ответить на запрос`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

        let cancel = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, ${mUser}, отклонил (-а) предложение ${rUser} на создание любовной комнаты`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

        let userAlreadyMarried = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, ${mUser} **уже** состоит в **браке**`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))
        .addField(`Развестись`,`${config.prefix}divorce`)

        let youAlreadyMarried = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`${rUser}, Вы **уже** состоите в **браке**`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))
        .addField(`Развестись`,`${config.prefix}divorce`)

        let noUser = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle("Заключение брака")
        .setDescription(`• Аргумент **target** должен являться **Участник сервера**`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))
        .addField(`Использование команды`,`${config.prefix}marry <target>`)


        if (!(userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет")) return message.channel.send(youAlreadyMarried);
        if (!mUser || mUser.id == config.botId || mUser.id == uid) return message.channel.send(noUser);

        clrData = await loveroomModel.findOne({ userID: uid });
		if (!clrData) {
			clr = await loveroomModel.create({
				userID: uid,
				loveroomID: 0,
				loveroomTimestamp: 0,
				loveroomLastpayment: 0,
			});
			//сохранение документа
			clr.save();
		} else {
			loveroomId = clrData.loveroomID;
		}

        profileDataMUser = await profileModel.findOne({ userID: uid });

        let mUserMarriage = profileDataMUser.marriage;

        if (!(mUserMarriage == "" || mUserMarriage == " " || mUserMarriage == null || mUserMarriage == "Нет")) return message.channel.send(userAlreadyMarried);



        const msg = await message.channel.send(marryConf)
        await msg.react("✅");
        await msg.react("❌");
        await msg.awaitReactions((reaction, user) => user.id == mUser.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"),{max: 1, time:60000})
        .then(async collected => {
        	if(collected.first().emoji.name == "✅"){
        		msg.reactions.removeAll();

        		profileDataMUser = await profileModel.findOne({ userID: uid });
		        let mUserMarriage = profileDataMUser.marriage;
		        if (!(mUserMarriage == "" || mUserMarriage == " " || mUserMarriage == null || mUserMarriage == "Нет")) {
		        	return msg.edit(userAlreadyMarried);
		        }

		        profileData = await profileModel.findOne({ userID: uid });
   				userCoins = profileData.silverCoins;

   				if (userCoins < marriageCost) {
                	return msg.edit(errCoins);
                }

                profileData = await profileModel.updateOne({
		            userID: uid,
		        }, {
		            marriage: mUser.id,
		            $inc: {
                    	silverCoins: -marriageCost
                	}
		        });

				profileData = await profileModel.updateOne({
		            userID: mUser.id,
		        }, {
		            marriage: uid
		        });

		        rMember.roles.add(config.inLoveRole);
		        mUser.roles.add(config.inLoveRole);

			    msg.edit(success)

			//let mUser = bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage);
			let channelName = `・` + rUser.username + "💞" + mUser.user.username;

			rMember.guild.channels.create(channelName, {
			type: 'voice',
			userLimit: 2,
			parent: config.loveroomsCategory,
			permissionOverwrites: [{
				id: rMember.id,
				allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},{
				id: mUser.id,
				allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
			},{
				id: config.everyoneID,
				deny: ['CONNECT', 'SPEAK'],
			}]
		}).then( async c => {
			try {
				//присвоить айди созданного канала к профайлу
				newLoveroomID = bot.channels.cache.find(channel => channel.name === channelName).id;

				clrResponce = await loveroomModel.updateOne({
					userID: uid,
				}, {
					loveroomID: newLoveroomID,
					loveroomTimestamp: Date.now(),
					loveroomLastpayment: Date.now(),
				});

				clrData = await loveroomModel.findOne({ userID: mUser.id });

				if (!clrData) {
					clr = await loveroomModel.create({
						userID: mUser.id,
						loveroomID: newLoveroomID,
						loveroomTimestamp: Date.now(),
						loveroomLastpayment: Date.now(),
					});
					//сохранение документа
					clr.save();
				} else {
					clrResponce = await loveroomModel.updateOne({
						userID: mUser.id,
					}, {
						loveroomID: newLoveroomID,
						loveroomTimestamp: Date.now(),
						loveroomLastpayment: Date.now(),
					});
				}
			} catch (err) {
				console.warn(err);
			}
		});

        	} else if(collected.first().emoji.name == "❌"){
        		msg.reactions.removeAll();
        		msg.edit(cancel);
        	} else {
        		message.delete()
        	}
        })





}

module.exports.help = {
	name: "marry",
}