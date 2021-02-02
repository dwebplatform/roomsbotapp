const { Subway, Apartment, ApartmentSubway } = require('../models');

const Op = require('sequelize').Op;


 


exports.addToApartment = async (req,res)=>{
    let { addedSubwayId,apartmentId} = req.body;
    if(typeof addedSubwayId=='undedined' || typeof apartmentId=='undedined'){
        return res.json({
            status:'error',
            msg:'не все поля были переданы'
        });
    }
    try{
    let apartment = await Apartment.findOne({ where:{
        id:apartmentId
    }});
    let addedSubway = await Subway.findOne({
        where:{
            id: addedSubwayId
        }
    });
    if(apartment && addedSubway){
        await apartment.addSubway(addedSubway);
        return res.json({status:'ok', msg:'к данной квартире добавлено новое метро'})
    }
    } catch(e){
        return res.json({
            status:'error',
            msg:'не удалось получить квартиру с таким id'
        });
    }
    return res.json({
        status:'ok',
        msg:'succefully added subway to apartments'
    });
}

exports.getSubForApartment = async(req,res)=>{
    let {apartmentId} = req.params;
     
     if(!apartmentId){
        let allSubways = await Subway.findAll({});
        return res.json({
            status:'ok',
            subways:allSubways
        });
     }

    try{
        let subwaysForCurentApartment = await Subway.findAll({
            attributes:['id'],
            include:{
                model: Apartment,
                where:{
                    id:apartmentId
                }
            }});
        let subwaysIdsForCurrentApartment = subwaysForCurentApartment.map(el=>el.id);
        let allSubways = await Subway.findAll({
            where: {
                id:{
                    [Op.not]:subwaysIdsForCurrentApartment
                }
            }
        });
        if(!allSubways){
            return res.json({
                status:'error',
                msg:'не было найдено ни одного метро'
            });
        }

        return res.json({
            status:'ok',
            subways:allSubways
        });
    } catch(e){

    }
    return res.json({
        status:'ok',
        msg:'get all for apartment'
    })
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

