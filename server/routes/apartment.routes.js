

const paginate = require('express-paginate');

const { Order, Apartment, Service } = require('../models');
module.exports = (app) => { // роуты для тренеров
    // const searchController = require('../controllers/search.controller');
    // const orderController = require('../controllers/order.controller');
    const router = require("express").Router();
    router.get('/all', async (req, res) => {
        let filterObject = {
            limit: req.query.limit, offset: req.skip,
            where: {}
        };
        let allApartments = await Apartment.findAndCountAll(filterObject);
        const itemCount = allApartments.count;
        const pageCount = Math.ceil(allApartments.count / (req.query.limit || 1));
        return res.json({
            status: 'ok',
            apartments: allApartments.rows,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        });
    });

    app.use('/api/apartments', router);
};
