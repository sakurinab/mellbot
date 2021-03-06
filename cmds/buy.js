const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
const mongoose = require('mongoose');
const invModel = require('../schemas/inventorySchema.js');
const profileModel = require('../schemas/profileSchema.js');

const roles = [
	{"index": 1, "roleID": "862924426202710057", "price": "10000", "type": "silver"},
	{"index": 2, "roleID": "862924712820867082", "price": "25000", "type": "silver"},
	{"index": 3, "roleID": "862925117607378954", "price": "45000", "type": "silver"},
	{"index": 4, "roleID": "862925631175393290", "price": "60000", "type": "silver"},
	{"index": 5, "roleID": "862926470582501406", "price": "85000", "type": "silver"},
	{"index": 6, "roleID": "862926842868400138", "price": "100000", "type": "silver"},
	{"index": 7, "roleID": "862927172624973824", "price": "125000", "type": "silver"},
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
