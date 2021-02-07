
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
const { convertData } = require('../utils/timeconvert');
const superBotHelper = require('../botHelpers/superBotHelpers');
const { parsePhoneNumber } = require('libphonenumber-js');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;


const WizardScene = Scenes.WizardScene;
const askLocationWizzard = new WizardScene(
    "ask_location_info", // Имя сцены
    (ctx) => {
        // ctx.message.text  - введенный текст
        // ctx.reply('Разрешите узнать ваше местоположение ?',);
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
            ctx.reply('Спасибо ваши данные получены Продолжить', Markup.inlineKeyboard([[
                {
                    text: 'OK',
                    callback_data: JSON.stringify({ type: 'begin_ask_phone_info' })
                }
            ]]));
            ctx.scene.enter('ask_phone_info');
        }
    },
    (ctx) => {
        let location = handleRequestLocationButtonPress(ctx);
        if (location) {
            // записываем ее в 
            ctx.session.userLocation = location;
        }
        // start phone dialog
        ctx.scene.enter('ask_phone_info');
    }
);
function handleRequestLocationButtonPress(ctx) {
    if (ctx.update && ctx.update.message) {
        return ctx.update.message.location;
    } else {
        return false;
    }
}
function handleRequestButtonPress(ctx) {
    // update.message
}
function isRequestButtonPressed(ctx) {
    return (ctx.update && ctx.update.message && ctx.update.message.contact);
}


module.exports = {
    askLocationWizzard: askLocationWizzard
}