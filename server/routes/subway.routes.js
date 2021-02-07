
const { tokenHandler } = require('../utils/tokenMiddleWare');
const paginate = require('express-paginate');
const { Order } = require('../models');
module.exports = (app) => {
    const subWayController = require('../controllers/subway.controller');
    const router = require("express").Router();
    router.get('/all', tokenHandler, subWayController.allSubWay);
    router.post('/add', tokenHandler, subWayController.addSubWay);
    router.post('/update', tokenHandler, subWayController.updateSubWay);
    router.post('/delete/:subwayId', tokenHandler, subWayController.deleteSubWay);
    app.use('/api/subway', router);
};
