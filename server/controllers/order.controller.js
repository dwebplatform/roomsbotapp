const { Apartment, Order } = require('../models');
const paginate = require('express-paginate');
const { Op } = require('sequelize');

exports.updateStatus = async (req, res) => {
    try {
        //req.body
        let { orderId, selectedStatus } = req.body;
        // return res.json({
        //     selectedStatus
        // });
        let findedOrder = await Order.findOne({
            where: {
                id: orderId
            }
        });
        if (findedOrder instanceof Order) {
            findedOrder.status = selectedStatus;
            await findedOrder.save();
            return res.json({
                status: 'ok',
                msg: 'succefully updated'
            });
        }
        return res.json({
            status: 'error',
            msg: 'Не удалось обновить статус'
        })
    } catch (e) {
        console.log({ e })
        return res.json({
            status: 'error',
            err: e
        });
    }

}
exports.getAllOrders = async (req, res) => {

    let { from, to } = req.query;

    const filterObject = { limit: req.query.limit, offset: req.skip, where: {} };
    if (from) {
        filterObject.where = {
            ...filterObject.where,
            fromDate: {
                [Op.gte]: from
            }
        }
    }
    if (to) {
        filterObject.where = {
            ...filterObject.where,
            toDate: {
                [Op.lte]: to
            }
        }
    };
    try {
        let ordersWithCount = await Order.findAndCountAll(filterObject);
        const itemCount = ordersWithCount.count;
        const pageCount = Math.ceil(ordersWithCount.count / (req.query.limit || 1));

        return res.json({
            status: 'ok',
            orders: ordersWithCount.rows,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
        // let orders = await Order.findAll();
        // if (!orders) {
        //     return res.json({
        //         status: 'error',
        //         msg: 'не удалось найти ни одного заказа'
        //     });
        // }

        // return res.json({
        //     status: 'ok',
        //     orders: orders
        // })
    } catch (e) {

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