// @ts-nocheck

require('dotenv').config();

const API_DOMAIN = 'http://localhost:8000';
const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const app = express();
const paginate = require('express-paginate');
const fileUpload = require('express-fileupload');



app.use(paginate.middleware(10, 50));
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { Client, Apartment, Order, Service, ApartmentService, Subway, ApartmentSubway } = require('./models');

/* many-to-many connections */

// Movie.belongsToMany(Actor, { through: 'ActorMovies' });
// Actor.belongsToMany(Movie, { through: 'ActorMovies' });
/* end: many-to-many */

/**
 * ! sql connections 
 */
Apartment.belongsToMany(Subway, { through: ApartmentSubway });
Subway.belongsToMany(Apartment, { through: ApartmentSubway });
Apartment.belongsToMany(Service, { through: ApartmentService });
Service.belongsToMany(Apartment, { through: ApartmentService });

const mode = process.argv[2] || null;
if (!(mode === 'dev')) {
    app.use(express.static(path.join(__dirname, "..", "front-end/build")));
    app.use(express.static("public"));
    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "front-end/build", "index.html"));
    });

}
app.use(express.static(path.join(__dirname, "..", "server/public")));

// const { allMetros } = require('./allmetro');
app.get('/generate-dummy-data', async (req, res) => {
    // let newApartment = await Apartment.create({
    //     address: 'ул Панферова д 3',
    //     price: 2500,
    //     roomAmount: Math.ceil(Math.random() * 3),
    //     images: '[]'
    // });
    // let allApartments = await Apartment.findOne({
    //     where: {
    //         id: 1
    //     },
    //     include: Subway
    // });
    // let subWay = await Subway.findOne({
    //     where: {
    //         id: 5
    //     }
    // })
    // await allApartments.addSubway(subWay);

    // await newApartment.addSubway(newMetro);
    // return res.json({
    //     allApartments
    // })
})

// const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.ROOM_BOT_TOKEN;
// Create a bot that uses 'polling' to fetch new updates

// Matches "/echo [whatever]"


const { Telegraf, session, Scenes, Markup } = require('telegraf');
const { default: axios } = require('axios');

const WizardScene = Scenes.WizardScene;
const Stage = Scenes.Stage;



const bot = new Telegraf(token);

const stage = new Stage();

// Регистрируем сцену создания матча


// stage.register(create);
const { createOrderWizzardScene } = require('./wizzards/createOrderWizzard');
const { subwayAndOrderWizzard } = require('./wizzards/subwayAndOrderWizzardThird');
stage.register(createOrderWizzardScene, subwayAndOrderWizzard);
bot.use(session());
bot.use(stage.middleware());



function createApartmentButtons(allApartments) {
    // const inlineMessageRatingKeyboard = [[
    //     { text: '👍', callback_data: 'like' },
    //     { text: '👎', callback_data: 'dislike' }
    // ]];
    // ctx.reply('Тут есть кнопки', {
    //     reply_markup: JSON.stringify({
    //         inline_keyboard: inlineMessageRatingKeyboard
    //     })
    // });
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

/**
  * try {
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
  */

// список кнопок из всех кнопок
//TODO нижний комментарий это все квартиры
const superBotHelper = require('./botHelpers/superBotHelpers');
const { BotApi } = require('./apiinterfaces/ApartmentApi');
// bot.start(choseApartmentBotButtons);
// bot.start(superBotHelper.startCommands.subwayStart);
bot.start((ctx) => {
    if (!ctx.session.orderInfo) {
        ctx.session.orderInfo = {};
    }
    if (!ctx.session.telBotApiService) {
        ctx.session.telBotApiService = new BotApi('1234');
    }
    ctx.reply(`Добрый день это бот поиска квартир в центре, если вы ходите сделать заявку нажмите на кнопку продолжить `, Markup.inlineKeyboard([
        [{
            text: 'Ок',
            callback_data: JSON.stringify({ type: 'begin_ask' })
        }]
    ]));
    // ctx.scene.enter("subway_and_order");
})

function getUserContacts(ctx) {
    if (ctx.update && ctx.update.message && ctx.update.message.contact) {// если пользователь нажал на кнопку передать данные
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
        ctx.reply('Спасибо теперь можете перейти к списку метро', Markup.inlineKeyboard([{ text: 'Ок', callback_data: JSON.stringify({ type: 'start_chat' }) }]));
    }

}

bot.on('message', (ctx) => {
    getUserContacts(ctx);
    // const inlineMessageRatingKeyboard = [[
    //     { text: '👍', callback_data: 'like' },
    //     { text: '👎', callback_data: 'dislike' }
    // ]];
    // ctx.reply('Тут есть кнопки', {
    //     reply_markup: JSON.stringify({
    //         inline_keyboard: inlineMessageRatingKeyboard
    //     })
    // });
    // ctx.scene.enter("create_order");
    // ctx.reply('send MEssage')
});

const handleTelegrafCallBackQuery = bot => {
    return ctx => {
        let strData = ctx.callbackQuery.data;
        const { type, value } = JSON.parse(strData);
        // console.log({ value });
        if (type == 'begin_ask') {
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
        }
        if (type === 'start_chat') {
            superBotHelper.startCommands.subwayStart(ctx)
            ctx.scene.enter("subway_and_order");
        }
        if (type === 'create_order') {
            // создаем Order
            console.log({ orderInfo: ctx.session.orderInfo });
            ctx.session.selectedApartmentId = value;
            if (!ctx.session.orderInfo['apartments']) {
                ctx.session.orderInfo = {
                    ...ctx.session.orderInfo,
                    // "client": {
                    //     "name": "Павел",
                    //     "phone": 88001234516,
                    //     "secondName": "-",
                    //     "email": "anonim@mail.ru"
                    // },
                    // заполняем apartments[id]
                    "apartments": {
                        [ctx.session.selectedApartmentId]: {},
                    }
                };
            } else {

            }
            ctx.reply("Отлично: введите ваше имя");
            ctx.scene.enter("create_order");
        }
    };
}

bot.on('callback_query', handleTelegrafCallBackQuery(bot));
// bot.action("create_order", (ctx) => {
//     // ctx.scene.enter("create")
// });


bot.launch();

// function tokenHandler(req,res,next){
//    const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.json({
//     status:'error',
//     msg:'not authorized'
//   }); // if there isn't any token

//   jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, user) => {
//     if (err) return res.json({status:'error',msg:'not authorized'});
//     req.user = user;
//     next(); // pass the execution off to whatever request the client intended
//   });
// }
// app.get('/api/protected',tokenHandler,(req,res)=>{
//     return res.json({
//         status:'ok',
//         msg:'protected route'
//     })
// });
app.post('/api/login', async (req, res) => {
    let { pass, email } = req.body;
    if (!pass || !email) {
        return res.json({
            status: 'error',
            msg: 'не был передан пароль или email'
        });
    }
    //TODO: get from  db Client model

    if (pass === process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL) {

        let signObject = {
            id: 1,
            email: email
        };
        jwt.sign(signObject, process.env.TOKEN_PRIVATE_KEY, {}, function (err, token) {
            if (err) {
                return res.json({
                    status: 'error',
                    msg: 'not authorized'
                });
            }
            return res.json({
                status: 'ok',
                token: token
            });
        });
    } else {
        return res.json({
            status: 'error',
            msg: 'not auth'
        })
    }
});
// app.use((req,res,next)=>{
//     if(req.query.api_key!=='1234'){
//     return res.json({
//         status:'error'
//     });
//     }
//     next();
// });


require('./routes/services.routes')(app);
require('./routes/main.routes')(app);
require('./routes/apartment-subway.routes')(app);
require('./routes/apartment.routes')(app);
require('./routes/subway.routes')(app);
require('./routes/telegram.routes')(app);
app.get('/api/create-order', async (req, res) => {
    let uid;
    let services = [2, 5, 7]; // services.uids
    let { roomId } = req.query;
    let client = { // пришло
        name: 'Сергей',
        secondname: 'Пономарев',
        phone: '88005553535',
        email: 'petrov@mail.ru'
    };
    const orderObject = {
        client,
        rooms: [],
        //TODO: подсчитывать totalPrice в цикле
        totalPrice: 0
    };
    const roomsInfo = { // пришло
        1: {
            withAnimals: false,
            withChilds: true,
            totalPerson: 5,
            fromDate: '12.08.2020',
            toDate: '15.08.2020',
            services: ['Уборка', 'Стирка', 'Полотенце'],
        }
    }
    let roomsInfoErrors = [];
    for (let apartmentId in roomsInfo) {
        try {
            let apartment = await Apartment.findOne({
                where: {
                    id: apartmentId
                }
            });
            if (!apartment) {
                roomsInfoErrors.push({
                    error: `no room found with id: ${apartmentId}`
                })
            }
            orderObject.rooms.push({
                id: apartment.id,
                address: apartment.address,
                // TODO: высчитывать цену в зависимости от кол-ва человек и услуг(services)
                price: apartment.price,
                fromDate: roomsInfo[apartmentId].fromDate,
                toDate: roomsInfo[apartmentId].toDate,
                services: roomsInfo[apartmentId].services,
                withChilds: roomsInfo[apartmentId].withChilds,
                withAnimals: roomsInfo[apartmentId].withAnimals,
            });
        } catch (e) {
            roomsInfoErrors.push({
                error: `no room's found with id :${apartmentId}`
            });
        }
    }
    if (roomsInfoErrors.length) {
        return res.json({
            roomsInfoErrors
        });
    }
    try {
        let orderInstance = await Order.create({
            status: 0,// TODO: создать таблицу статусов чтобы из нее брать информацию или массив [{id:0, value:'создан'}]
            fullInfo: JSON.stringify(orderObject)
        });
        if (orderInstance) {
            return res.json({
                status: 'ok',
                msg: 'Новый заказ создан'
            });
        }
    } catch (e) {
        console.log(e)
        return res.json({
            status: 'error',
            msg: ' не удалось создать заказ'
        })
    }
    return res.json({
        status: 'ok',
        order: orderObject
    })

    /**
     * final result order.save();
     */

});


app.get('/api/order-look', async (req, res) => {

    let orders = await Order.findAll();
    return res.json(orders);
    let order = {
        client: {
            name: 'Петр',
            secondname: 'Соколов',
            phone: 88005553535,
            email: 'test@mail.ru',
        },
        rooms: [
            {
                uid: 4,
                address: 'Бутова 16.8',
                services: ['Постель', 'Уборка', 'Еда'],
                withChilds: true,
                withAnimals: false,
                amountOfRoom: 3,
                totalDays: 3,
                fromDate: "12.01.2020",
                toDate: "15.01.2020"

            },

        ]
    }

    return res.json(order);
});



app.get('/api/clients', async (req, res) => {
    let allclients = await Client.findAll();
    return res.json(allclients);
});

app.listen(8000, () => {
    console.log('Listening on port 8000')
});

