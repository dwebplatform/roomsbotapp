

const paginate = require('express-paginate');
const { Order } = require('../models');
const { tokenHandler } = require('../utils/tokenMiddleWare');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    const orderController = require('../controllers/order.controller');
    const router = require("express").Router();
    router.post('/update-status', orderController.updateStatus);
    router.post('/create', orderController.createOrder);
    router.get('/all', tokenHandler, orderController.getAllOrders);
    router.get('/check-limit', async (req, res) => {
        let ordersWithCount = await Order.findAndCountAll({ limit: req.query.limit, offset: req.skip });
        const itemCount = ordersWithCount.count;
        const pageCount = Math.ceil(ordersWithCount.count / (req.query.limit || 1));
        return res.json({
            status: 'ok',
            orders: ordersWithCount.rows,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
    });
    app.use('/api/order', router);
};
