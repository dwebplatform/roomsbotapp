const { Apartment, Order } = require('../models')



exports.getAllOrders = async (req, res) => {

    try {
        let orders = await Order.findAll();
        if (!orders) {
            return res.json({
                status: 'error',
                msg: 'не удалось найти ни одного заказа'
            });
        }

        return res.json({
            status: 'ok',
            orders: orders
        })
    } catch (e) {
        console.log(e)
        return res.json({
            status: 'error',
            msg: 'не удалось получить заказы'
        })
    }

}
exports.createOrder = async (req, res) => {
    let { client } = req.body.orderInfo;
    if (!client) {
        return res.json({
            status: 'error',
            msg: 'no client were provided'
        });
    }
    if (!client.phone || !client.email) {
        return res.json({
            status: 'error',
            msg: 'не был передан телефон или email'
        });
    }

    let orderObject = await getOrderObject(req.body.orderInfo);
    try {
        let orderInstance = await Order.create({
            status: 0,//TODO: менять статусы в зависимости от индекса,
            fullInfo: orderObject
        });
        if (orderInstance) {
            return res.json({
                status: 'ok',
                msg: 'order created'
            })
        } else {
            return res.json({
                status: 'error',
                msg: 'not created'
            })
        }

    } catch (e) {
        console.log(e)
        return res.json({
            status: 'error',
            msg: 'error'
        })
    }
    return res.json({
        status: 'ok',
        order: orderObject
    })
}


async function getOrderObject({ client, apartments }) {
    let orderObject = {
        client: {
            name: client.name || 'Аноним',
            secondname: client.secondName || '',
            email: client.email,
            phone: client.phone,
        },
        rooms: []
    };
    let roomsInfoErrors = [];
    for (let apartmentId in apartments) {
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
            };

            let totalPrice = calculatePrice(apartment.price, apartments[apartmentId].personsAmount || 1);
            orderObject.rooms.push({
                id: apartment.id,
                address: apartment.address,
                // TODO: высчитывать цену в зависимости от кол-ва человек и услуг(services)
                price: apartment.price,
                totalPrice: totalPrice,
                personsAmount: apartments[apartmentId].personsAmount || 1,
                roomAmount: apartment.roomAmount,
                services: apartments[apartmentId].services,
                withChilds: apartments[apartmentId].withChilds,
                withAnimals: apartments[apartmentId].withAnimals
            });
        } catch (e) {
            roomsInfoErrors.push({
                error: `no room's found with id :${apartmentId}`
            });
        }
    }
    if (roomsInfoErrors.length) {
        throw new Error('Msg rooms are not good');
    }
    return orderObject;
}


function calculatePrice(price, amountOfPerson) {
    return price + amountOfPerson * 500;
}