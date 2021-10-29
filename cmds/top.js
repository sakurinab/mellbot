const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const vctimeModel = require('../schemas/vctimeSchema.js');
const balModel = require('../schemas/profileSchema.js')

module.exports.run = async (bot,message,args) => {
	if (!args[0]) {



	message.delete()
	} else if (args[0] == "онлайн"){
		let rUser = message.author


		const results = await vctimeModel.find({}).sort({vctime: -1}).limit(5);
        var lbFild = ""
        var lbString = "";
        var lbPos = 1;
        var lbEmoji = ""

        for (let i = 0; i < results.length; i++) {
            const { userID, vctime = 0 } = results[i];

            switch (lbPos) {
            case 1:
                lbEmoji = ""
                break;
            case 2:
                lbEmoji = ""
                break;
            case 3:
                lbEmoji = ""
                break;
            default:
                lbEmoji = ""
                break;
            }
            if (lbPos <= 3) {
                lbString += `**${lbPos}.**` + ` <@${userID}>\n\n`;
            } else {
                lbString += `**${lbPos}.**` + ` <@${userID}>\n\n`;
            }
            lbPos++;
        }

        for (let i = 0; i < results.length; i++) {
            const { userID, vctime = 0 } = results[i];

            switch (lbPos) {
            case 1:
                lbEmoji = ""
                break;
            case 2:
                lbEmoji = ""
                break;
            case 3:
                lbEmoji = ""
                break;
            default:
                lbEmoji = ""
                break;
            }
            if (lbPos <= 3) {
                lbFild += lbEmoji + `━ ${Math.floor((vctime/ 60 / 60))} ч, ${Math.floor((vctime / 60) % 60)}м .\n\n`;
            } else {
                lbFild += `━ ${Math.floor((vctime / 60 / 60))} ч, ${Math.floor((vctime / 60) % 60)}м .\n\n`;
            }
            lbPos++;
        }



		var lbEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setDescription("```ТОП-5 по голосовому онлайну:```")
        .addField(`⠀`, `${lbString}`, inline = true)
        //.addField(`⠀`, `━`, inline = true)
        .addField(`⠀`, `${lbFild}`, inline = true)
        //.setImage(`https://images-ext-1.discordapp.net/external/yZbwbJqsqcVdejYUVXqqYgmlYlIout-tCcYizOtXEWE/https/media.discordapp.net/attachments/851143791083257886/851771495691714570/embed.png`)
        message.channel.send(lbEmbed);


	} else if(args[0] == "баланс"){
        let rUser = message.author;

        const results = await balModel.find({}).sort({silverCoins: -1}).limit(5);

        var lbString = "";
        var lbPos = 1;
        var lbEmoji = ""
                var lbFild = ""

        for (let i = 0; i < results.length; i++) {
            const { userID, silverCoins = 0 } = results[i];

            switch (lbPos) {
            case 1:
                lbEmoji = ""
                break;
            case 2:
                lbEmoji = ""
                break;
            case 3:
                lbEmoji = ""
                break;
            default:
                lbEmoji = ""
                break;
            }
            if (lbPos <= 3) {
                lbString += `**${lbPos}.**` + ` <@${userID}>\n\n`;
            } else {
                lbString += `**${lbPos}.**` + ` <@${userID}>\n\n`;
            }
            lbPos++;
        }

        for (let i = 0; i < results.length; i++) {
            const { userID, silverCoins = 0 } = results[i];

            switch (lbPos) {
            case 1:
                lbEmoji = ""
                break;
            case 2:
                lbEmoji = ""
                break;
            case 3:
                lbEmoji = ""
                break;
            default:
                lbEmoji = ""
                break;
            }
            if (lbPos <= 3) {
                lbFild += lbEmoji + `━ ${silverCoins} ${config.silverCoin}\n\n`;
            } else {
                lbFild += `━ ${silverCoins} ${config.silverCoin}\n\n`;
            }
            lbPos++;
        }


        var lbEmbed = new Discord.MessageEmbed()
        .setColor(config.defaultColor)
        .setDescription("```ТОП-5 пользователей по балансу:```")
        .addField(`⠀`, `${lbString}`, inline = true)
        //.addField(`⠀`, `━`, inline = true)
        .addField(`⠀`, `${lbFild}`, inline = true)
        //.setImage(`https://images-ext-1.discordapp.net/external/yZbwbJqsqcVdejYUVXqqYgmlYlIout-tCcYizOtXEWE/https/media.discordapp.net/attachments/851143791083257886/851771495691714570/embed.png`)
        message.channel.send(lbEmbed);
	}
}

module.exports.help = {
	name: "топ"
}