
const { Subway } = require('../models');
const paginate = require('express-paginate');
const { Op } = require('sequelize');

exports.updateSubWay = async (req, res) => {
    const { subWayId, name } = req.body;
    if (!subWayId || typeof name == 'undefined') {
        return res.json({
            status: 'error',
            msg: 'не был передан id'
        });
    }
    try {
        let curSubWay = await Subway.findOne({ where: { id: subWayId } });
        curSubWay.name = name;
        await curSubWay.save();
        return res.json({
            status: 'ok',
            msg: 'updated'
        });
    } catch (e) {

    }
    return res.json({
        status: 'ok',
        msg: 'updated'
    });
}

exports.addSubWay = async (req, res) => {

    let { name, geo } = req.body;

    if (typeof name == 'undefined') {
        return res.json({
            status: 'error',
            msg: 'не правильно было передано поле name'
        });
    }
    // check if there is already subway with same name
    let findedSubwayWithSameName = await Subway.findOne({
        where: {
            name: name
        }
    });
    if (findedSubwayWithSameName) {
        return res.json({
            status: 'error',
            msg: 'Такое метро уже есть'
        });
    }
    try {
        let [lat, long] = geo.split(',');
        if (!lat || !long) {
            return res.json({
                status: 'error',
                msg: 'не правильно было передано поле geo'
            });
        }

        let newSubWayInstance = await Subway.create({
            name: name,
            geo: [lat, long]
        });
        return res.json({
            status: 'ok',
            msg: 'успешно создано новое метро'
        })
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'Что-то пошло не так'
        });
    }
    return res.json({
        status: 'ok',
        msg: 'Успешно добавлена новая запись'
    });
}
exports.allSubWay = async (req, res) => {
    try {
        let subways = await Subway.findAll();
        return res.json({
            status: 'ok',
            subways: subways
        });
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось получить все метро'
        })
    }
}

exports.subWayById = async (req, res) => {
    let { subWayId } = req.params;
    if (!subWayId) {
        return res.json({
            staus: 'error',
            msg: 'не был передан id метро'
        });
    }
    try {
        let subway = await Subway.findOne({
            where: {
                id: subWayId
            }
        });
        return res.json({
            status: 'ok',
            subways: subway
        });
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось получить все метро'
        })
    }
}

exports.deleteSubWay = async (req, res) => {
    let { subwayId } = req.params;
    try {
        let findedSubway = await Subway.destroy({
            where: {
                id: subwayId
            }
        });
        let allSubWay = await Subway.findAll();
        return res.json({
            status: 'ok',
            subways: allSubWay,
            msg: 'метро успешно удалено'
        });
    } catch (e) {
        return res.json({
            status: 'error',
            msg: 'не удалось удалить'
        });
    }

}