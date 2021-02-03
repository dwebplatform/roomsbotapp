
export function immitateDeletionServiceFromApartment(servicesForCurrentApartment, serviceId) {
    servicesForCurrentApartment.data = servicesForCurrentApartment.data.filter((item) => {
        return item.id != serviceId
    });
    return servicesForCurrentApartment;
}

export function immitateAddServiceToApartment(data,service){
	let copy =  [...data];
	let isServiceAlreadyThere = false;
            copy.forEach((item)=>{
                if(item.id ==service.id){
                        isServiceAlreadyThere = true;
                }
			});
	if(!isServiceAlreadyThere){
		copy = [...copy, service];
    }
    return copy;

}