
const { Subway } = require('../models');
const paginate = require('express-paginate');
const { Op } = require('sequelize');

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