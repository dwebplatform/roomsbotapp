


const { Subway, Service, Apartment } = require('../models');
const paginate = require('express-paginate');
const { Op } = require('sequelize');



exports.removeServiceFromApartment = async(req,res)=>{
     let {apartmentId,serviceId} = req.body;
     if(!apartmentId||!serviceId){
     	return res.json({
     		status:'error',
     		msg:'не был передан id комнаты или услуги'
     	});
     }
     try{
     	let curApartment = await Apartment.findOne({
     		where:{
     			id:apartmentId
     		}
     	});
     	if(!curApartment){
     		return res.json({
     			status:'error',
     			msg:'не удалось найти соответствующей квартиры'
     		});
     	}

     	let curService = await Service.findOne({
     		where:{
     			id:serviceId
     		}
     	});
     	if(!curService){
		return res.json({
     			status:'error',
     			msg:'не удалось найти соответствующей услуги'
     		});
     	}
     	await curApartment.removeService(curService);
      	return res.json({
     		status:'ok',
     		msg:'Успешно убрана услуга для текущей квартиры'
     	});

     } catch(e){
     	return res.json({
     		status:'error',
     		msg:'Не удалось убрать услугу из данной квартиры'
     	})
     }
	return res.json({
		status:'ok',
		msg:'успешно убрана услуга из данной комнаты'
	});
}

exports.getServicesForApartment = async(req,res)=>{
	
	let { apartmentId } = req.params;
	if(!apartmentId){
		return res.json({
			status:'error',
			msg:'не был передан id квартиры'
		});
	}
	try{

		const services = await Service.findAll({
			include:{
				model:Apartment,
				where:{
					id:apartmentId
				}
			}
		});
		if(!services){
			return res.json({
				status:'error',
				msg:'не удалось найти ни одной услуги для данной квартиры'
			});
		}
		return res.json({
			status:'ok',
			services
		});
	} catch(e){
		return res.json({
			status:'error',
			msg:'не удалось найти ни одной услуги для данной квартиры'
		})
	}
	return res.json({
	status:'ok',
	msg:'get services for current apartment'
	});
}

exports.getAllServices = async(req,res)=>{
	try{
		let services = await Service.findAll({});
		if(!services){
			return res.json({
				status:'error',
				msg:'не было найдено ни одной услуги'
			});		
		}
		return res.json({
			status:'ok',
			services:services
		});
	} catch(e){
		return res.json({
			status:'error',
			msg:'не было найдено ни одной услуги'
		});
	}

}


exports.addServiceToApartment = async(req,res)=>{
	let {apartmentId,selectedServiceId} = req.body;
	if(!apartmentId||!selectedServiceId){
		return res.json({
			status:'eror',
			msg:'не все поля были получены'
		});
	}

	try{
		let curApartment = await Apartment.findOne({where:{
			id:apartmentId
		}});
		let addedService = await Service.findOne({
			where:{
				id:selectedServiceId
			}
		});
		curApartment.addService(addedService);
		return res.json({
			status:'ok',
			service:addedService,
			msg:'услуга добавлена к текущей квартире'
		});
	} catch(e){
		return res.json({
			status:'error',
			msg:'не удалось добавить услуги к квартире'
		})
	}
}


exports.updateServiceName = async(req,res)=>{
	let {serviceId, newServiceName} = req.body;
	if(!serviceId||!newServiceName){
		return res.json({
			status:'error',
			msg:'не все поля были переданы'
		});
	}
	try{
	 let findedService = await Service.findOne({
	 	where:{
	 		id:serviceId
	 	}
	 });
	findedService.name = newServiceName;
	await findedService.save();
	let allServices = await Service.findAll({});
	return res.json({
		status:'ok',
		msg:'updated succefully',
		services: allServices
	});
	} catch(e){
		return res.json({
			status:'error',
			msg:'не удалось обновить данной услуги'
		})
	} 
}
