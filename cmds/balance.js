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

module.exports.run = async( bot, message, args ) => {
	let rUser = message.author;
	let uid = message.author.id;
		profileData = await profileModel.findOne({
			userID: uid
		});
		let userCoins = profileData.silverCoins;
		let userGoldCoins = profileData.goldCoins;

		let embed = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle(`Баланс ${rUser.tag}`)
		.addField(`> ${config.silverCoin} Коины`,"```" + userCoins + "```", inline = true)
		.setThumbnail(rUser.displayAvatarURL({dynamic: true}))
		message.channel.send(embed)
}

module.exports.help = {
	name: "balance",
	alias: "$"
}