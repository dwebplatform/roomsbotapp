

const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');

    const apartmentController = require('../controllers/apartment.controller');
    const router = require("express").Router();
    router.get('/all-without-pagination', apartmentController.allApartmentsWithoutPaggination);
    router.get('/all', apartmentController.allApartments);
    app.use('/api/apartments', router);
};
