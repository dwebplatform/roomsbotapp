import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import { DELETE_SUBWAY_BY_ID_SUCCESS, DELETE_SUBWAY_BY_ID_ERROR,IMAGE_ADD_TO_APARTMENT_FAIL, REMOVE_SUBWAY_FROM_APARTMENT_ERROR, ADD_SUBWAY_TO_APARTMENT_ERROR, ADD_SERVICE_TO_APARTMENT_ERROR, UPDATE_SERVICE_NAME_ERROR, UPDATE_SERVICE_NAME_SUCCESS, ADD_SERVICE_TO_APARTMENT_SUCCESS, GET_ALL_SERVICES_SUCCESS, GET_ALL_SERVICES_ERROR, REMOVE_SERVICE_FROM_APARTMENT_SUCCESS, REMOVE_SERVICE_FROM_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_SUCCESS, DELETE_APARTMENT_BY_ID_SUCCESS, REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS, GET_ORDERS, CREATE_APARTMENT, ADD_SUBWAY_TO_APARTMENT_SUCCESS, CREATE_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS, GET_APARTMENTS, IMAGE_ADD_TO_APARTMENT_SUCESS, GET_APARTMENT_BY_ID, DELETE_APARTMENT_IMAGE_SUCCESS, ADD_SUBWAY_ERROR, ADD_SUBWAY_SUCCESS, UPDATE_BASIC_FIELDS_SUCCESS, DELETE_APARTMENT_BY_ID_ERROR } from "./actions";
import { immitateDeletionServiceFromApartment, immitateAddServiceToApartment } from "./redux-helpers";


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

        case DELETE_SUBWAY_BY_ID_SUCCESS:
        
        return {
            ...state,
             subwaysNotIncludedInApartment: {
                    ...state.subwaysNotIncludedInApartment,
                        data: payload.subways,
                }
        }
        case DELETE_SUBWAY_BY_ID_ERROR:
        return {
            ...state,
        }
        case UPDATE_SERVICE_NAME_ERROR:
            return {
                ...state,
                popupInfo: {
                    error: {
                        msg: 'Не удалось обновить данные'
                    }
                }
            };
        case UPDATE_SERVICE_NAME_SUCCESS:
            let servicesCopy = [...state.services.data];
            servicesCopy = payload.services;
            return {
                ...state,
                services: {
                    ...state.services,
                    data: servicesCopy
                },
                popupInfo: {
                    updateServiceSuccess: true
                }
            }
        case ADD_SERVICE_TO_APARTMENT_ERROR:
            return {
                ...state,
                popupInfo: {
                    error: {
                        msg: 'при добавлении сервиса к текущей квартире произошла ошибка'
                    }
                }
            }
        case ADD_SERVICE_TO_APARTMENT_SUCCESS:
            // добавляем к услугам для ТЕКУЩЕГО
            // квартиры
            // let copy = state.servicesForCurrentApartment.data;
            // let isServiceAlreadyThere = false;
            // copy.forEach((item)=>{
            //     if(item.id ==payload.service.id){
            //             isServiceAlreadyThere = true;
            //     }
            // })
            // if(!isServiceAlreadyThere){
            //     copy = [...copy, payload.service];
            // }

            return {
                ...state,
                servicesForCurrentApartment: {
                    ...state.servicesForCurrentApartment,
                    data: immitateAddServiceToApartment(state.servicesForCurrentApartment.data, payload.service)
                },
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
        case REMOVE_SUBWAY_FROM_APARTMENT_ERROR:
            return {
                ...state,
                popupInfo: {
                    error: {
                        msg: 'при удалении метро из текущей квартиры произошла ошибка'
                    }
                }
            }
        case REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    removeSubWayFromApartmentSuccess: true
                }
            }
        case DELETE_APARTMENT_BY_ID_ERROR:
            return {
                ...state,
                popupInfo: {
                    deletedApartmentSuccess: false
                }
            }
        case DELETE_APARTMENT_BY_ID_SUCCESS:
            return {
                ...state,
                popupInfo: {
                    deletedApartmentSuccess: true
                }
            }

        case ADD_SUBWAY_TO_APARTMENT_ERROR:
            return {
                ...state,
                popupInfo: {
                    subwayAdded: false
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
        case IMAGE_ADD_TO_APARTMENT_FAIL:
            return {
                ...state,
                popupInfo: {
                    successfullyAdded: false
                }
            };
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
        case UPDATE_BASIC_FIELDS_SUCCESS:
            return {
                ...state
            }
        default:
            return state;
    }

};

export default reducer;
