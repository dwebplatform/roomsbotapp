

const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');

    const apartmentController = require('../controllers/apartment.controller');
    const router = require("express").Router();
    router.get('/all-without-pagination', apartmentController.allApartmentsWithoutPaggination);
    router.get('/all', apartmentController.allApartments);
    router.post('/add-images/:apartmentId', apartmentController.addImagesToApartment);
    router.post('/create', apartmentController.createApartment);
    router.post('/update-basic-fields/:apartmentId',apartmentController.updateBasicFields);
    router.post('/delete-image-by-index', apartmentController.deleteImageByIndex);
    router.post('/delete/:apartmentId',apartmentController.deleteById);
    router.get('/:apartmentId', apartmentController.getApartmentById);
    app.use('/api/apartments', router);
};
