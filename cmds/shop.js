const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
const pagination = require('discord.js-pagination');
//mongoose
const mongoose = require('mongoose');
const invModel = require('../schemas/inventorySchema.js');

//магазин ролей
const roles = [
	{"index": 1, "roleID": "891579594283561020", "price": "1000", "type": "silver"},
	{"index": 2, "roleID": "891579602382782475", "price": "2000", "type": "silver"},
	{"index": 3, "roleID": "891579602835759104", "price": "4000", "type": "silver"},
];

module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;

		invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
			});
			//сохранение документа
			inv.save();
		}
		userRoles = invData.invRoles;

		if(roles.length === 0) return 

			const shoplist = roles.map((value, index) => {
				return `**${index+1}.** <@&${value.roleID}> - ${value.price} ${config.silverCoin}\n`
			})

		let page1 = new Discord.MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle("Магазин временных товаров")
		.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)

		page1.setDescription(shoplist)
		message.channel.send(page1)

		



	} catch(err) {
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "магазин",
	alias: "shop"
};