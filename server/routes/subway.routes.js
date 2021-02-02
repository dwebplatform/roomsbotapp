

const paginate = require('express-paginate');
const { Order } = require('../models');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    const subWayController = require('../controllers/subway.controller');
    const router = require("express").Router();
    router.get('/all', subWayController.allSubWay);
    router.post('/add', subWayController.addSubWay);
    app.use('/api/subway', router);
};
