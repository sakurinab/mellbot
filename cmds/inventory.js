const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
const mongoose = require('mongoose');
const invent = require('../schemas/inventorySchema')
const profileModel = require('../schemas/profileSchema.js');
const invModel = require('../schemas/inventorySchema.js');
const roles = [
	{"index": 1, "roleID": "891579594283561020", "price": "1000", "type": "silver"},
	{"index": 2, "roleID": "891579602382782475", "price": "2000", "type": "silver"},
	{"index": 3, "roleID": "891579602835759104", "price": "4000", "type": "silver"},
];

module.exports.run = async (bot, message, args) => {
	let rUser = message.author;
	let uid = message.author.id;
    let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));

    invData = await invModel.findOne({ userID: uid });
		userRoles = invData.Inv.sort((a, b) => (a.index > b.index) ? 1 : -1);

			if(!invData) {
				let invevent = await vctimeModel.create({
				userID: uid,
			})
		let noInvent = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle(`Инвентарь ролей`)
		.setDescription(`Инвентарь **пуст**`)
		.setThumbnail(rUser.displayAvatarURL({ dynamic: true }))
				message.channel.send(noInvent)
			}



    let noInvent = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle(`Инвентарь ролей`)
		.setDescription(`Инвентарь **пуст**`)
		.setThumbnail(rUser.displayAvatarURL({ dynamic: true }))
			//if(!imvData) message.channel.send(noInvent)
	//if(roles.length === 0) return 

	//const shoplist = roles.map((value, index) => {
	//return `**${index+1}.** <@&${value.roleID}> - ${value.price} ${config.silverCoin}\n`
	//		})
	if (userRoles.length <= 0) {
	let invent = new Discord.MessageEmbed()
	.setColor(config.defaultColor)
	.setTitle(`Инвентарь ролей`)
	.setDescription(`Инвентарь **пуст**`)
	.setThumbnail(rUser.displayAvatarURL({ dynamic: true }));

} else if (userRoles.length <= 8){
	const inventee = userRoles.map((value, i) => {
		return `**${userRoles[i].index}.** <@&${userRoles[i].id}>`
	})

	let invent = new Discord.MessageEmbed()
	.setColor(config.defaultColor)
	.setTitle(`Инвентарь ролей`)
	.setDescription(inventee)
	.addField(`Спрятать роль`,"`!спрятать [индекс роли]`", inline = true)
	.addField(`Отобразить роль`,"`!отобразить [номер роли]`", inline = true)
	.setThumbnail(rUser.displayAvatarURL({ dynamic: true }))

message.channel.send(invent)
}


}

module.exports.help = {
	name: "инвентарь"
}