

require('dotenv').config();
const DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const axios = require('axios');

class ApartmentApi {


    /**
     * 
     * @param {*} apartmentIds  array of ids
     */
    async getApartmentsByIds(apartmentIds) {
        let response = await axios.post(`${DOMAIN_ROOT}/api/apartments-subway/apartmentsbyids`, { apartmentIds });
        return response;
    }
    async getApartmetnsWithBySubWayId(subwayId) {
        let response = await axios.get(`${DOMAIN_ROOT}/api/apartments-subway/rooms-amount/${subwayId}`);
        return response;
    }

}

module.exports = { ApartmentApi };