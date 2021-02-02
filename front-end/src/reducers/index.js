import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import { ADD_SERVICE_TO_APARTMENT_SUCCESS, GET_ALL_SERVICES_SUCCESS, GET_ALL_SERVICES_ERROR, REMOVE_SERVICE_FROM_APARTMENT_SUCCESS, REMOVE_SERVICE_FROM_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_SUCCESS, DELETE_APARTMENT_BY_ID_SUCCESS, REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS, GET_ORDERS, CREATE_APARTMENT, ADD_SUBWAY_TO_APARTMENT_SUCCESS, CREATE_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS, GET_APARTMENTS, IMAGE_ADD_TO_APARTMENT_SUCESS, GET_APARTMENT_BY_ID, DELETE_APARTMENT_IMAGE_SUCCESS, ADD_SUBWAY_ERROR, ADD_SUBWAY_SUCCESS } from "./actions";
import { immitateDeletionServiceFromApartment } from "./redux-helpers";


// тут только одну переменную меняешь
let isDummy = false;
const initialState = {
    serviceUtilContainer: !isDummy ? new ServiceUtilContainer() : new DummyContainer(),
    orders: {
        data: [],
        error: false,
        loading: false
    },
    subwaysNotIncludedInApartment: {
        data: [],
        error: false,
        loading: false
    },

    apartment: {
        data: {},
        error: false,
        loading: false
    },
    // услуги типа уборка постель и тд
    services: {
        data: [],
        error: false,
        loading: false
    },
    apartments: {
        data: [],
        error: false,
        loading: false
    },
    servicesForCurrentApartment: {
        data: [],
        error: false,
        loading: false
    },
    popupInfo: {
    }
};

const reducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case ADD_SERVICE_TO_APARTMENT_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    serviceAddToApartmentSuccess: true
                }
            }
        case GET_ALL_SERVICES_SUCCESS:
            return {
                ...state,
                services: {
                    data: payload.services,
                    error: false,
                    loading: false
                },
            }
        case GET_ALL_SERVICES_ERROR:
            return {
                ...state,
                services: {
                    data: [],
                    error: {
                        msg: 'Не удалось получить ни одной услуги'
                    },
                    loading: false
                }
            }
        case REMOVE_SERVICE_FROM_APARTMENT_ERROR:
            return {
                ...state,
                popupInfo: {
                    error: {
                        msg: 'не удалось удалить услугу произошла ошибка на сервере'
                    }
                }
            }
        case REMOVE_SERVICE_FROM_APARTMENT_SUCCESS:
            //TODO: сделать аналогично для добавления
            let servicesForCurrentApartmentAfterDelete = immitateDeletionServiceFromApartment(state.servicesForCurrentApartment, payload.serviceId);

            return {
                ...state,
                servicesForCurrentApartment: servicesForCurrentApartmentAfterDelete,
                popupInfo: {
                    removeApartmentFromApartmentSuccess: true
                }
            }
        case GET_SERVICE_TO_APARTMENT_SUCCESS:
            return {
                ...state,

                servicesForCurrentApartment: {
                    data: payload.services,
                    error: false,
                    loading: false
                }
            };
        case GET_SERVICE_TO_APARTMENT_ERROR:
            return {
                ...state,
                servicesForCurrentApartment: {
                    data: [],
                    error: {
                        msg: 'Не было получено услуг для текущей квартиры'
                    },
                    loading: false
                }
            };
        case ADD_SUBWAY_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    success: {
                        msg: payload.msg
                    }
                }
            }
        case ADD_SUBWAY_ERROR:
            return {
                ...state,
                popupInfo: {
                    error: {
                        msg: payload.msg
                    }
                }
            };
        case REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    removeSubWayFromApartmentSuccess: true
                }
            }
        case DELETE_APARTMENT_BY_ID_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    deletedApartmentSuccess: true
                }
            }
        case ADD_SUBWAY_TO_APARTMENT_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    subwayAdded: true
                }
            }
        case GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR:
            return {
                ...state,
                subwaysNotIncludedInApartment: {
                    data: [],
                    error: true,
                    loading: false
                }
            };
        case GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS:
            return {
                ...state,
                subwaysNotIncludedInApartment: {
                    data: payload.subways,
                    error: false,
                    loading: false
                }
            }
        case IMAGE_ADD_TO_APARTMENT_SUCESS:
            return {
                ...state,
                popupInfo: {
                    successfullyAdded: true
                }
            };

        case DELETE_APARTMENT_IMAGE_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    apartmentImageDeleted: true
                }
            };
        case GET_APARTMENT_BY_ID:
            return {
                ...state,
                apartment: {
                    error: false,
                    loading: false,
                    data: payload.apartment
                }
            };
        case GET_APARTMENTS:
            return {
                ...state,
                apartments: {
                    ...state.apartments,
                    data: payload.apartments,
                    error: false,
                    loading: false,
                }
            }
        case CREATE_APARTMENT_ERROR:
            return {
                ...state,
                popupInfo: {
                    msg: ' произошла ошибка при попытке создать квартиру'
                }
            };
        case CREATE_APARTMENT:
            return {
                ...state,
                popupInfo: {
                    ...payload
                }
            }
        case GET_ORDERS:
            return {
                ...state,
                orders: {
                    data: payload.data ? payload.data : [],
                    error: payload.error,
                    loading: payload.loading
                }
            };
        default:
            return state;
    }
};

export default reducer;
