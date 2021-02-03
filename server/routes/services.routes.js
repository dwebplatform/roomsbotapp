


const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    const servicesController = require('../controllers/services.controller');
    const router = require("express").Router();
    router.get('/all',servicesController.getAllServices);    
    router.post('/remove-from-apartment', servicesController.removeServiceFromApartment);
	router.get('/all-for-apartment/:apartmentId',servicesController.getServicesForApartment);    
    router.post('/add-to-apartment',servicesController.addServiceToApartment);
    router.post('/update', servicesController.updateServiceName);
    app.use('/api/services', router);
};


