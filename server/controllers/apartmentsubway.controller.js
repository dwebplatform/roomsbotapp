const { Subway, Apartment } = require('../models');


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

exports.AmountOfRoomsWithApartmentIdsBySubwayId = async (req, res) => {
    let { subwayId } = req.params;
    try {
        let allApartments = await Apartment.findAll({
            include: {
                model: Subway,
                where: {
                    id: subwayId
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
exports.allSubway = async (req, res) => {
    let allSubways = [];
    try {
        allSubways = await Subway.findAll({});
    } catch (e) {
        return res.json({
            status: 'error'
        });
    }
    return res.json({
        status: 'ok',
        subways: allSubways
    });
}

exports.getSubById = async (req, res) => {
    let { id } = req.params;
    try {
        let findedSubway = await Subway.findOne({
            where: {
                id: id
            }
        });
        return res.json({
            status: 'ok',
            subway: findedSubway || {}
        });
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'Не удалось найти метро по id'
        });
    }
}

