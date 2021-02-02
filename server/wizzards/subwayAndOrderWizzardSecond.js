
require('dotenv').config();
const { Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const fs = require('fs');
const { ApartmentApi } = require('../apiinterfaces/ApartmentApi');
const superBotHelper = require('../botHelpers/superBotHelpers');
// const superBotHelper = require('../botHelpers/superBotHelpers');
const apartmentApiInstance = new ApartmentApi();


function showApartmentsWithPhoto(ctx, inlineKeyBoard) {
    inlineKeyBoard.map(async (btn, i) => {
        await ctx.replyWithPhoto({
            url: DOMAIN_ROOT + '/img/__APARTMENT_UID__r0kxy2f8gkknwuxbe.jpeg'
        });
        await ctx.reply('->', Markup.inlineKeyboard([btn]));
    });

}
/** 
 * ! вот такой интерфейс должен иметь пришедший объект
 * !interface IroomsAmountAndIds {
 * ! [key: roomsAmount]: value : [apartmentsIds]
 * !}
 */
function createRoomsAmountButton(roomsAmountAndIds) {
    let roomsButtons = Object.keys(roomsAmountAndIds).map((roomsAmount) => {
        let roomsIdsStr = roomsAmountAndIds[roomsAmount].join(':');
        return [{
            text: roomsAmount,
            callback_data: JSON.stringify({ type: "press_room_amount", value: `${roomsAmount}:${roomsIdsStr}` })
        }];
    });
    return roomsButtons;
}
// на вход принимает массив id квартир
function createApartmentButtonWithCertainAmountOfRooms(apartments) {
    try {
        const inlineApartmentKeyBoard = apartments.map((room) => {
            return [{
                text: room.address, callback_data: JSON.stringify({
                    type: 'create_order',
                    value: room.id,
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
        superBotHelper.deleteBotMessages(ctx);
        superBotHelper.startCommands.subwayStart(ctx);
        let info = await ctx.reply('Для данного метро нет ни одной квартиры просим прощения ');
        superBotHelper.saveBotMessageIdForDeleted(ctx, info.message_id);
    }
}

function showApartmentsMessage(ctx, data) {
    console.log({ data: data })
    let { apartments } = data;
    //
    const imageContainer = {

    };
    for (let ap of apartments) {
        if (ap.images && ap.images.length) {
            imageContainer[ap.id] = ap.images[0];
        }
    }
    let inlineKeyBoard = createApartmentButtonWithCertainAmountOfRooms(apartments);
    inlineKeyBoard.map(async (btn, i) => {
        let btnInfo = btn[0];
        let curApartmentId = JSON.parse(btnInfo.callback_data).value;
        let imageInfo = (curApartmentId in imageContainer) ? imageContainer[curApartmentId] : '/default/missy_kitty.jpg';
        await ctx.replyWithPhoto({
            url: DOMAIN_ROOT + imageInfo
        }, Markup.inlineKeyboard([btn]));
        // await ctx.reply('->', Markup.inlineKeyboard([btn]));
    });
    ctx.scene.leave();


    // раскоментировать!!!
    // ctx.reply('Вы выбрали квартиры с определенным кол-вом комнат', Markup.inlineKeyboard(inlineKeyBoard));
}

module.exports = {
    subwayAndOrderWizzard: subwayAndOrderWizzard
}