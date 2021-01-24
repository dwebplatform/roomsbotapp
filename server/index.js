const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
var bodyParser = require('body-parser')


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const { Client, Apartment, Order } = require('./models');

const sequelize = new Sequelize('roombot_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});



const mode = process.argv[2] || null;

if (!(mode === 'dev')) {

    app.use(express.static(path.join(__dirname, "..", "front-end/build")));
    app.use(express.static("public"));

    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, "..", "front-end/build", "index.html"));
    });

}


require('./routes/main.routes')(app);
// app.post('/api/create-order', async (req, res) => {
// });
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
                services: roomsInfo[apartmentId].services,
                withChilds: roomsInfo[apartmentId].withChilds,
                withAnimals: roomsInfo[apartmentId].withAnimals
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
})
app.get('/api/clients', async (req, res) => {
    let allclients = await Client.findAll();
    return res.json(allclients)
});

app.listen(8000, () => {
    console.log('Listening on port 8000')
});

