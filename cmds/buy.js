const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
const mongoose = require('mongoose');
const invModel = require('../schemas/inventorySchema.js');
const profileModel = require('../schemas/profileSchema.js');

const roles = [
	{"index": 1, "roleID": "891579594283561020", "price": "1000", "type": "silver"},
	{"index": 2, "roleID": "891579602382782475", "price": "2000", "type": "silver"},
	{"index": 3, "roleID": "891579602835759104", "price": "4000", "type": "silver"},
];

module.exports.run = async (bot, message, args) => {
		let rUser = message.author;
        let uid = message.author.id;

        profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

    invData = await invModel.findOne({ userID: uid });
        if (!invData) {
			inv = await invModel.create({
				userID: uid,
			});
			//сохранение документа
			inv.save();
		}


	let errIndex = new Discord.MessageEmbed()
	.setColor(config.defaultColor)
	.setTitle(`Покупка роли с магазина`)
	.setDescription(`• Аргумент **id** должен являться **индексом**`)
	.addField(`Использование команды`,"`!купить <id>`")
	.setThumbnail(rUser.displayAvatarURL({ dynamic: true }))

	let canceled = new Discord.MessageEmbed()
    .setTitle(`Отмена покупки`)
	.setDescription(`Вы отменили покупку временной роли`)
	.setColor(config.defaultColor)
    .setThumbnail(rUser.displayAvatarURL({ dynamic: true }))

		if (!args[0]) return message.channel.send(errIndex);

		invData = await invModel.findOne({ userID: uid });
			userRoles = invData.Inv;

			index = args[0]-1;
			roleIndex = roles[index].index;
			roleId = roles[index].roleID;
			rolePrice = roles[index].price;
			roleType = roles[index].type;

			//if (userRoles.find(x => x.index === roleIndex)) return  message.channel.send(canceled)
	let errCoins = new Discord.MessageEmbed()
	.setColor(config.defaultColor)
	.setTitle(`Создать личную роль`)
	.setDescription(`${rUser}, у вас **недостаточно** ${config.silverCoin}. Необходимо ${rolePrice} ${config.silverCoin}`)
	.setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)

		if(userCoins < rolePrice) return message.channel.send(errCoins)

			let success = new Discord.MessageEmbed()
            .setTitle(`Покупка роли с магазина`)
            .setDescription(`Вы успешно приобрели роль <@&${roleId}> за ${rolePrice} ${config.silverCoin}`)
            .setColor(config.defaultColor)
            .setThumbnail(rUser.displayAvatarURL({ dynamic: true }))


            profileData = await profileModel.updateOne({
							userID: uid,
						},{
							$inc: {
								silverCoins: -rolePrice
							}
						});

            const newRoleBuy = {
						index: roleIndex,
						id: roleId,
					}

					invData = await invModel.updateOne({
			        	userID: uid,
				    }, {
				    	$push: {
				    		Inv: newRoleBuy,
				    	}
				    });


			 message.channel.send(success);
			


}

module.exports.help = {
	name: "buy"
}