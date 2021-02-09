

const { Apartment, Subway, Order } = require('../models');
const { Op } = require('sequelize');
async function getOrderObject({ client, apartments }) {
    let orderObject = {
        client: {
            name: client.name || 'Аноним',
            secondname: client.secondName || '',
            age: client.age,
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
                price: apartment.price,
                totalPrice: totalPrice,
                fromDate: apartments[apartmentId].fromDate,
                toDate: apartments[apartmentId].toDate,
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

//TODO: спросить как вычислять цену
function calculatePrice(price, amountOfPerson) {
    return price + amountOfPerson * 500;
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
            fullInfo: orderObject,
            fromDate: req.body.orderInfo.fromDate || new Date().getTime() / 1000,
            toDate: req.body.orderInfo.toDate || new Date().getTime() / 1000
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
        return res.json({
            status: 'error',
            msg: 'error'
        })
    }
}
exports.AmountOfRoomsWithApartmentIdsBySubwayId = async (req, res) => {
    let { subwayId } = req.params;
    let { maxPerson } = req.query;


    try {
        let allApartments = await Apartment.findAll({
            where: {
                maxperson: {
                    [Op.gte]: maxPerson
                }
            },
            include: {
                model: Subway,
                where: {
                    id: subwayId,
                }
            }
        });
        if (allApartments && allApartments.length) {
            // тут будет формироваться объект по типу ключ количество комнат и результат массив id квартир
            let finalResultObject = {};
            allApartments.forEach((apartment) => {
                let roomsAmount = apartment.roomAmount;
                if (!(roomsAmount in finalResultObject)) {
                    finalResultObject[roomsAmount] = [apartment.id];
                } else {
                    finalResultObject[roomsAmount].push(apartment.id);
                }
            })
            return res.json({
                status: 'ok',
                roomsAmountWithApartmentsIds: finalResultObject
            });
        } else {
            return res.json({
                status: 'error',
                msg: 'Список апартаментов пуст'
            })
        }
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'Извините но для данного метро все нет ни одной квартиры'
        })
    }
}

exports.getApartmentsByIds = async (req, res) => {
    let { apartmentIds } = req.body;
    if (!apartmentIds || !Array.isArray(apartmentIds)) {
        return res.json({
            status: 'error',
            msg: 'Не был передан массив apartmentIds'
        });
    }
    try {
        let apartments = await Apartment.findAll({
            where: {
                id: apartmentIds
            }
        });
        if (apartments && apartments.length) {
            return res.json({
                status: 'ok',
                apartments: apartments
            });
        } else {
            return res.json({
                status: 'error',
                msg: 'Не было найдено ни одной квартиры'
            });
        }
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'Не было найдено ни одной квартиры'
        });
    }

}

exports.apartmentsWithGreaterPersonAmount = async (req, res) => {
    let { maxPerson } = req.query;

    try {
        let apartments = await Apartment.findAll({
            where: {
                maxperson: {
                    [Op.gte]: maxPerson
                }
            }
        });
        if (apartments && apartments.length) {
            return res.json({
                status: 'ok',
                msg: 'есть апартаменты с таким кол-вом гостей'
            });
        } else {
            return res.json({
                status: 'error',
                msg: 'нет квартир с таким количеством гостей'
            });
        }
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось получить ни одной квартиры'
        });
    }
    return res.json({
        status: 'ok',
        msg: 'получили квартиры с таким количеством'
    });
}