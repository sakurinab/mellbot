const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const dailyModel = require('../schemas/dailySchema.js');
const invModel = require('../schemas/inventorySchema.js');

module.exports.run = async (bot, message, args) => {
    try {
        
        let uid = message.author.id;

        dailyData = await dailyModel.findOne({
            userID: uid
        });
        if (!dailyData) {
            daily = await dailyModel.create({
                userID: uid,
                timeout: 0,
                dailysget: 0,
                lastdaily: 0,
                weekdaily: 1,
            });
            //сохранение документа
            daily.save();
        }

        profileData = await profileModel.findOne({
            userID: uid
        });
        let userCoins = profileData.silverCoins;
        let userLvl = profileData.lvl;
        dailyData = await dailyModel.findOne({
            userID: uid
        });
        let userTimeOut = parseInt(dailyData.timeout);
        let userLastdaily = dailyData.lastdaily;
        let userDailys = dailyData.dailysget;
        let dayof = dailyData.weekdaily;

        let rUser = message.author;
        let timeOut = (43200000 - (Date.now() - userTimeOut));
        const seconds = Math.floor((timeOut / 1000) % 60);
        const minutes = Math.floor((timeOut / 1000 / 60) % 60);
        const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

        if ((Date.now() - userTimeOut > 43200000)) {
            if ((Date.now() - userLastdaily) > 86400000) {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                    dailysget: 0,
                    weekdaily: 1
                });
            }
            if (dayof > 7) {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        dailysget: 1,
                    },
                    $set: {
                        timeout: Date.now(),
                        lastdaily: Date.now(),
                        weekdaily: 1,
                    }
                });
                dayof = 1;
            } else {
                dailyData = await dailyModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        dailysget: 1,
                        weekdaily: 1
                    },
                    $set: {
                        timeout: Date.now(),
                        lastdaily: Date.now()
                    }
                });
            }

            let dailyReward = 60 + (20 * (userDailys + 1));
            let oneXp = Math.floor((100 * userLvl) / 100)

            let dailyEmbed = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle(`Временные награды`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            if (dayof >= 0) {
                dailyEmbed.setDescription(`${rUser}, Вы забрали свои ${dailyReward} ${config.silverCoin}! Возвращайтесь через 12 часов`);
                profileData = await profileModel.updateOne({
                    userID: uid,
                }, {
                    $inc: {
                        silverCoins: dailyReward,
                    }
                });
                //знак отличия
                profileData = await profileModel.findOne({
                    userID: uid
                });
                let achieve = profileData.achievements;
                const exclsName = `"Частый гость"`;
                const exclsEmoji = "🐰";

                let newExclsEmbed = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle(`⸝⸝ ♡₊˚ ${rUser.username} получает знак отличия ${exclsEmoji}!◞`)
                    .setDescription(`${rUser} получил новый знак отличия **${exclsName}**!`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();

                achieveNew = achieve.toString();
                if (!(achieveNew.indexOf(exclsEmoji) > -1)) {
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

            message.channel.send(dailyEmbed);
        } else {
            let dailyEmbedErr = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("Временная награда")
                .setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)
                .setDescription(`${rUser}, Вы уже забрали временную награду!\nВы можете получить следующую через **${hours}**ч. **${minutes}**м. **${seconds}с.**`)

            message.channel.send(dailyEmbedErr);
        }
    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "награда",
    alias: "timely"
};