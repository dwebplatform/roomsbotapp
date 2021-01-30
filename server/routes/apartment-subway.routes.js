

const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    // const orderController = require('../controllers/order.controller');
    const apartmentSubwayController = require('../controllers/apartmentsubway.controller');
    const router = require("express").Router();

    router.post('/apartmentsbyids', apartmentSubwayController.getApartmentsByIds);
    router.get('/rooms-amount/:subwayId', apartmentSubwayController.AmountOfRoomsWithApartmentIdsBySubwayId);
    router.get('/allsubway', apartmentSubwayController.allSubway);
    router.get('/allsubway/:id', apartmentSubwayController.getSubById);

    app.use('/api/apartments-subway', router);
};
