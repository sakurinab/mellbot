const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const rolesModel = require('../schemas/rolesSchema');
const profileModel = require('../schemas/profileSchema.js');

const roleCost = 5;

module.exports.run = async (bot, message, args) => {
	if (!args[0]) {

		let rUser = message.author;
        let uid = message.author.id;
        let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));

        profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

        rolesData = await rolesModel.findOne({ userID : uid })
        let userRoleID = rolesData.roleID;
        let userRole = new rolesData.Role



	} else if (args[0] == 'create'){

		roleName = args.slice(1).join(' ').replace(/[^a-zа-яA-ZА-Я0-9 ]/g, "");
			let nameErr = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle(`Создать личную роль`)
			.setDescription(`${rUser}, такое название уже занято`)
			.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)


			let errCoins = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setTitle(`Создать личную роль`)
			.setDescription(`${rUser}, у вас **недостаточно** ${config.silverCoin}. Необходимо ${roleCost} ${config.silverCoin}`)
			.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)


            if (!(message.guild.roles.cache.find(x => x.name.toLowerCase() === roleName.toLowerCase()) == undefined)) return message.channel.send();	
            	if (userCoins < roleCost) return message.channel.send(errCoins)
            	if (!(userRole == "" || userClan == " " || userClan == null || userClan == "Нет")) return

	} else if (args[0] == 'delete') {


	} else if (args[0] == 'color') {

	}
}

module.exports.help = {
	name: "role"
}
