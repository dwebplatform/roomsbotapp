const { Subway } = require('../models');

exports.allSubway = async (req, res) => {
    let allSubways;
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