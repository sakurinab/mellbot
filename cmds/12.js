const { MessageEmbed } = require('discord.js')
const { MessageButton } = require('discord-buttons')
let config = require("../botconfig.json");

module.exports.run = async(bot, message, args, button) => {
		let embed = new MessageEmbed()
		.setColor(config.defaultColor)
		.setTitle(`Управление приватной комнатой`)
		.setDescription(`Надоел постоянный контроль команды сервера? Ты можешь создать свою комнату, в которой нет никаких **ограничений**! А кроме этого, ты можешь сам её **модерировать**!\n`)
}

module.exports.help = {
	name: "privadwate"
}