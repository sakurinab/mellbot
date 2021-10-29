const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');

 let gifs = [
 "https://media.discordapp.net/attachments/891286827632328754/891702067314434058/3.gif",
 "https://media.discordapp.net/attachments/891286827632328754/891781634095992842/6.gif"

 ]
module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.author;
		let uid = message.author.id;
		profileData = await profileModel.findOne({ userID: uid });
        let userCoins = profileData.silverCoins;
        let chance = 50

		let rand = Math.floor(Math.random() * 99);


		let waitEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setImage(gifs[Math.floor(Math.random() * gifs.length)])
        .setAuthor(`${rUser.tag}`, `${rUser.displayAvatarURL({ dynamic: true })}`)

		let errorCoins = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
		.setDescription(`У Вас недостаточно средств!`)

		let sumErrEmbed = new Discord.MessageEmbed()
		.setColor(`${config.errColor}`)
		.setDescription(`Ставка отсутсвует или имеет неверное значение`)
		.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)

		let casinoLoseEmbed = new Discord.MessageEmbed()
		.setColor(`#da434b`)
		.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)//.setTitle("⸝⸝ ♡₊˚ Казино◞")
		.setDescription(`Выпадает ${rand},к сожалению, ты проиграл. Попробуй еще раз...`)

		if(!args[0] || isNaN(args[0]) || (args[0] <= 0)) {
			message.channel.send(sumErrEmbed);
			return;
		} else if(userCoins < args[0]) {
			message.channel.send(errorCoins);
			return;
		} else if (args[0] > 500 && args[0] < 5){
			let mnogo = new Discord.MessageEmbed()
			.setColor(config.defaultColor)
			.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
			.setDescription(`${rUser}, максимальная ставка 500 ${config.silverCoin} и минимальная 5 ${config.silverCoin}`)
			message.channel.send(mnogo)
		} else {
			if(85 <= rand &&  rand <= 90) {
				//снять деньги с юзера
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`#95f581`)
				.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)//.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпадает ${rand}, твой выигрыш ${(args[0])*1} ${config.silverCoin}, так как ты выбросил больше`)
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0]))}});
				message.channel.send(waitEmbed).then(msg => { setTimeout(() => msg.edit(casinoEmbed),7500) })
			} else if(99 >= rand && rand > 90) {
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`#95f581`)
				//.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпадает ${rand}, твой выигрыш ${(args[0])*2} ${config.silverCoin}, так как ты выбросил больше`)
				.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0])*2)}});
				message.channel.send(waitEmbed).then(msg => { setTimeout(() => msg.edit(casinoEmbed),7500) })
			} else if(rand > 99) {
				let casinoEmbed = new Discord.MessageEmbed()
				.setColor(`#95f581`)
				//.setTitle("⸝⸝ ♡₊˚ Казино◞")
				.setDescription(`Выпадает ${rand}, твой выигрыш ${(args[0])*5} ${config.silverCoin}, так как ты выбросил больше`)
				.setAuthor(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: (parseInt(args[0])*5)}});
				message.channel.send(waitEmbed).then(msg => { setTimeout(() => msg.edit(casinoEmbed),7500) })
			} else {
				profileData = await profileModel.updateOne({userID: uid,}, {$inc: {silverCoins: -(parseInt(args[0]))}});
				message.channel.send(waitEmbed).then(msg => { setTimeout(() => msg.edit(casinoLoseEmbed), 7500) })
			}
			if (args[0] >= 100000 && rand <= 85) {
				profileData = await profileModel.findOne({ userID: uid });
	            let achieve = profileData.achievements;

				const exclsName = `"Деньги на ветер"`;
				const exclsEmoji = "💸";

				let newExclsEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
				.setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				achieveNew = achieve.toString();
				if (achieveNew.indexOf(exclsEmoji) > -1) {
					return;
				} else {
					achieveNew = achieveNew + exclsEmoji + " ";
	                profileData = await profileModel.updateOne({
	                    userID: uid,
	                }, {
	                    achievements: achieveNew,
	                });
					let exclsGet = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
					.setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
					.setTimestamp();

					//bot.users.cache.get(rUser.id).send(exclsGet);
					//bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
				}
	        }

	        if (rand > 99) {
				profileData = await profileModel.findOne({ userID: uid });
	            let achieve = profileData.achievements;

				const exclsName = `"Большая удача"`;
				const exclsEmoji = "🍀";

				let newExclsEmbed = new Discord.MessageEmbed()
				.setColor(`${config.defaultColor}`)
				.setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
				.setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
				.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
				.setTimestamp();

				achieveNew = achieve.toString();
				if (achieveNew.indexOf(exclsEmoji) > -1) {
					return;
				} else {
					achieveNew = achieveNew + exclsEmoji + " ";
	                profileData = await profileModel.updateOne({
	                    userID: uid,
	                }, {
	                    achievements: achieveNew,
	                });
					let exclsGet = new Discord.MessageEmbed()
					.setColor(`${config.defaultColor}`)
					.setTitle("⸝⸝ ♡₊˚ Знак отличия получен!◞")
					.setDescription(`Вы получили новый знак отличия **${exclsName}**!\nВаши значки: ${achieveNew}`)
					.setTimestamp();

					//bot.users.cache.get(rUser.id).send(exclsGet);
					//bot.channels.cache.get(config.mainChannel).send(newExclsEmbed);
				}
	        }
		}
	}catch(err){
		if(err.name === "ReferenceError")
		console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "казино",
	alias: "casino"
};