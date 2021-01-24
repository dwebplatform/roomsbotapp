module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    const orderController = require('../controllers/order.controller');
    const router = require("express").Router();
    router.post('/create', orderController.createOrder);
    router.get('/all', orderController.getAllOrders);
    app.use('/api/order', router);
};
