const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
module.exports.run = async (bot,message,args) => {
	try{
		
		let mUser = message.guild.member(message.guild.members.cache.get(args[0]) || message.mentions.users.first());
		let rUser = message.author;
		let uid = message.author.id;

		if (mUser) {
			profileDataMUser = await profileModel.findOne({ userID: mUser.id });
		}
		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;

		let transferErrUser = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("Передача валюты")
		.setDescription(`• Аргумент target должен являться **Участник сервера**`)
		.addField(`Использование команды`, "!give <target> <amount>")
		.setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		let transferErrNum = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("Передача валюты")
		.setDescription(`• Аргумент amount указан неверно`)
		.setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		let transferErrSame = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("Передача валюты")
		.setDescription(`${rUser},  Вы не можете передать ${config.silverCoin} самому себе`)
				.setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setTitle("Передача валюты")
		.setDescription(`Недостаточно монет.\n\nВаш баланс: ${userCoins} ${config.silverCoin}`)
				.setThumbnail(rUser.displayAvatarURL({dynamic: true}))

		if(!mUser || !profileDataMUser) return message.channel.send(transferErrUser);
		if(mUser.id == rUser.id) return message.channel.send(transferErrSame);
		if(!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(transferErrNum);
		if(userCoins < Math.abs(args[1])) return message.delete() //message.channel.send(errorCoins);

		profileData = await profileModel.updateOne({
            userID: uid,
        }, {
            $inc: {
                silverCoins: -parseInt(args[1])
            }
        });
        profileDataMUser = await profileModel.updateOne({
            userID: mUser.id,
        }, {
            $inc: {
                silverCoins: parseInt(args[1])
            }
        });
		let transferEmbedDM = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("Передача валюты")
		.setDescription(`Пользователь ${rUser} перевёл вам ${args[1]} ${config.silverCoin}`)
		.setTimestamp();
		//bot.users.cache.get(mUser.id).send(transferEmbedDM);

		let transferEmbed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("Передача валюты")
		.setDescription(`${rUser}, Вы передали пользователю ${mUser} ${args[1]} ${config.silverCoin}`)
				.setThumbnail(rUser.displayAvatarURL({dynamic: true}))
		message.channel.send(transferEmbed);
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "transfer",
	alias: "give"
};