

require('dotenv').config();
const DOMAIN_ROOT = process.env.DOMAIN_ROOT;
const axios = require('axios');


class BotApi {
    constructor(key) {
        this.key = key;
    }
    // await axios.post(DOMAIN_ROOT + '/api/order/create', orderData)
    async createOrder(orderData) {
        // let response = await axios.post(`${DOMAIN_ROOT}/api/order/create/?telbot_key=${this.key}`, orderData);
        let response = await axios.post(`${DOMAIN_ROOT}/api/telegram/create-order/?telbot_key=${this.key}`, orderData);
        return response;
    }
    /**
   * 
   * @param {*} apartmentIds  array of ids
   */
    async getApartmentsByIds(apartmentIds) {
        let response = await axios.post(`${DOMAIN_ROOT}/api/telegram/apartmentsbyids/?telbot_key=${this.key}`, { apartmentIds });
        return response;
    }
    async getApartmetnsWithBySubWayId(subwayId) {
        // let response = await axios.get(`${DOMAIN_ROOT}/api/apartments-subway/rooms-amount/${subwayId}/?telbot_key=${this.key}`);
        let response = await axios.get(`${DOMAIN_ROOT}/api/telegram/rooms-amount/${subwayId}/?telbot_key=${this.key}`);
        return response;
    }
}
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

module.exports = { ApartmentApi, BotApi };