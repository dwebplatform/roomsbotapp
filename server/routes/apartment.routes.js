

const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
const { tokenHandler } = require('../utils/tokenMiddleWare');
module.exports = (app) => {

    const apartmentController = require('../controllers/apartment.controller');
    const router = require("express").Router();

    router.get('/all-without-pagination', apartmentController.allApartmentsWithoutPaggination);
    router.get('/all', apartmentController.allApartments);
    router.post('/add-images/:apartmentId', tokenHandler, apartmentController.addImagesToApartment);
    router.post('/create', tokenHandler, apartmentController.createApartment);
    router.post('/update-basic-fields/:apartmentId', tokenHandler, apartmentController.updateBasicFields);
    router.post('/delete-image-by-index', tokenHandler, apartmentController.deleteImageByIndex);
    router.post('/delete/:apartmentId', tokenHandler, apartmentController.deleteById);
    router.get('/:apartmentId', apartmentController.getApartmentById);
    router.post('/:apartmentId/remove-subway/:subwayId', tokenHandler, apartmentController.removeSubWayFromApartment);

    app.use('/api/apartments', router);
};
