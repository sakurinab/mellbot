const Discord = require('discord.js');//aa
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const loveroomModel = require('../schemas/loveroomSchema.js');


module.exports.run = async (bot,message,args) => {

		let rUser = message.author;
		let uid = message.author.id;
		let rMember = message.member;

		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userMarriage = profileData.marriage;

        let noMarried = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))
        .setTitle("Развестись")
        .setDescription(`${rUser}, Вы и так **не** состоите в **браке**`)

        let success = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("Развестись")
        .setDescription(`${rUser}, Вы **развелись** с пользователем <@${userMarriage}>. ${config.silverCoin} **не** были возвращены`)
        .setThumbnail(rUser.displayAvatarURL({dynamic: true}))

        if (userMarriage == "" || userMarriage == " " || userMarriage == null || userMarriage == "Нет") return message.channel.send(noMarried);

        let mUser = bot.guilds.cache.get(config.serverId).members.cache.get(userMarriage);

        profileDataMUser = await profileModel.findOne({ userID: uid });
        let mUserMarriage = profileDataMUser.marriage;;

		profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            marriage: "Нет",
        });

        profileData = await profileModel.updateOne({
            userID: mUser.id,
        }, {
            marriage: "Нет",
        });



        rMember.roles.remove(config.inLoveRole);
        mUser.roles.remove(config.inLoveRole);

        message.channel.send(success);

        let loveroomId = 0;
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

		if (loveroomId == 0) return message.channel.send(noMarried);

		clrResponce = await loveroomModel.updateOne({
					userID: uid,
				}, {
					loveroomID: 0,
					loveroomTimestamp: 0,
					loveroomLastpayment: 0,
				});

				clrResponce = await loveroomModel.updateOne({
					userID: mUser.id,
				}, {
					loveroomID: 0,
					loveroomTimestamp: 0,
					loveroomLastpayment: 0,
				});

				bot.channels.cache.find(ch => ch.id == loveroomId).delete();


}

module.exports.help = {
	name: "divorce"
}