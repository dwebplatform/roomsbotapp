/**
 *  {
    Вот такой должен быть сформирован объект
    затем emitим событие на axios.post('/api/order/create')
    "orderInfo":{
         "client":{
          "name":"Павел",
          "phone":88001234516,
          "secondName":"Карлов",
          "email":"buratin@mail.ru"
     },
     "apartments":{
         "3":{
                "personsAmount":7,
                 "services":"['Игровая машинка','Мебель','Платок']",
                 "withChilds":true,
                "withAnimals": false
         }
     }
    }
 }
 */
const orderSteps = {
    1: (bot, msg, store, apartmentId) => {
        // Введите время заезда: пример 20.12.2020
        //TODO: брать текст из сообщения и тестировать обхект созданный в заказе
        // store.orderInfo.apartments[apartmentId] = {
        //     ...store.orderInfo.apartments[apartmentId],
        //     fromDate: '',
        // }
        bot.sendMessage(msg.chat.id, ' первый шаг');
    },
    2: (bot, msg, store, apartmentId) => {
        // введите дату выезда: пример 22.12.2020
        bot.sendMessage(msg.chat.id, ' второй шаг');
    },
    3: (bot, msg, store, apartmentId) => {
        bot.sendMessage(msg.chat.id, ' третий шаг');
    },
    4: (bot, msg, store, apartmentId) => {
        bot.sendMessage(msg.chat.id, ' четвертый шаг');
    },
    5: (bot, msg, store, apartmentId) => {
        bot.sendMessage(msg.chat.id, ' пятый шаг');
    }
}
let totalSteps = Object.keys(orderSteps).length;
exports.orderSteps = orderSteps;
exports.orderTotalStep = totalSteps;