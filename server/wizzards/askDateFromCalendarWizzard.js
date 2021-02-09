
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
const { convertData } = require('../utils/timeconvert');
const superBotHelper = require('../botHelpers/superBotHelpers');
const { parsePhoneNumber } = require('libphonenumber-js');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;


const WizardScene = Scenes.WizardScene;
const askDateFromCalendarWizzard = new WizardScene(
    "ask_date_info", // Имя сцены
    (ctx) => {
        ctx.reply('Добрый день укажите дату заезда ?');
        ctx.wizard.next();
    },
);


module.exports = {
    askDateFromCalendarWizzard: askDateFromCalendarWizzard
}