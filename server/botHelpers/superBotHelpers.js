const axios = require('axios');
const { Markup } = require('telegraf');
const API_DOMAIN = 'http://localhost:8000';


function createSubwayButtons(allSubways) {
    try {
        let subArray = [];
        let initialArray = [];
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
function createApartmentButtons(allApartments) {
    try {
        const inlineApartmentKeyBoard = allApartments.map((room) => {
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


async function showAllSubwayBotButtons(ctx) {
    // fetch Buttons
    let subways = [];
    try {
        let result = await axios.get(API_DOMAIN + '/api/apartments-subway/allsubway');

        console.log(result.data.status);
        subways = result.data.subways || [];
        let inlineKeyBoard = createSubwayButtons(subways);
        ctx.reply('Выберите метро рядом с которым вы бы хотели приобрести квартиру', Markup.inlineKeyboard(inlineKeyBoard));

    } catch (e) {
        console.log(e);
        ctx.reply('Простите произошла серверная ошибка');
    }
}
async function choseApartmentBotButtons(ctx) {
    try {
        let result = await axios.get(API_DOMAIN + '/api/apartments/all-without-pagination');
        // выводим список кнопок НАКОНЕЦ_ТО
        const options = {
            reply_markup: JSON.stringify({
                // TODO: в отдельный модуль
                inline_keyboard: createApartmentButtons(result.data.apartments || [])
            })
        }
        ctx.reply('Выберите  квартиру', options);
    } catch (e) {
        console.log(e)
    }
}




const superBotHelper = {
    startCommands: {
        roomsStart: choseApartmentBotButtons,
        subwayStart: showAllSubwayBotButtons
    }
};


module.exports = superBotHelper;