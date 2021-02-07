
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
const { convertData } = require('../utils/timeconvert');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;

//TODO: доделать конвертацию из русского в английский потом в moment -> в норvальную дату 22.01.2020

/**
 * это индекс "apartments":
 *   "3":{
                "personsAmount":7,
                 "services":"['Игровая машинка','Мебель','Платок']",
                 "withChilds":true,
                "withAnimals": false
         }
 */
const WizardScene = Scenes.WizardScene;
const createOrderWizzardScene = new WizardScene(
    "create_order", // Имя сцены
    (ctx) => {
        if (isButtonPressed(ctx)) {
            let { type, value: apartmentId } = JSON.parse(ctx.update.callback_query.data);
            ctx.session.selectedApartmentId = apartmentId;
            ctx.session.orderInfo = {
                ...ctx.session.orderInfo,
                "apartments": {
                    [apartmentId]: {}
                }
            }
            ctx.reply('Введите ваше имя:');
            ctx.wizard.next();
        } else {
            //TODO repeat show apartments
        }
    },
    (ctx) => {

        // ctx.message.text  - введенный текст
        ctx.session.orderInfo.client.name = ctx.message.text;
        ctx.reply('Введите ваш возраст Например: 23');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        ctx.session.orderInfo.client.age = ctx.message.text;
        ctx.reply('Введите дату заезда: Пример 2ое сентября 2021');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        let apartmentId = ctx.session.selectedApartmentId;
        let fromDateObj = convertData(ctx.message.text.trim());
        if (!fromDateObj) {
            ctx.reply('Вы ввели неправильную дату');
            return ctx.wizard.back();
        }
        ctx.session.orderInfo.fromDate = fromDateObj.unixTime;
        ctx.session.orderInfo.apartments[apartmentId].fromDate = `${fromDateObj.day}.${fromDateObj.month}.${fromDateObj.year}`;
        // "services":"['Игровая машинка','Мебель','Платок']",
        //TODO: доделать services
        ctx.session.orderInfo.apartments[apartmentId].services = ['это тест из телеграма', 'платок из телеграма', 'Сообщение из телеграмма'];
        ctx.reply('Введите дату выезда: Пример 2ое сентября 2020');
        // ctx.reply('Этап 2: выбор времени проведения матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        let apartmentId = ctx.session.selectedApartmentId;
        let toDateObject = convertData(ctx.message.text);
        if (!toDateObject) {
            ctx.reply('Вы ввели неправильную дату');
            return ctx.wizard.back();
        }
        ctx.session.orderInfo.toDate = toDateObject.unixTime;
        ctx.session.orderInfo.apartments[apartmentId].toDate = `${toDateObject.day}.${toDateObject.month}.${toDateObject.year}`;
        ctx.reply('Сколько человек планируется заселиться Цифра Например:7.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        let apartmentId = ctx.session.selectedApartmentId;
        if (!ctx.session.orderInfo.apartments[apartmentId].personsAmount) {
            ctx.session.orderInfo.apartments[apartmentId].personsAmount = ctx.message.text;
        }
        //TODO: добавить эмоджи
        const inlineYesNoKeyboard = [[{
            text: 'Да',
            callback_data: JSON.stringify({
                type: 'has_childs',
                value: true
            })
        }, {
            text: 'Нет',
            callback_data: JSON.stringify({
                type: 'has_childs',
                value: false
            })
        }]];
        ctx.reply('Заезд с детьми ?', Markup.inlineKeyboard(inlineYesNoKeyboard));
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        if (isButtonPressed(ctx)) { // если нажал на кнопку то, это тот самый случай
            buttonEventHandler(ctx);
            // ctx.reply(JSON.stringify(data));
        } else {
            ctx.reply('Тут ошибка');
            const inlineYesNoKeyboard = [[{
                text: 'Да',
                callback_data: JSON.stringify({
                    type: 'has_childs',
                    value: true
                })
            }, {
                text: 'Нет',
                callback_data: JSON.stringify({
                    type: 'has_childs',
                    value: false
                })
            }]];
            ctx.reply('Вы ввели не правильное поле . Повторить ?', Markup.inlineKeyboard(inlineYesNoKeyboard));
            return ctx.wizard.back();
        }
    },
    async (ctx) => {
        if (isButtonPressed(ctx)) {
            buttonEventHandler(ctx);
        }
        const orderData = { orderInfo: ctx.session.orderInfo };
        try {
            //! расскоментировать
            // let { data } = await axios.post(DOMAIN_ROOT + '/api/order/create', orderData);
            let { data } = await ctx.session.telBotApiService.createOrder(orderData);
            if (data && data.status == 'ok') {
                console.log(data)
                await ctx.reply('Наш менеджер скоро с вами свяжется');
            } else {
                await ctx.reply('Произошла ошибка на сервере');
            }
        } catch (e) {
            console.log('ERROR');
        }
        return ctx.scene.leave();
    }
);


function isButtonPressed(ctx) {
    return ctx.update && ctx.update.callback_query;
}

function buttonEventHandler(ctx) {
    let data;
    try {
        data = JSON.parse(ctx.update.callback_query.data);
    } catch (e) {
        data = {
            type: 'error'
        }
    }
    if (data.type == 'has_animals') {
        animalsHandler(ctx, data);
    }
    if (data.type === 'error') {
        ctx.reply('Произошла ошибка при обработке события');
        ctx.wizard.back();
    }
    if (data.type === 'has_childs') {
        let apartmentId = ctx.session.selectedApartmentId;
        if (typeof data.value === 'undefined') {
            ctx.reply('Произошла ошибка при обработке события тип переданного значения undefined');
            return ctx.wizard.back();
        }
        ctx.session.orderInfo.apartments[apartmentId].withChilds = data.value;
        sendAnimalsButtons(ctx);
        return ctx.wizard.next();
    }
}



function animalsHandler(ctx, data) {
    console.log('THIS IS ANIMALS PRESSED');
    if (typeof data.value === 'undefined') {
        ctx.reply('Произошла ошибка при обработке события тип переданного значения undefined');
        return ctx.wizard.back();
    }
    let apartmentId = ctx.session.selectedApartmentId;
    ctx.session.orderInfo.apartments[apartmentId].withAnimals = data.value;
    return ctx.wizard.next();
}
function sendAnimalsButtons(ctx) {
    const inlineYesNoButtonsAnimals = [[{
        text: 'Да',
        callback_data: JSON.stringify({
            type: 'has_animals',
            value: true
        })
    }, {
        text: 'Нет',
        callback_data: JSON.stringify({
            type: 'has_animals',
            value: false
        })
    }]];
    ctx.reply('Наличие животных ?', Markup.inlineKeyboard(inlineYesNoButtonsAnimals));

}
module.exports = {
    createOrderWizzardScene: createOrderWizzardScene
}