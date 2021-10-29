const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const invModel = require('../schemas/inventorySchema.js');

module.exports.run = async (bot, message, args) => {
		let rUser = message.author;
        let uid = message.author.id;
        let member = message.member;

        profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let userGoldCoins = profileData.goldCoins;

        invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
			});
			//сохранение документа
			inv.save();
		}

		let userRoles = invData.Inv;

		let noRole = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle("Отобразить роль")
		.setDescription(`• Аргумент **id** должен являться **числом**`)
		.addField(`Использование команды`,"`!отобразить <id>`")
		.setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		let nono = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle(`Отобразить роль`)
		.setDescription(`${rUser}, **роль** с таким индефикатором **не** найдена`)
		.addField(`Посмотреть инвентарь`,"`!инвентарь`")
		userIndex = args[0];

		if (userRoles.find(x => x.index == userIndex)) {
				eqRoleId = userRoles.find(x => x.index == userIndex).id;
				if (member.roles.cache.has(eqRoleId)) return message.channel.send(nono);
				member.roles.add(eqRoleId);
					let success = new Discord.MessageEmbed()
					.setColor(config.defaultColor)
					.setTitle(`Отобразить роль`)
					.setDescription(`${rUser}, вы **отобразили** роль <@&${eqRoleId}>`)
					.setThumbnail(rUser.displayAvatarURL({dynamic: true}))
				message.channel.send(success);
			} else {
				message.channel.send(noRole)
			}


}

module.exports.help = {
	name: "отобразить",
}