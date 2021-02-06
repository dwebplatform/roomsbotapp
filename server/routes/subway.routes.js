

const paginate = require('express-paginate');
const { Order } = require('../models');
module.exports = (app) => {
    const subWayController = require('../controllers/subway.controller');
    const router = require("express").Router();
    router.get('/all', subWayController.allSubWay);
    router.post('/add', subWayController.addSubWay);
    router.post('/update', subWayController.updateSubWay);
    router.post('/delete/:subwayId', subWayController.deleteSubWay);
    app.use('/api/subway', router);
};
