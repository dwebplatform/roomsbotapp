

const { Apartment } = require('../models');
const paginate = require('express-paginate');


exports.allApartmentsWithoutPaggination = async (req, res) => {
    let allapartments = [];
    try {
        allapartments = await Apartment.findAll();
    } catch (e) {
        return res.json({
            status: 'error'
        })
    }
    return res.json({
        status: 'ok',
        apartments: allapartments
    });
};
exports.allApartments = async (req, res) => {
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
}