
// const initialState = {
//     count: 0,
//     orderProcedureStep: null,
//     orderInfo: {
//         "client": {
//             "name": "Павел",
//             "phone": 88001234516,
//             "secondName": "Карлов",
//             "email": "buratin@mail.ru"
//         },
//         "apartments": {

//         }


//     }
// }

// //TODO: о чудо это должно будет появиться при нажатии на квартиру index 1 это id квартиры
// initialState.orderInfo.apartments[1] = {
//     // todo: сделать, чтобы из кнопок выбирались сервисы
//     "services": "['Игровая машинка','Мебель','Платок']",
// };

// const handleBotMessage = (bot) => {
//     return (msg) => {
//         if (initialState.orderInfo !== null) {
//             // вызываем объект который по цифрам идет и выполняет эту ХРЕНЬ
//             if (initialState.orderProcedureStep > orderTotalStep) {
//                 bot.sendMessage(msg.chat.id, 'Ваш заказ завершен всего доброго');
//                 initialState.orderProcedureStep = null; // уничтожаем счетчик
//             }
//             try {
//                 // создаем по шагам допустим что он выбрал квартиру
//                 let chosenApartmentId = 1;
//                 //TODO: сделать возможным выбор после нажатия на квартиру( клиент нажал на иконку с какой-то квартирой ) 
//                 orderSteps[initialState.orderProcedureStep](bot, msg, initialState, chosenApartmentId);
//             }
//             catch (e) {
//                 // console.log({ error: e });
//             }
//             initialState.orderProcedureStep += 1;// следующий шаг
//         }
//         let options = {
//             reply_markup: JSON.stringify({
//                 inline_keyboard: [
//                     [{
//                         text: 'Оформить заказ', callback_data: JSON.stringify({
//                             type: '/start_order',
//                         })
//                     }],
//                     // [{ text: 'Кнопка 3', callback_data: 'text 3' }]
//                 ]
//             })
//         };

//         bot.sendMessage(msg.chat.id, 'All good this is working' + initialState.count, options);
//     }
// }

// /**
//  * 
//  * @param {*} bot 
//  // ! msg.data приходит с кнопки в виде json строки
//  */
// const handleBotCallBackQuery = (bot) => {
//     return (msg) => {
//         let { type } = JSON.parse(msg.data);
//         if (type == '/start_order') {
//             initialState.orderProcedureStep = 1;
//             bot.sendMessage(msg.from.id, 'Отлично начал ваш заказ');
//         } else {
//         }
//         bot.sendMessage(msg.from.id, msg.data);
//         // bot.sendMessage(msg.from.id, 'Ответ верный ✅');
//     }
// };

// exports.handleBotMessage = handleBotMessage;

// exports.handleBotCallBackQuery = handleBotCallBackQuery;