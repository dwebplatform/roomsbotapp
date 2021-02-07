
import axios from 'axios';
export class ServiceUtilContainer {
    constructor() {
    }
    config() {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
        return config;
    }

    async renameSubWayById(subWayId, name) {
        let response = await axios.post('/api/subway/update', { subWayId, name }, this.config());
        return response;
    }
    async getToken(email, pass) {
        let response = await axios.post('/api/login', {
            email,
            pass
        });
        return response;
    }
    async deleteService(serviceId) {
        let response = await axios.post('/api/services/delete', {
            serviceId
        }, this.config());
        return response;
    }
    async addService(serviceName) {
        let response = await axios.post('/api/services/create', {
            serviceName
        }, this.config());
        return response;
    }
    async deleteSubWayById(subwayId) {
        let response = await axios.post(`/api/subway/delete/${subwayId}`, {}, this.config());
        return response;
    }
    async updateServiceName(serviceId, newServiceName) {
        let response = await axios.post('/api/services/update',
            {
                serviceId,
                newServiceName
            }, this.config());
        return response;
    }
    async addServiceToApartment(apartmentId, selectedServiceId) {

        let response = await axios.post('/api/services/add-to-apartment', {
            apartmentId,
            selectedServiceId
        }, this.config());
        return response;
    }

    async getAllServices() {
        let response = await axios.get('/api/services/all');
        return response;
    }
    async deleteServiceFromApartmentAction(apartmentId, serviceId) {
        let response = await axios.post('/api/services/remove-from-apartment', {
            apartmentId,
            serviceId
        }, this.config());
        return response;
    }
    async getServicesForApartment(apartmentId) {
        let response = await axios.get(`/api/services/all-for-apartment/${apartmentId}`, this.config());
        return response;
    }
    async addSubway(name, geo) {
        let response = await axios.post('/api/subway/add', { name, geo }, this.config());
        return response;
    }
    async removeSubWayFromApartment(apartmentId, subwayId) {
        let response = await axios.post(`/api/apartments/${apartmentId}/remove-subway/${subwayId}`, this.config());
        return response;
    }
    /*
    * 
    route("/api/subway/all)" */
    async getAllSubWays() {
        let response = await axios.get('/api/subway/all', this.config());
        return response;
    }
    async deleteApartmentById(apartmentId) {
        let response = await axios.post(`/api/apartments/delete/${apartmentId}`, this.config());
        return response;
    }
    async addSubwayForApartment(addedSubwayId, apartmentId) {
        let response = await axios.post('/api/apartments-subway/add-to-apartment', {
            addedSubwayId, apartmentId
        }, this.config());
        return response;
    }
    async getAllSubway(apartmentId = null) {
        let url = '/api/apartments-subway/allsubway-for-apartment/';
        if (typeof apartmentId !== 'null') {
            url += apartmentId;
        }
        let response = axios.get(url, this.config());
        return response;
    }
    async addNewImageToApartment(apartmentId, imageFilesArray) {
        let formData = new FormData();
        imageFilesArray.forEach((file, index) => {
            formData.append(`apartment_added_image_${index}`, file);
        });
        let response = await axios.post(`/api/apartments/add-images/${apartmentId}`, formData, this.config());
        return response;
    }
    async updateApartmentById(apartmentId, fields) {
        let response = await axios.post(`/api/apartments/update-basic-fields/${apartmentId}`, fields, this.config());
        return response;
    }
    async deleteApartmentImageByIndex(apartmentId, imageIndex) {
        let response = await axios.post(`/api/apartments/delete-image-by-index`, {
            apartmentId, imageIndex
        }, this.config());
        return response;
    }
    async getApartmentById(apartmentId) {
        let response = await axios.get(`/api/apartments/${apartmentId}`, this.config());
        return response;
    }
    async getAllApartments() {
        let response = await axios.get('/api/apartments/all-without-pagination', this.config());
        return response;
    }
    async createApartment(data) {
        // формируем formData
        let formData = new FormData();
        let index = 1;
        data.images.forEach((image) => {
            formData.append(`image_${index}`, image);
            index++;
        });
        delete data['images'];
        // create formData 
        for (let key in data) {
            formData.append(key, data[key]);
        }
        let response = await axios.post('/api/apartments/create', formData, this.config());
        return response;
    }
    async updateOrderStatus(selectedStatus, orderId) {
        try {
            let response = await fetch('/api/order/update-status', {
                method: 'POST',
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedStatus, orderId })
            });
            let data = response.json();
            return data;
        } catch (e) {
            console.log(e);
            return {
                status: 'error'
            };
        }
    }
    async getOrders(page = 1, { filterObject }) {
        let finalUrl = '/api/order/all/?limit=5&page=' + page;
        if (filterObject.fromDate) {
            finalUrl += '&from=' + filterObject.fromDate
        }
        if (filterObject.toDate) {
            finalUrl += '&to=' + filterObject.toDate;
        }
        let { data } = await axios.get(finalUrl, this.config());
        console.log(filterObject, "FILTER OBJECT")
        return data;
    }
}


export class DummyContainer {
    constructor() {
    }
    async updateOrderStatus(selectedStatus, orderId) {

    }
    async getOrders(page = 1, { filterObject }) {
        return { "status": "ok", "orders": [{ "fullInfo": { "client": { "name": "Карл", "secondname": "Марков", "email": "dummy@mail.ru", "phone": 88005553535 }, "rooms": [{ "id": 1, "address": "ул Глупнинская дом 9 кв 104", "price": 3600, "roomAmount": 3, "services": "['Уборка','Стирка','Гладка']", "withChilds": true, "withAnimals": false }] }, "id": 5, "status": 0, "createdAt": "2021-01-24T13:39:23.000Z", "updatedAt": "2021-01-24T13:39:23.000Z" }, { "fullInfo": { "client": { "name": "Bob", "secondname": "Marlie", "email": "karpov-vb-1996@mail.ru", "phone": 8808555 }, "rooms": [{ "id": 1, "address": "ул Тушинская дом 3 кв 67", "price": 2800, "roomAmount": 3, "services": "['Уборка','Стирка','Гладка']", "withChilds": true, "withAnimals": false }] }, "id": 11, "status": 0, "createdAt": "2021-01-24T14:01:39.000Z", "updatedAt": "2021-01-24T14:01:39.000Z" }, { "fullInfo": { "client": { "name": "Bob", "secondname": "Marlie", "email": "karpov-vb-1996@mail.ru", "phone": 8808555 }, "rooms": [{ "id": 1, "address": "ул Тушинская дом 3 кв 67", "price": 2800, "personsAmount": 3, "roomAmount": 3, "services": "['Уборка','Стирка','Гладка']", "withChilds": true, "withAnimals": false }] }, "id": 12, "status": 0, "createdAt": "2021-01-24T14:07:52.000Z", "updatedAt": "2021-01-24T14:07:52.000Z" }] }
    }
}