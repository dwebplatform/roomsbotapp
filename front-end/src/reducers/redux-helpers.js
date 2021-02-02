
export function immitateDeletionServiceFromApartment(servicesForCurrentApartment, serviceId) {
    servicesForCurrentApartment.data = servicesForCurrentApartment.data.filter((item) => {
        return item.id != serviceId
    });
    return servicesForCurrentApartment;
}