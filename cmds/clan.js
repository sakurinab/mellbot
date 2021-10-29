//
//  _____       _ _     _                  _                       
// |  __ \     (_) |   | |                | |                      
// | |  \/_   _ _| | __| |   ___ _   _ ___| |_ ___ _ __ ___        
// | | __| | | | | |/ _` |  / __| | | / __| __/ _ \ '_ ` _ \       
// | |_\ \ |_| | | | (_| |  \__ \ |_| \__ \ ||  __/ | | | | |      
//  \____/\__,_|_|_|\__,_|  |___/\__, |___/\__\___|_| |_| |_|      
//                                __/ |                            
//                               |___/                             
//  _              _   __     _     _              _               
// | |            | | / /    (_)   | |            | |              
// | |__  _   _   | |/ / _ __ _ ___| |_ ___  _ __ | |__   ___ _ __ 
// | '_ \| | | |  |    \| '__| / __| __/ _ \| '_ \| '_ \ / _ \ '__|
// | |_) | |_| |  | |\  \ |  | \__ \ || (_) | |_) | | | |  __/ |   
// |_.__/ \__, |  \_| \_/_|  |_|___/\__\___/| .__/|_| |_|\___|_|   
//         __/ |__        __        _____   | |                    
//        |___//  |      /  |      |  _  |  |_|                    
// __   __     `| |      `| |      | |/' |                         
// \ \ / /      | |       | |      |  /| |                         
//  \ V /   _  _| |_  _  _| |_  _  \ |_/ /                         
//   \_/   (_) \___/ (_) \___/ (_)  \___/                          
//
//
const Discord = require('discord.js');
const fs = require('fs');
const derabbit = require('../package.json');
const config = require('../botconfig.json');
//mongoose
const mongoose = require('mongoose');
const clanModel = require('../schemas/clanSchema.js');
const profileModel = require('../schemas/profileSchema.js');
const deposeModel = require('../schemas/clanDepositSchema.js');
//цены
const clanCost = 50000;
const lvlMultiCost = 70000;
const coinMultiCost = 100000;
const xplvlmult = 4320;
const clanDepositLimit = 15000;
const deposeCooldown = 43200000; //ms
const setColorCost = 5000;
const clanDescCost = 5000;
const clanSymbolCost = 15000;
const clanSetImageCost = 30000;
const clanRenameCost = 10000;
const clanSlotsCost = 60000;

function isHexColor(h) {
    var a = parseInt(h, 16);
    return (a.toString(16) === h)
}

module.exports.run = async (bot, message, args) => {
    try {
        let rUser = message.author;
        let uid = message.author.id;
        let mUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));

        profileData = await profileModel.findOne({
            userID: uid
        });
        let userCoins = profileData.silverCoins;
        let userClan = profileData.clan;

        //Основные эмбеды
        let systemInfo = new Discord.MessageEmbed()
            .setColor(`${config.defaultColor}`)
            .setTitle("⸝⸝ ♡₊˚ Система◞")
            .setDescription(`Информация о системе кланов:`)
            .addField(`Автор: `, '```' + `Kristopher` + '```', inline = true)
            .addField(`Версия: `, '```' + `1.1.0` + '```', inline = true)
            .addField(`Обновлено: `, '```' + `01.05.2021` + '```', inline = true)
            .addField(`Сервер: `, '```' + `Derabbit` + '```', inline = true)
            .setFooter(`© Dead Rabbit ☕ by Kristopher`)
            .setTimestamp();

        let userNoMember = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Данный пользователь не является участником Вашего клана.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let errorCoins = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Недостаточно серебра.\nВаш баланс: ${userCoins} ${config.silverCoin}`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let notInClan = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`К сожалению, Вы не состоите в клане.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noOwnClan = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`К сожалению, Вы не владеете кланом.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noPerms = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы не являетесь офицером или владельцем клана, чтобы сделать это.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let cancel = new Discord.MessageEmbed()
            .setColor(`${config.defaultColor}`)
            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
            .setDescription(`Действие было отменено.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noMUser = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Укажите пользователя.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let urself = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы не можете сделать это на себе.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let userInClan = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Пользователь уже находится в клане.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noArgMoney = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы забыли указать количество монет.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let invalidHex = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Неверно указан цвет.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noClanMoney = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`На балансе клана не хватает денег.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noNameArg = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы забыли указать имя клана.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noDescArg = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы забыли указать описание клана.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noSymbArg = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Вы забыли указать символ(ы) клана.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let noBannerLink = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Ссылка на баннер указана неверно.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let invalidBannerLink = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
            .setDescription(`Ссылка на баннер клана указана неверно.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        let kernelError = new Discord.MessageEmbed()
            .setColor(`${config.errColor}`)
            .setTitle("⸝⸝ X ₊˚ Критическая ошибка◞")
            .setDescription(`Информация о Вашем клане отсутствует в базе данных. Пожалуйста, обратитесь к администрации сервера.`)
            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
            .setTimestamp();

        if (!args[0]) {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                name: userClan
            });
            if (!clanData) return message.channel.send(kernelError);
            let clanName = clanData.name;
            let clanMembers = clanData.members;
            if (clanMembers <= 0) clanMembers = [];
            let clanRole = clanData.clanRole;
            let clanOwner = clanData.userID;
            let clanOfficers = clanData.officers;
            if (clanOfficers <= 0) clanOfficers = [];
            let clanDescription = clanData.description;
            let clanLvl = clanData.level;
            let clanXp = clanData.xp;
            let clanMoney = clanData.balance;
            let clanBanner = clanData.banner;
            let clanPrize = clanData.prize;
            let clanSign = clanData.clanSign;
            let clanCreated = clanData.clanCreateDate;
            let clanSlots = clanData.clanSlots;
            let clanColor = message.guild.roles.cache.get(clanRole).color;
            if(clanColor = "#000000"){
                clanColor = "#2f3136"
            }

            var dateStamp = new Date(clanCreated),
                createDate = [dateStamp.getDate(),
                    dateStamp.getMonth() + 1,
                    dateStamp.getFullYear()
                ].join('/') + ' ' + [dateStamp.getHours(),
                    dateStamp.getMinutes()
                ].join(':');

            let memberAmount = clanMembers.length + clanOfficers.length;

            let membersField = "Нет";
            if (clanMembers.length > 0) {
                membersField = "";
                clanMembers.slice(-7).forEach(async user => {
                    membersField += `<@${user.memberID}>\n`
                })
                if ((clanMembers.length - 7) > 0) {
                    membersField += `И ${clanMembers.length-7} ещё...`
                }
            }
            let officersField = "Нет";
            if (clanOfficers.length > 0) {
                officersField = "";
                clanOfficers.slice(-7).forEach(async user => {
                    officersField += `<@${user.memberID}>\n`
                })
                if ((clanOfficers.length - 7) > 0) {
                    officersField += `И ${clanOfficers.length-7} ещё...`
                }
            }

            let isBanner = "Да";
            if (clanBanner == "" || clanBanner == " " || clanBanner == null) {
                isBanner = "Нет";
            }

            let coinBoost = clanData.coinMultiply;
            let lvlBoost = clanData.lvlMultiply;

            var clanDataEmbed = new Discord.MessageEmbed()
                .setColor("#2f3136")
                .setTitle("Посмотреть информацию о личной комнате")
                .setDescription(`Роль: <@&${clanRole}>\nВладелец: <@${clanOwner}>`)
                .addField(`Описание`, "```" + `${clanDescription}` + "```", inline = false)
                .addField(`Комната`, "```" + `・${clanName}` + "```", inline = true)
                .addField(`Уровень`, "```" + `${clanLvl} ( ${clanXp}/${xplvlmult * clanLvl * Math.floor(memberAmount/2)} )` + "```", inline = true)
                .addField(`Участников`, "```" + `${memberAmount}/${clanSlots}` + "```", inline = true)
                .setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)



                //.setColor(clanColor)
                //.setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                //.setDescription(`**⸝⸝ ♡₊˚ Клан : <@&${clanRole}> ${clanSign}◞**\n${clanDescription}`)
                //.addField(`👤 Кол-во слотов`, '```' + `${memberAmount}/${clanSlots}` + '```', inline = true)
                //.addField(`🏆 Трофеи`, '```' + `${clanPrize}` + '```', inlite = true)
                //.addField(`📆 Дата основания`, '```' + `${createDate}` + '```', inline = true)
                //.addField(`🌟 Уровень`, '```' + `${clanLvl}` + '```', inline = true)
                //.addField(`⭐ Опыт`, '```' + `${clanXp}/${xplvlmult * clanLvl * Math.floor(memberAmount/2)}` + '```', inline = true)
                //.addField(`${config.silverCoin} Баланс`, '```' + `${clanMoney}` + '```', inlite = true)
                //.addField(`☄️ Буст серебра`, '```' + `x${coinBoost}` + '```', inlite = true)
                //.addField(`🎴 Баннер`, '```' + `${isBanner}` + '```', inlite = true)
                //.addField(`🔮 Буст уровня`, '```' + `x${lvlBoost}` + '```', inlite = true)
                //.addField(`୨୧ ・ Основатель:`, `<@${clanOwner}>`, inline = true)
                //.addField(`୨୧ ・ Офицеры:`, `${officersField}`, inline = true)
                //.addField(`୨୧ ・ Участники:`, `${membersField}`, inline = true)
                //.setTimestamp();

            if (!(clanBanner == "" || clanBanner == " " || clanBanner == null)) {
                clanDataEmbed.setImage(clanBanner);
            }

            message.channel.send(clanDataEmbed);

        } else if (args[0] == "create") {
            //if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Прости, <@${message.author.id}>, но данная функция в разработке. Данная команда доступна только <@817082114674917416>`);
            clanName = args.slice(1).join(' ').replace(/[^a-zа-яA-ZА-Я0-9 ]/g, "");
            if (!clanName || clanName.length <= 2 || clanName.length > 48) return message.channel.send(noNameArg);
            let clanExist = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Клан '${clanName}' уже существует. Попробуйте придумать другое имя.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (!(message.guild.roles.cache.find(x => x.name.toLowerCase() === clanName.toLowerCase()) == undefined)) return message.channel.send(clanExist);
            if (userCoins < clanCost) return message.channel.send(errorCoins);
            let youInClan = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Для того, чтобы создать свой клан - покиньте текущий.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (!(userClan == "" || userClan == " " || userClan == null || userClan == "Нет")) return message.channel.send(youInClan);

            let confCreate = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите создать клан '${clanName}' за ${clanCost} ${config.silverCoin}?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            const msg = await message.channel.send(confCreate);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 60000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanData = await clanModel.findOne({
                            userID: uid
                        });
                        if (!clanData) {
                            clan = await clanModel.create({
                                userID: uid,
                                balance: 0,
                                clanCreateDate: Date.now(),
                                description: config.clanDescription,
                                lvlMultiply: 1,
                                coinMultiply: 1,
                                banner: "",
                                name: clanName,
                                level: 1,
                                xp: 0,
                                prize: 0,
                                clanSign: "",
                                clanSlots: 10,
                            });
                            //сохранение документа
                            clan.save();
                        }
                        message.guild.roles.create({
                            data: {
                                name: clanName,
                                position: 55,
                            },
                        }).then(async role => {
                            message.member.roles.add(role);
                            message.member.roles.add(config.clanLeaderRole);
                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid
                            }, {
                                clanRole: role.id
                            });
                        }).catch(console.error);

                        profileData = await profileModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            silverCoins: profileData.silverCoins - clanCost,
                            clan: clanName,
                        });

                        message.guild.channels.create(`・` + clanName, {
                            type: 'voice',
                            userLimit: 10,
                            parent: config.clanCategory,
                            permissionOverwrites: [{
                                id: uid,
                                allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                            }, {
                                id: config.everyoneID,
                                deny: ['CONNECT', 'SPEAK'],
                            }]
                        }).then(async voice => {
                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                clanVoice: voice.id,
                            });
                            message.guild.channels.create(`・` + clanName, {
                                type: 'text',
                                parent: config.clanCategory,
                                permissionOverwrites: [{
                                    id: uid,
                                    allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']
                                }, {
                                    id: config.everyoneID,
                                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                }]
                            }).then(async chat => {
                                clanData = await clanModel.findOneAndUpdate({
                                    userID: uid,
                                }, {
                                    clanChat: chat.id,
                                });
                            })
                        })

                        let clanCreateSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Клан '${clanName}' был успешно сформирован!\n\nВаш баланс: ${userCoins - clanCost} ${config.silverCoin}`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(clanCreateSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });

        } else if (args[0] == "delete") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;
            let clanRoleId = clanData.clanRole;
            let clanName = clanData.name;
            let clanChat = clanData.clanChat;
            let clanVoice = clanData.clanVoice;

            let confDelete = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите удалить свой клан <@&${clanRoleId}>?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confDelete);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanDeleteResponce = await clanModel.deleteOne({
                            userID: uid
                        });

                        profileData = await profileModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            clan: "Нет",
                        });

                        if (clanMembers.length > 0) {
                            clanMembers.forEach(async user => {
                                profileData = await profileModel.findOneAndUpdate({
                                    userID: user.memberID,
                                }, {
                                    clan: "Нет",
                                });
                            })
                        }
                        if (clanOfficers.length > 0) {
                            clanOfficers.forEach(async user => {
                                profileData = await profileModel.findOneAndUpdate({
                                    userID: user.memberID,
                                }, {
                                    clan: "Нет",
                                });
                                bot.guilds.cache.get(config.serverId).members.cache.get(user.memberID).roles.remove(config.clanOfficerRole);
                            })
                        }

                        message.member.roles.remove(config.clanLeaderRole);

                        message.guild.roles.cache.get(clanRoleId).delete();

                        bot.channels.cache.get(clanChat).delete();
                        bot.channels.cache.get(clanVoice).delete();

                        let deleteSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Клан '${clanName}' был успешно удалён!`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(deleteSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit("ignore");
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "invite") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                name: userClan
            });
            if (!clanData) return message.channel.send(kernelError);
            if (!(message.member.roles.cache.has(config.clanOfficerRole) || message.member.roles.cache.has(config.clanLeaderRole))) return message.channel.send(noPerms);
            if (!mUser || mUser.user.bot) return message.channel.send(noMUser);
            if (mUser == uid) return message.channel.send(urself);

            profileDataMUser = await profileModel.findOne({
                userID: mUser.id
            });
            let mUserClan = profileDataMUser.clan;
            if (!(mUserClan == "" || mUserClan == " " || mUserClan == null || mUserClan == "Нет")) return message.channel.send(userInClan);

            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;
            let clanRoleId = clanData.clanRole;
            let clanName = clanData.name;
            let clanChat = clanData.clanChat;
            let clanVoice = clanData.clanVoice;

            let clanInvite = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("Пригласить пользователя в личную комнату")
                .setDescription(`${mUser}, ${rUser} приглашает вас в личную комнату <@&${clanRoleId}>!`)
                .setThumbnail(`${rUser.displayAvatarURL({dynamic: true})}`)

            const msg = await message.channel.send(clanInvite);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == mUser.id && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        profileData = await profileModel.findOneAndUpdate({
                            userID: mUser.id,
                        }, {
                            clan: clanName,
                        });

                        let newMember = {
                            memberID: mUser.id
                        };

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            $push: {
                                members: newMember,
                            }
                        });

                        bot.channels.cache.get(clanVoice).updateOverwrite(mUser.id, {
                            CONNECT: true,
                            SPEAK: true
                        });
                        bot.channels.cache.get(clanChat).updateOverwrite(mUser.id, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true
                        });

                        mUser.roles.add(clanRoleId);

                        let clanInviteSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`${mUser}, теперь Вы участник клана <@&${clanRoleId}>!`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(clanInviteSuccess);
                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        let clanInviteCancel = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`${mUser} отказался вступить в клан <@&${clanRoleId}>`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(clanInviteCancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });

        } else if (args[0] == "kick") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                name: userClan
            });
            if (!clanData) return message.channel.send(kernelError);
            if (!(message.member.roles.cache.has(config.clanOfficerRole) || message.member.roles.cache.has(config.clanLeaderRole))) return message.channel.send(noPerms);
            if (!mUser) return message.channel.send(noMUser);
            if (mUser == uid) return message.channel.send(urself);

            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;
            let roleId = clanData.clanRole;
            let clanName = clanData.name;
            let clanChat = clanData.clanChat;
            let clanVoice = clanData.clanVoice;

            let membersArray = clanMembers;
            let officersArray = clanOfficers;

            let indexMember = membersArray.findIndex(x => x.memberID === mUser.id);
            let indexOfficer = officersArray.findIndex(x => x.memberID === mUser.id);

            if (indexMember == -1 && indexOfficer == -1) return message.channel.send(userNoMember);

            let confKick = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("Забрать доступ в личную комнату")
                .setDescription(`Вы уверены, что хотите выгнать ${mUser} из клана?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confKick);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        profileData = await profileModel.findOneAndUpdate({
                            userID: mUser.id,
                        }, {
                            clan: "Нет",
                        });

                        if (indexMember > -1) {
                            membersArray.splice(indexMember, 1);
                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                members: membersArray,
                            });
                        } else {
                            officersArray.splice(indexOfficer, 1);
                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                officers: officersArray,
                            });
                            bot.guilds.cache.get(config.serverId).members.cache.get(mUser.id).roles.remove(config.clanOfficerRole);
                        }

                        bot.channels.cache.get(clanVoice).permissionOverwrites.get(mUser.id).delete();
                        bot.channels.cache.get(clanChat).permissionOverwrites.get(mUser.id).delete();

                        message.guild.members.cache.get(mUser.id).roles.remove(roleId);

                        let userKickSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("Забрать доступ в личную комнату")
                            .setDescription(`${rUser}, ${mUser} теперь **не** является **членом** этой **личной комнаты**`)
                            .setThumbnail(rUser.displayAvatarURL({dynamic: true}))


                        msg.edit(userKickSuccess)

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "leave") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                name: userClan
            });
            if (!clanData) return message.channel.send(kernelError);

            let clanName = clanData.name;
            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;
            let roleId = clanData.clanRole;

            let confLeave = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите покинуть клан <@&${roleId}>`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confLeave);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        let membersArray = clanMembers;
                        let officersArray = clanOfficers;
                        let clanChat = clanData.clanChat;
                        let clanVoice = clanData.clanVoice;

                        let indexMember = membersArray.findIndex(x => x.memberID === uid);
                        let indexOfficer = officersArray.findIndex(x => x.memberID === uid);

                        profileData = await profileModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            clan: "Нет",
                        });

                        if (indexMember > -1) {
                            membersArray.splice(indexMember, 1);
                            clanData = await clanModel.findOneAndUpdate({
                                name: clanName,
                            }, {
                                members: membersArray,
                            });
                        } else {
                            officersArray.splice(indexOfficer, 1);
                            clanData = await clanModel.findOneAndUpdate({
                                name: clanName,
                            }, {
                                officers: officersArray,
                            });
                            bot.guilds.cache.get(config.serverId).members.cache.get(uid).roles.remove(config.clanOfficerRole);
                        }


                        bot.channels.cache.get(clanVoice).permissionOverwrites.get(uid).delete();
                        bot.channels.cache.get(clanChat).permissionOverwrites.get(uid).delete();

                        message.guild.members.cache.get(uid).roles.remove(roleId);

                        let leaveSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Вы покинули клан <@&${roleId}>`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(leaveSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "officer") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            if (!mUser) return message.channel.send(noMUser);
            if (mUser == uid) return message.channel.send(urself);

            let clanName = clanData.name;
            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;

            let membersArray = clanMembers;
            let officersArray = clanOfficers;

            let indexMember = membersArray.findIndex(x => x.memberID === mUser.id);
            let indexOfficer = officersArray.findIndex(x => x.memberID === mUser.id);

            if (indexMember == -1 && indexOfficer == -1) return message.channel.send(userNoMember);
            if (indexOfficer > -1) {
                officersArray.splice(indexMember, 1);

                membersArray.push({
                    memberID: mUser.id
                })

                clanData = await clanModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    members: membersArray,
                });

                clanData = await clanModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    officers: officersArray,
                });

                bot.guilds.cache.get(config.serverId).members.cache.get(mUser.id).roles.remove(config.clanOfficerRole);

                let notOffAnymore = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                    .setDescription(`${mUser} больше не является офицером клана.`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();

                message.channel.send(notOffAnymore);
            } else {
                membersArray.splice(indexMember, 1);
                officersArray.push({
                    memberID: mUser.id
                })

                clanData = await clanModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    members: membersArray,
                });

                clanData = await clanModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    officers: officersArray,
                });

                bot.guilds.cache.get(config.serverId).members.cache.get(mUser.id).roles.add(config.clanOfficerRole);

                let nowOfficer = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                    .setDescription(`${mUser} теперь является офицером клана.`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();

                message.channel.send(nowOfficer);
            }
        } else if (args[0] == "deposit" || args[0] == "dep") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                name: userClan
            });
            if (!clanData) return message.channel.send(kernelError);
            deposeData = await deposeModel.findOne({
                userID: uid
            });
            if (!deposeData) {
                depose = await deposeModel.create({
                    userID: uid,
                    deposed: 0,
                    lastDepose: 0,
                });
                //сохранение документа
                depose.save();
            }
            if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(noArgMoney);

            let moneyToDeposit = parseInt(args[1]);

            if (userCoins < moneyToDeposit) return message.channel.send(errorCoins);
            deposeData = await deposeModel.findOne({
                userID: uid
            });
            let clanDeposed = deposeData.deposed;
            let clanLastDepose = deposeData.lastDepose;

            let timeOut = deposeCooldown - (Date.now() - clanLastDepose);

            const seconds = Math.floor((timeOut / 1000) % 60);
            const minutes = Math.floor((timeOut / 1000 / 60) % 60);
            const hours = Math.floor((timeOut / 1000 / 60 / 60) % 24);

            let timeoutDeposit = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уже вложили в клан ${clanDepositLimit} ${config.silverCoin} за последние 12 часов.\n\nДо следующего пополнения баланса клана: **${hours}ч. ${minutes}м. ${seconds}с.**`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            if (clanDeposed >= clanDepositLimit && (Date.now() - clanLastDepose) < deposeCooldown) return message.channel.send(timeoutDeposit);

            if ((Date.now() - clanLastDepose) > deposeCooldown) {
                clanDeposed = 0;
            }

            if ((clanDeposed + moneyToDeposit) > clanDepositLimit) {
                moneyToDeposit = clanDepositLimit - clanDeposed;
            }

            clanData = await clanModel.findOneAndUpdate({
                name: userClan,
            }, {
                balance: clanData.balance + moneyToDeposit,
            });

            profileData = await profileModel.findOneAndUpdate({
                userID: uid,
            }, {
                silverCoins: profileData.silverCoins - moneyToDeposit,
            });

            if ((Date.now() - clanLastDepose) > deposeCooldown) {
                deposeData = await deposeModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    deposed: moneyToDeposit,
                    lastDepose: Date.now(),
                });
            } else {
                deposeData = await deposeModel.findOneAndUpdate({
                    userID: uid,
                }, {
                    deposed: deposeData.deposed + moneyToDeposit,
                    lastDepose: Date.now(),
                });
            }

            let deposedEmbed = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы пополнили баланс клана на ${moneyToDeposit} ${config.silverCoin}\n\nВаш баланс: ${userCoins-moneyToDeposit} ${config.silverCoin}`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            message.channel.send(deposedEmbed);
        } else if (args[0] == "color" || args[0] == "sc") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            if (!args[1] || isHexColor(args.slice(1).join(' '))) return message.channel.send(invalidHex);
            let clanBalance = clanData.balance;
            if (clanBalance < setColorCost) return message.channel.send(noClanMoney);
            let clanRoleId = clanData.clanRole;
            let newColor = args.slice(1).join(' ');

            let confColor = new Discord.MessageEmbed()
                .setColor(newColor)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите установить цвет клана на ${newColor}?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confColor);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        message.guild.roles.cache.get(clanRoleId).setColor(newColor);

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            balance: clanData.balance - setColorCost,
                        });

                        let colorSuccess = new Discord.MessageEmbed()
                            .setColor(newColor)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Новый цвет клана <@&${clanRoleId}> установлен.`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(colorSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "rename") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            if (!args[1]) return message.channel.send(noNameArg);
            let nameInvalid = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Новое имя клана длиннее 48 символов.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (args.slice(1).join(' ').replace(/[^a-zA-Z ]/g, "").length > 48) return message.channel.send(nameInvalid);
            let clanExist = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Клан '${args.slice(1).join(' ')}' уже существует. Попробуйте придумать другое имя.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (!(message.guild.roles.cache.find(x => x.name.toLowerCase() === args.slice(1).join(' ').toLowerCase() || x.name.replace(/\s/g, '-').toLowerCase() === args.slice(1).join(' ').toLowerCase()) == undefined)) return message.channel.send(clanExist);

            let clanBalance = clanData.balance;
            let clanName = clanData.name;
            let clanRoleId = clanData.clanRole;
            let clanMembers = clanData.members;
            let clanOfficers = clanData.officers;
            let clanChat = clanData.clanChat;
            let clanVoice = clanData.clanVoice;

            if (clanBalance < clanRenameCost) return message.channel.send(noClanMoney);
            let newName = args.slice(1).join(' ').replace(/[^a-zA-Z ]/g, "");

            let confRename = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите переименовать свой клан в '${newName}'?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confRename);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            balance: clanData.balance - clanRenameCost,
                            name: newName,
                        });

                        message.guild.roles.cache.get(clanRoleId).setName(newName);

                        bot.channels.cache.get(clanVoice).setName(newName);
                        bot.channels.cache.get(clanChat).setName(newName);

                        profileData = await profileModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            clan: newName,
                        });

                        if (clanMembers.length > 0) {
                            clanMembers.forEach(async user => {
                                profileData = await profileModel.findOneAndUpdate({
                                    userID: user.memberID,
                                }, {
                                    clan: newName,
                                });
                            })
                        }
                        if (clanOfficers.length > 0) {
                            clanOfficers.forEach(async user => {
                                profileData = await profileModel.findOneAndUpdate({
                                    userID: user.memberID,
                                }, {
                                    clan: newName,
                                });
                            })
                        }

                        let renameSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Клан был переименован. Теперь клан называется <@&${clanRoleId}>`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(renameSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "description" || args[0] == "desc") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanDesc = args.slice(1).join(' ');
            if (!clanDesc || clanDesc.length <= 0) return message.channel.send(noDescArg);
            let descriptionInvalid = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Описание клана длиннее 512 символов.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (args.slice(1).join(' ').length > 512) return message.channel.send(descriptionInvalid);
            let clanBalance = clanData.balance;
            if (clanBalance < clanDescCost) return message.channel.send(noClanMoney);

            let confDesc = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите установить описание клана на: ${clanDesc}?`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confDesc);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            balance: clanData.balance - clanDescCost,
                            description: clanDesc
                        });

                        let clanDescEmbed = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Описание клана теперь: ${clanDesc}`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(clanDescEmbed)

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "symbol" || args[0] == "sym") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanSymbol = args.slice(1).join(' ').replace(/[a-zA-Z0-9 `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
            if (!clanSymbol || clanSymbol.length <= 0 || clanSymbol.length > 8) return message.channel.send(noSymbArg);
            let clanBalance = clanData.balance;
            if (clanBalance < clanSymbolCost) return message.channel.send(noClanMoney);

            let confSymbol = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Вы уверены, что хотите установить символ клана на: ${clanSymbol}`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confSymbol);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            balance: clanData.balance - clanSymbolCost,
                            clanSign: clanSymbol,
                        });

                        let symbolSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Символом клана теперь является: ${clanSymbol}`)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(symbolSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "banner") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanBalance = clanData.balance;
            let clanLvl = clanData.level;
            let lvltwoonly = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Установить баннер клана можно начиная со второго уровня.\n\nУровень вашего клана: ${clanLvl}`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (clanLvl < 2) return message.channel.send(lvltwoonly);
            if (clanBalance < clanSetImageCost) return message.channel.send(noClanMoney);
            if (!args[1]) return message.channel.send(noBannerLink);
            let newBanner = args[1];
            if (message.content.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) == null) return message.channel.send(invalidBannerLink);

            let confBanner = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`❕` + "`" + `Перед установкой баннера убедитесь, что ваша ссылка работает.` + "`\n" + `❕` + "`" + `Рекомендуемый размер баннера: 540x200 и более.` + "`" + `\n\nВы уверены, что хотите установить баннер клана?`)
                .setImage(newBanner)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            const msg = await message.channel.send(confBanner);
            await msg.react("✅");
            await msg.react("❌");
            await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                    max: 1,
                    time: 30000
                })
                .then(async collected => {
                    if (collected.first().emoji.name == "✅") {
                        msg.reactions.removeAll();

                        clanData = await clanModel.findOneAndUpdate({
                            userID: uid,
                        }, {
                            balance: clanData.balance - clanSetImageCost,
                            banner: newBanner,
                        });

                        let bannerSuccess = new Discord.MessageEmbed()
                            .setColor(`${config.defaultColor}`)
                            .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                            .setDescription(`Баннер клана был успешно установлен!`)
                            .setImage(newBanner)
                            .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                            .setTimestamp();

                        msg.edit(bannerSuccess);

                        return;
                    } else if (collected.first().emoji.name == "❌") {
                        msg.edit(cancel);
                        msg.reactions.removeAll();
                        return;
                    } else {
                        return console.log("Ошибка реакции");
                    }
                }).catch(async err => {
                    msg.edit(cancel);
                    console.log("It's fine... " + err);
                    msg.reactions.removeAll();
                    return;
                });
        } else if (args[0] == "perks" || args[0] == "perk") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanCoinBoost = clanData.coinMultiply;
            let clanLvlBoost = clanData.lvlMultiply;
            let clanSlots = clanData.clanSlots;

            let perksEmbed = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`**Перки кланов**\n**Индекс:** *1*\n**Название:** Буст серебра +100%\n**Описание:** Увеличивает количество получаемого серебра для участников клана в N раз.\n**Цена:** ${coinMultiCost*clanCoinBoost} ${config.silverCoin}\n\n**Индекс:** *2*\n**Название:** Буст опыта +100%\n**Описание:** Увеличивает количество получаемого опыта для участников клана в N раз.\n**Цена:** ${lvlMultiCost*clanLvlBoost} ${config.silverCoin}\n\n**Индекс:** *3*\n**Название:** +5 слотов в клан\n**Описание:** Увеличивает общее количество слотов в клане на 5.\n**Цена:** ${clanSlotsCost * Math.floor(clanSlots/10)} ${config.silverCoin}`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            message.channel.send(perksEmbed);
        } else if (args[0] == "upgrade") {
            if (userClan == "" || userClan == " " || userClan == null || userClan == "Нет") return message.channel.send(notInClan);
            clanData = await clanModel.findOne({
                userID: uid
            });
            if (!clanData) return message.channel.send(noOwnClan);
            let clanLvl = clanData.level;
            let lvlthreeonly = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`Покупать перки клана можно начиная с третьего уровня.\n\nУровень вашего клана: ${clanLvl}`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (clanLvl < 3) return message.channel.send(lvlthreeonly);

            let noIndexUp = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Индекс улучшения не указан.`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

            if (!args[1] || isNaN(args[1]) || (args[1] <= 0)) return message.channel.send(noIndexUp);
            let index = args[1];
            let invalidIndexUp = new Discord.MessageEmbed()
                .setColor(`${config.errColor}`)
                .setTitle("⸝⸝ ♡₊˚ Ошибка◞")
                .setDescription(`Индекс улучшения не может быть больше 3`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();
            if (index > 3) return message.channel.send(invalidIndexUp);
            let clanCoinBoost = clanData.coinMultiply;
            let clanLvlBoost = clanData.lvlMultiply;
            let clanBalance = clanData.balance;
            if (index == 1) {
                if (clanBalance < (coinMultiCost * clanCoinBoost)) return message.channel.send(noClanMoney);
                let confCoinBoost = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                    .setDescription(`Вы уверены, что хотите улучшить буст серебра до уровня ${clanCoinBoost+1}?`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();
                const msg = await message.channel.send(confCoinBoost);
                await msg.react("✅");
                await msg.react("❌");
                await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                        max: 1,
                        time: 30000
                    })
                    .then(async collected => {
                        if (collected.first().emoji.name == "✅") {
                            msg.reactions.removeAll();

                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                balance: clanData.balance - (coinMultiCost * clanCoinBoost),
                                $inc: {
                                    coinMultiply: 1,
                                }
                            });

                            let coinBoostSuccess = new Discord.MessageEmbed()
                                .setColor(`${config.defaultColor}`)
                                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                                .setDescription(`Буст серебра был улучшен до уровня ${clanCoinBoost+1}.`)
                                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                                .setTimestamp();
                            msg.edit(coinBoostSuccess);

                            return;
                        } else if (collected.first().emoji.name == "❌") {
                            msg.edit(cancel);
                            msg.reactions.removeAll();
                            return;
                        } else {
                            return console.log("Ошибка реакции");
                        }
                    }).catch(async err => {
                        msg.edit(cancel);
                        console.log("It's fine... " + err);
                        msg.reactions.removeAll();
                        return;
                    });
            } else if (index == 2) {
                if (clanBalance < (lvlMultiCost * clanLvlBoost)) return message.channel.send(noClanMoney);
                let confLevelBoost = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                    .setDescription(`Вы уверены, что хотите улучшить буст опыта до уровня ${clanLvlBoost+1}?`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();
                const msg = await message.channel.send(confLevelBoost);
                await msg.react("✅");
                await msg.react("❌");
                await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                        max: 1,
                        time: 30000
                    })
                    .then(async collected => {
                        if (collected.first().emoji.name == "✅") {
                            msg.reactions.removeAll();

                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                balance: clanData.balance - (lvlMultiCost * clanLvlBoost),
                                $inc: {
                                    lvlMultiply: 1,
                                }
                            });

                            let levelBoostSuccess = new Discord.MessageEmbed()
                                .setColor(`${config.defaultColor}`)
                                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                                .setDescription(`Буст опыта был улучшен до уровня ${clanLvlBoost+1}.`)
                                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                                .setTimestamp();

                            msg.edit(levelBoostSuccess);

                            return;
                        } else if (collected.first().emoji.name == "❌") {
                            msg.edit(cancel);
                            msg.reactions.removeAll();
                            return;
                        } else {
                            return console.log("Ошибка реакции");
                        }
                    }).catch(async err => {
                        msg.edit(cancel);
                        console.log("It's fine... " + err);
                        msg.reactions.removeAll();
                        return;
                    });
            } else if (index == 3) {
                let clanSlots = clanData.clanSlots;
                if (clanBalance < (clanSlotsCost * (clanSlots / 10))) return message.channel.send(noClanMoney);
                let confSlots = new Discord.MessageEmbed()
                    .setColor(`${config.defaultColor}`)
                    .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                    .setDescription(`Вы уверены, что хотите купить дополнительные 5 слотов в клан?`)
                    .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                    .setTimestamp();
                const msg = await message.channel.send(confSlots);
                await msg.react("✅");
                await msg.react("❌");
                await msg.awaitReactions((reaction, user) => user.id == uid && (reaction.emoji.name == "✅" || reaction.emoji.name == "❌"), {
                        max: 1,
                        time: 30000
                    })
                    .then(async collected => {
                        if (collected.first().emoji.name == "✅") {
                            msg.reactions.removeAll();

                            clanData = await clanModel.findOneAndUpdate({
                                userID: uid,
                            }, {
                                balance: clanData.balance - (clanSlotsCost * Math.floor(clanSlots / 10)),
                                $inc: {
                                    clanSlots: 5,
                                }
                            });

                            let slotsSuccess = new Discord.MessageEmbed()
                                .setColor(`${config.defaultColor}`)
                                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                                .setDescription(`Были куплены новые 5 слотов в клан. Теперь в клане ${clanSlots+5} мест.`)
                                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                                .setTimestamp();

                            msg.edit(slotsSuccess);

                            return;
                        } else if (collected.first().emoji.name == "❌") {
                            msg.edit(cancel);
                            msg.reactions.removeAll();
                            return;
                        } else {
                            return console.log("Ошибка реакции");
                        }
                    }).catch(async err => {
                        msg.edit(cancel);
                        console.log("It's fine... " + err);
                        msg.reactions.removeAll();
                        return;
                    });
            }
        } else {
            let clanHelpEmbed = new Discord.MessageEmbed()
                .setColor(`${config.defaultColor}`)
                .setTitle("⸝⸝ ♡₊˚ Кланы◞")
                .setDescription(`**.clan** - информация о клане\n**.clan help** - данное сообщение\n**.clan create <название клана>** - создать клан за ${clanCost} ${config.silverCoin}\n**.clan delete** - удалить клан\n**.clan invite <@пользователь>** - пригласить пользователя в клан\n**.clan kick <@пользователь>** - выгнать пользователя из клана\n**.clan leave** - покинуть клан\n**.clan officer <@пользователь>** - назначить/убрать пользователя на/с должность(-и) офицер(-а)\n**.clan deposit <1-15000>** - пополнить счёт клана\n**.clan color <hex>** - установить цвет клана за ${setColorCost} ${config.silverCoin}\n**.clan symbol <emoji>** - установить символ(ы) клана за ${clanSymbolCost} ${config.silverCoin}\n**.clan description <описание>** - установить описание клана за ${clanDescCost} ${config.silverCoin}\n**.clan banner <ссылка>** - установить баннер клана за ${clanSetImageCost} ${config.silverCoin}\n**.clan rename <название клана>** - переименовать клан за ${clanRenameCost} ${config.silverCoin}\n**.clan perks** - посмотреть возможные улучшения для клана и их цены\n**.clan upgrade <индекс>** - улучшить клан`)
                .setFooter(`${rUser.username}`, `${rUser.displayAvatarURL({dynamic: true})}`)
                .setTimestamp();

           // message.channel.send(clanHelpEmbed);
        }

    } catch (err) {
        if (err.name === "ReferenceError")
            console.log("У вас ошибка")
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};

module.exports.help = {
    name: "rвцфвцфвцфoom"
};