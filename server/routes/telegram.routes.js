require('dotenv').config();
function telergramMiddleWare(req, res, next) {
    if (req.query.telbot_key !== '1234') {
        return res.json({
            status: 'error',
            msg: 'wrong bot'
        });
    } else {
        next();
    }
}
module.exports = (app) => {
    const telegramController = require('../controllers/telegram.controller');
    const router = require("express").Router();
    //TODO: сделать проверку на ключ
    router.post('/apartmentsbyids', telergramMiddleWare, telegramController.getApartmentsByIds);
    router.get('/rooms-amount/:subwayId', telergramMiddleWare, telegramController.AmountOfRoomsWithApartmentIdsBySubwayId);
    router.post('/create-order', telergramMiddleWare, telegramController.createOrder);
    app.use('/api/telegram', router);
};


