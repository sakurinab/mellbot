const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const profileModel = require('../schemas/profileSchema.js');
const actionModel = require('../schemas/actionSchema.js');

module.exports.run = async (bot, message, args) => {
    try {
        
        //if (!message.member.roles.cache.has('835944422763266139')) return message.channel.send('К сожалению, вы не имеете роль дебаггера, чтобы сделать это.')

        let rUser = message.author;
        let uid = message.author.id;
        let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        let cantOpenNewDialogue = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setDescription(`Сначала закройте Ваше последнее диалогове окно.`)
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setTimestamp();

        let noUser = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Пользователь не найден.`)
        .setTimestamp();

        let urself = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Вы не можете играть сами с собой.`)
        .setTimestamp();

        let wrongBet = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`${rUser}, укажите укажите количество ${config.silverCoin}, которое не меньше 50 ${config.silverCoin} и не больше 1000 ${config.silverCoin}`)
        .setTimestamp();

        let noMoney = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`${rUser}, у Вас нет ${args[1]} ${config.silverCoin}`)
        .setTimestamp();

        let noMoneyMUser = new Discord.MessageEmbed()
        .setColor(`${config.errColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`У пользователя недостаточно серебра, чтобы сделать это.`)
        .setTimestamp();

        let cancel = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`Пользователь **отказался** играть с Вами.`)
        .setTimestamp();

        let ignore = new Discord.MessageEmbed()
        .setColor(`${config.defaultColor}`)
        .setTitle("Дуэли")
        .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
        .setDescription(`${mUser} к сожалению, у вас вышло время на ответ`)
        .setTimestamp();

        if (!mUser || mUser.id == mUser.user.bot) return message.channel.send(noUser);
        
        profileData = await profileModel.findOne({userID: uid});
        let userCoins = profileData.silverCoins;
        profileDataMUser = await profileModel.findOne({userID: mUser.id});
        let mUserCoins = profileDataMUser.silverCoins;

        if (mUser.id === uid) return message.channel.send(urself);
        if (!args[1] || isNaN(args[1]) || args[1] < 0) return message.channel.send(wrongBet);
        bet = parseInt(args[1]);
        if (userCoins < bet) return message.channel.send(noMoney);
        if (mUserCoins < bet) return message.channel.send(noMoneyMUser);

        //не давать открыть диалоговое окно, если прошлое не закрыто

        let confGame = new Discord.MessageEmbed()
            .setColor(`${config.defaultColor}`)
            .setTitle("⸝⸝ ♡₊˚ Кости◞")
            .setDescription(`${mUser}, пользователь ${rUser} предложил поиграть Вам в кости со ставкой в ${bet} ${config.silverCoin}.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        const msg = await message.channel.send(confGame);
        await msg.react("✅");
        await msg.react("❌");
        await msg.awaitReactions((reaction, user) => user.id == mUser.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                max: 1,
                time: 30000
            })
            .then(async collected => {
                if (collected.first().emoji.name == "✅") {
                    msg.reactions.removeAll();

                    profileData = await profileModel.findOne({userID: uid});
                    userCoins = profileData.silverCoins;
                    profileDataMUser = await profileModel.findOne({userID: mUser.id});
                    mUserCoins = profileDataMUser.silverCoins;

                    if (userCoins < bet) return msg.edit(noMoney);
                    if (mUserCoins < bet) return msg.edit(noMoneyMUser);

                    let gameProcess = ``
                    let rUserCount = 0;
                    let mUserCount = 0;

                    let game = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("Дуэли")
                    .setThumbnail(rUser.displayAvatarURL({ dynamic: true }))

                    for (let i = 0; i < 6; i++) {
                        let rand1 = Math.floor(Math.random() * 6) + 1;
                        let rand2 = Math.floor(Math.random() * 6) + 1;

                        let rand3 = Math.floor(Math.random() * 6) + 1;
                        let rand4 = Math.floor(Math.random() * 6) + 1;

                        //gameProcess += '`' + `   ${rand1} и ${rand2}     |     ${rand3} и ${rand4}   ` + '`\n'

                        rUserCount += rand1 + rand2;
                        mUserCount += rand3 + rand4;

                        msg.edit(game.setDescription(gameProcess));
                    }

                    //gameProcess += '`' +  + '`'

                    if (rUserCount > mUserCount) {
                        gameProcess += `${rUser} побеждает ${mUser} и забирает с собой ${bet} ${config.silverCoin}!`

                        profileData = await profileModel.updateOne({
                            userID: rUser.id,
                        }, {
                            $inc: {
                                silverCoins: bet,
                            }
                        });

                        profileData = await profileModel.updateOne({
                            userID: mUser.id,
                        }, {
                            $inc: {
                                silverCoins: -bet,
                            }
                        });
                    } else if (rUserCount < mUserCount) {
                        gameProcess += `${mUser} побеждает ${rUser} и забирает с собой ${bet} ${config.silverCoin}!`

                        profileData = await profileModel.updateOne({
                            userID: mUser.id,
                        }, {
                            $inc: {
                                silverCoins: bet,
                            }
                        });

                        profileData = await profileModel.updateOne({
                            userID: rUser.id,
                        }, {
                            $inc: {
                                silverCoins: -bet,
                            }
                        });
                    } else {
                        gameProcess += `**Ничья!**`
                    }

                    msg.edit(game.setDescription(gameProcess));
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return;
                } else if (collected.first().emoji.name == "❌") {
                    msg.edit(cancel);
                    msg.reactions.removeAll();
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return;
                } else {
                    await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                    return console.log("Ошибка реакции");
                }
            }).catch(async err => {
                msg.delete()
                msg.reactions.removeAll();
                await actionModel.updateOne({ userID: uid }, { $set: {inAction: 0} });
                return;
            });

    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "duel"
};