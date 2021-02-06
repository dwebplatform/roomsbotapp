
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
const { convertData } = require('../utils/timeconvert');
const superBotHelper = require('../botHelpers/superBotHelpers');
const { parsePhoneNumber } = require('libphonenumber-js');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;


const WizardScene = Scenes.WizardScene;
const askPhoneWizzard = new WizardScene(
    "ask_phone_info", // Имя сцены
    (ctx) => {
        // ctx.message.text  - введенный текст
        ctx.reply('Для того, чтобы пользоваться ботом необходимы ваши контактные данные разрешите получить ваши контактные данные ?');
        ctx.reply('Разрешите получить ваши контактные данные ', {
            reply_markup: JSON.stringify({
                keyboard: [
                    [{
                        text: 'Отправить свои контактные данные',
                        request_contact: true
                    }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            })
        }
        );
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {

        if (isRequestButtonPressed(ctx)) {
            ctx.reply('спасибо можете продолжить');
            handleRequestButtonPress(ctx);
        } else {
            console.log('ELSE')
            try {
                let phoneStr = ctx.message.text;
                let phoneInstance = parsePhoneNumber(phoneStr, 'RU');
                if (phoneInstance.isValid()) {
                    ctx.reply('Спасибо, за ваши контакты');
                    handlePhoneInfo(ctx);
                } else {
                    ctx.reply('были введены не корректные данные повторить ?', Markup.inlineKeyboard([[{
                        text: 'Ок',
                        callback_data: JSON.stringify({ type: 'repeat_ask_phone' })
                    }]]));
                    return ctx.wizard.back();
                }
            } catch (e) {
                console.log({ ERROR: e });
                ctx.reply('контакты были введены не правильно повторите ввод');
                // return ctx.wizard.back();
            }

        }
    }

);

function handlePhoneInfo(ctx) {
    if (!ctx.session.orderInfo || !ctx.session.orderInfo.client) {
        let phoneNumber = ctx.message.text;//телефон который ввел пользователь
        ctx.session.orderInfo = {
            "client": {
                "name": "-",
                "phone": phoneNumber,
                "secondName": "-",
                "email": "anonim@mail.ru"
            }
        }
    }
    ctx.reply('Отлично теперь выберите метро из предложенного списка');


    superBotHelper.startCommands.subwayStart(ctx);
    ctx.scene.enter('subway_and_order');

}
function handleRequestButtonPress(ctx) {
    let { first_name, last_name, phone_number } = ctx.update.message.contact;
    if (!ctx.session.orderInfo || !ctx.session.orderInfo.client) {
        ctx.session.orderInfo = {
            "client": {
                "name": first_name,
                "phone": phone_number,
                "secondName": last_name,
                "email": "anonim@mail.ru"
            }
        };
    }
    superBotHelper.startCommands.subwayStart(ctx);
    ctx.scene.enter("subway_and_order");

}
function isRequestButtonPressed(ctx) {
    return (ctx.update && ctx.update.message && ctx.update.message.contact);
}
function isButtonPressed(ctx) {
    return ctx.update && ctx.update.callback_query;
}



module.exports = {
    askPhoneWizzard: askPhoneWizzard
}