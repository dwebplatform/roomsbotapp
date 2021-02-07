


const paginate = require('express-paginate');
const { tokenHandler } = require('../utils/tokenMiddleWare');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    const servicesController = require('../controllers/services.controller');
    const router = require("express").Router();
    router.get('/all', servicesController.getAllServices);
    router.get('/all-for-apartment/:apartmentId', servicesController.getServicesForApartment);
    router.post('/remove-from-apartment', tokenHandler, servicesController.removeServiceFromApartment);
    router.post('/add-to-apartment', tokenHandler, servicesController.addServiceToApartment);
    router.post('/create', tokenHandler, servicesController.createNewService);
    router.post('/update', tokenHandler, servicesController.updateServiceName);
    router.post('/delete', tokenHandler, servicesController.deleteService);
    app.use('/api/services', router);
};


