
require('dotenv').config();
const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');
const { convertData } = require('../utils/timeconvert');
const { response } = require('express');
const { compress, decompress } = require("shrink-string");
const apartment = require('../models/apartment');
let DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const { ApartmentApi } = require('../apiinterfaces/ApartmentApi');

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
function createSubwayButtons(allSubways) {
    try {
        let subArray = [];
        let initialArray = [];
        //TODO: выводить все метро без splicing
        allSubways.forEach((subway) => {
            if (subArray.length == 3) {// разбиение на колонки
                initialArray.push(subArray);
                subArray = [];
            } else {
                subArray.push({
                    text: subway.name, callback_data: JSON.stringify({
                        //TODO: обработать событие нажатия на метро
                        type: 'choose_subway',
                        value: subway.id
                    })
                });
            }
        });
        return initialArray;
    } catch (e) {
        return [];
    }
}

/**
 * @description отдает все кнопки с метро для телеграмма
 * @param {*} ctx 
 * @button callback_data {type:"choose_subway", value:subwayId}
 */
async function showAllSubwayBotButtons(ctx) {
    // получаем кнопки
    let subways = [];
    try {
        let result = await axios.get(DOMAIN_ROOT + '/api/apartments-subway/allsubway');
        subways = result.data.subways || [];
        let inlineKeyBoard = createSubwayButtons(subways);
        ctx.reply('Выберите метро рядом с которым вы бы хотели приобрести квартиру', Markup.inlineKeyboard(inlineKeyBoard));
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
        ctx.reply('Простите произошла серверная ошибка');
    }
}

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
const subwayAndOrderWizzard = new WizardScene(
    "subway_and_order", // Имя сцены
    (ctx) => {
        if (isButtonPressed(ctx)) {
            buttonEventHandler(ctx);
        } else {
            ctx.reply('Для продолжения создания заявки необходимо выбрать ');
            showAllSubwayBotButtons(ctx);
        }
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
        if (isButtonPressed(ctx)) {
            buttonEventHandler(ctx);
        } else {
            ctx.reply('Для продолжения необходимо   выбрать кол-во комнат');
            // showAllSubwayBotButtons(ctx);
            return ctx.wizard.back();
        }
    },

);


function isButtonPressed(ctx) {
    return ctx.update && ctx.update.callback_query;
}
async function buttonEventHandler(ctx) {
    let data;
    try {
        data = JSON.parse(ctx.update.callback_query.data);
    } catch (e) {
        data = {
            type: 'error'
        }
    }
    if (data.type === 'error') {
        ctx.reply('Произошла ошибка при обработке события');
        ctx.wizard.back();
    }
    if (data.type === 'press_room_amount') {
        let [amountOfRoom, ...apartmentIds] = data.value.split(':');
        // все показываем теперь список комнат
        let response = await apartmentApiInstance.getApartmentsByIds(apartmentIds);
        if (response.data && response.data.status === 'ok') {
            showApartmentsMessage(ctx, response.data);
        } else {
            ctx.reply('Произошла серверная ошибка извините');
        }
    }
    if (data.type === 'choose_subway') {
        ctx.session.subwayId = data.value;
        // делаем запрос на получение квартир с таким метро и возвращаем кнопки
        let { data: responseData } = await apartmentApiInstance.getApartmetnsWithBySubWayId(data.value);
        if (responseData.status === 'ok') {
            // сообщение после нажатия на кнопку выбора метро
            await showMessageAfterSubwayChoose(ctx, responseData);
        } else {
            ctx.reply('Для данного метро нет ни одной квартиры просим прощения');
            ctx.wizard.back();
        }
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