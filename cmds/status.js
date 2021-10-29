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
	let userPStatus = profileData.profileStatus;
	let rUser = message.author;
	let uid = message.author.id;
				let statusInvalid2 = new Discord.MessageEmbed()
					.setColor(`${config.errColor}`)
					.setTitle("Изменить статус")
					.setDescription(`• Аргумент **status** не может быть больше 54 символов`)
					.addField(`Использование команды`,`.p status [ваш статус]`)
					if (args.slice(0).join(' ').length > 54 || args.slice(1).join(' ').length < 0) return message.channel.send(statusInvalid2);
					profileData = await profileModel.updateOne({
									userID: uid,
								}, {
									profileStatus: args.slice(0).join(' '),
								});
					let profileStatus = new Discord.MessageEmbed()
									.setColor(`${config.defaultColor}`)
									.setTitle("Изменить статус")
									.setDescription(`${rUser}, Вы изменили свой статус на **` + args.slice(0).join(' ') + `**`)
								message.channel.send(profileStatus);




	}

module.exports.help = {
	name: "status",
	alias: "статус"
}