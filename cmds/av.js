const Discord = require('discord.js');
const fs = require('fs');
let config = require("../botconfig.json");
module.exports.run = async (bot,message,args) => {
	try{
		
		let rUser = message.mentions.users.first();
		if(!rUser) rUser = message.author;

		let embed = new Discord.MessageEmbed()
		.setColor(`${config.defaultColor}`)
		.setTitle("Аватар")
		.setDescription(`[Ссылка на аватар](${rUser.displayAvatarURL({dynamic: true, size: 2048})})`)
		.setFooter(`${rUser.username}`)
		.setImage(`${rUser.displayAvatarURL({dynamic: true, size: 2048})}`)
		.setTimestamp();

		message.channel.send(embed);
	}catch(err){
		if(err.name === "ReferenceError")
			console.log("У вас ошибка")
		console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
	}
};

module.exports.help = {
	name: "av",
	alias: "avatar"
};