
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { convertData } = require('../utils/timeconvert');
const superBotHelper = require('../botHelpers/superBotHelpers');
const { parsePhoneNumber } = require('libphonenumber-js');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const { BotApi } = require('../apiinterfaces/ApartmentApi');

const WizardScene = Scenes.WizardScene;
const askLocationWizzard = new WizardScene(
    "ask_location_info", // Имя сцены
    (ctx) => {
        ctx.reply('Добрый день как к вам можно обратиться ?');
        ctx.wizard.next();
    },
    (ctx) => {
        ctx.session.clientName = ctx.message.text;

        ctx.reply('Отлично, ' + ctx.session.clientName + ', какое количество гостей планирует заселиться ?');
        ctx.wizard.next();
    },
    async (ctx) => {
        ctx.session.personsAmount = ctx.message.text;
        try {
            if (!ctx.session.telBotApiService) {
                ctx.session.telBotApiService = new BotApi(process.env.TEL_BOT_API_KEY);
            }

            let { data: responseDate } = await ctx.session.telBotApiService.apartmentsWithGreaterPersonMaxCount(parseInt(ctx.session.personsAmount));
            console.log({ responseDate })
            if (responseDate.status == 'ok') {
                ctx.reply('Разрешите узнать ваше местоположение ?', {
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "one_time_keyboard": true,
                        "keyboard": [[{
                            text: "Разрешить",
                            request_location: true
                        }], ["Нет"]]
                    }
                });
                ctx.wizard.next();
            } else {
                ctx.reply('К сожалению нет подходящей квартиры в которой могло бы поселиться столько гостей, свяжитесь с менеджером по телефону: +74957825240, он  проконсультирует вас по размещению вашего количетсва гостей в ближайшие свободные апартаменты');
                ctx.scene.leave();
            }
        } catch (e) {
            console.log({ ERROR: e })
            ctx.reply('К сожалению нет подходящей квартиры в которой могло бы поселиться столько гостей, свяжитесь с менеджером по телефону: +74957825240, он  проконсультирует вас по размещению вашего количетсва гостей в ближайшие свободные апартаменты');
            ctx.scene.leave();
        }
    },
    (ctx) => {
        let location = handleRequestLocationButtonPress(ctx);
        if (!location) {
            ctx.reply('Разрешите узнать ваше местоположение ?', {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "one_time_keyboard": true,
                    "keyboard": [[{
                        text: "Разрешить",
                        request_location: true
                    }], ["Продолжить без использования текущей локации"]]
                }
            });
            ctx.wizard.next();
        } else {
            // enter ask Phone info
            ctx.session.userLocation = location;

            superBotHelper.startCommands.subwayStart(ctx);
            ctx.scene.enter('subway_and_order');
        }
    },
    (ctx) => {
        let location = handleRequestLocationButtonPress(ctx);
        if (location) {
            // записываем ее в 
            ctx.session.userLocation = location;
            ctx.reply('Спасибо за ваши контакты Продолжить ?', Markup.inlineKeyboard([[{
                text: 'ok',
                callback_data: JSON.stringify({ type: 'ask_phone_info_line' })
            }]]));
            superBotHelper.startCommands.subwayStart(ctx);
            ctx.scene.enter('subway_and_order');

        } else {
            ctx.reply('Подбор вариантов квартир будет без учета вашего текущего местоположения', Markup.inlineKeyboard([[{
                text: 'ok',
                callback_data: JSON.stringify({ type: 'ask_phone_info_line' })
            }]]));
            ctx.wizard.next();
        }
    },
    (ctx) => {

        superBotHelper.startCommands.subwayStart(ctx);
        ctx.scene.enter('subway_and_order');

    }
);
function handleRequestLocationButtonPress(ctx) {
    if (ctx.update && ctx.update.message) {
        return ctx.update.message.location;
    } else {
        return false;
    }
}


module.exports = {
    askLocationWizzard: askLocationWizzard
}