
require('dotenv').config();
const { Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const { ApartmentApi } = require('../apiinterfaces/ApartmentApi');
const superBotHelper = require('../botHelpers/superBotHelpers');
const apartmentApiInstance = new ApartmentApi();
/** 
 * ! вот такой интерфейс должен иметь пришедший объект
 * !interface IroomsAmountAndIds {
 * ! [key: roomsAmount]: value : [apartmentsIds]
 * !}
 */
function createRoomsAmountButton(roomsAmountAndIds) {
    let allProms = Object.keys(roomsAmountAndIds).map((roomsAmount) => {
        let roomsIdsStr = roomsAmountAndIds[roomsAmount].join(':');
        return [{
            text: roomsAmount,
            callback_data: JSON.stringify({ type: "press_room_amount", value: `${roomsAmount}:${roomsIdsStr}` })
        }];
    });
    return allProms;
}
// на вход принимает массив id
function createApartmentButtonWithCertainAmountOfRooms(apartments) {
    try {
        const inlineApartmentKeyBoard = apartments.map((room) => {
            return [{
                text: room.address, callback_data: JSON.stringify({
                    type: 'create_order',
                    value: room.id
                })
            }];
        });
        return inlineApartmentKeyBoard;
    } catch (e) {
        return [];
    }
}

const WizardScene = Scenes.WizardScene;
const subwayAndOrderWizzard = new WizardScene(
    "subway_and_order", // Имя сцены
    (ctx) => {
        if (isButtonPressed(ctx)) {// нажали на кнопку с определенным метро
            let dataStr = JSON.parse(ctx.update.callback_query.data) || {
                type: 'error'
            };
            chooseSubwayButtonHandler(ctx, dataStr);
            // обрабатываем данные в случае успеха переходим дальше
        }
    },
    (ctx) => {
        if (isButtonPressed(ctx)) {// нажали на кнопку с определенным метро
            // ctx.reply(ctx.update.callback_query.data);
            let data = JSON.parse(ctx.update.callback_query.data) || {
                type: 'error'
            };
            chooseAmountOfRoomsButton(ctx, data);
        } else {
            ctx.reply('Пожалуйста выберите сколько комнат должно быть в квартире');
        }
    }


);


function isButtonPressed(ctx) {
    return ctx.update && ctx.update.callback_query;
}
//! value это строка "roomAmount:apartmen1Id:apartmen2Id" первый аргумент это количество комнат остальные это id этих квартир 
async function chooseAmountOfRoomsButton(ctx, data) {
    let { type, value } = data;
    if (type !== 'press_room_amount') {
        ctx.reply('что-то пошло не так');
        ctx.scene.leave();
    }
    let [amountOfRoom, ...apartmentIds] = value.split(':');
    // все показываем теперь список комнат
    let response = await apartmentApiInstance.getApartmentsByIds(apartmentIds);
    if (response.data && response.data.status === 'ok') {
        showApartmentsMessage(ctx, response.data);
    } else {
        ctx.reply('Произошла серверная ошибка извините');
    }
}
async function chooseSubwayButtonHandler(ctx, data) {
    // ! value  это id выбранного метро
    let { type, value } = data;
    if (!(type == 'choose_subway')) {
        ctx.reply('Что-то пошло не так');
        return ctx.scene.leave();
    }
    ctx.session.subwayId = value;
    // делаем запрос на получение квартир с таким метро и возвращаем кнопки
    let { data: responseData } = await apartmentApiInstance.getApartmetnsWithBySubWayId(value);
    if (responseData.status === 'ok') {
        // сообщение после нажатия на кнопку выбора метро
        // ctx.reply('Шаг после выбора id то есть получение количества квартир');
        try {
            let inlineKeyBoard = createRoomsAmountButton(responseData.roomsAmountWithApartmentsIds);
            ctx.reply('Выберите какое количество квартир вас интересует',
                Markup.inlineKeyboard(inlineKeyBoard));
            ctx.wizard.next();
        } catch (e) {
            console.log({ ERROR: e })
            ctx.reply('Произошла серверная ошибка');
        }
    } else {
        ctx.reply('Для данного метро нет ни одной квартиры просим прощения');
        ctx.wizard.back();
    }

}









async function showMessageAfterSubwayChoose(ctx, responseData) {
    try {
        let inlineKeyBoard = createRoomsAmountButton(responseData.roomsAmountWithApartmentsIds);
        ctx.reply('Вы выбрали метро с id', Markup.inlineKeyboard(inlineKeyBoard));
    } catch (e) {
        console.log({ ERROR: e })
        ctx.reply('Произошла серверная ошибка');
    }
}


function showApartmentsMessage(ctx, data) {
    console.log({ data: data })
    let { apartments } = data;
    let inlineKeyBoard = createApartmentButtonWithCertainAmountOfRooms(apartments);
    ctx.scene.leave();
    ctx.reply('Вы выбрали квартиры с определенным кол-вом комнат', Markup.inlineKeyboard(inlineKeyBoard));
}

module.exports = {
    subwayAndOrderWizzard: subwayAndOrderWizzard
}