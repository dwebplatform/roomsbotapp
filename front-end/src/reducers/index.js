import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import { GET_TOKEN_SUCCESS, GET_TOKEN_ERROR, DELETE_SUBWAY_BY_ID_SUCCESS, DELETE_SUBWAY_BY_ID_ERROR, IMAGE_ADD_TO_APARTMENT_FAIL, REMOVE_SUBWAY_FROM_APARTMENT_ERROR, ADD_SUBWAY_TO_APARTMENT_ERROR, ADD_SERVICE_TO_APARTMENT_ERROR, UPDATE_SERVICE_NAME_ERROR, UPDATE_SERVICE_NAME_SUCCESS, ADD_SERVICE_TO_APARTMENT_SUCCESS, GET_ALL_SERVICES_SUCCESS, GET_ALL_SERVICES_ERROR, REMOVE_SERVICE_FROM_APARTMENT_SUCCESS, REMOVE_SERVICE_FROM_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_ERROR, GET_SERVICE_TO_APARTMENT_SUCCESS, DELETE_APARTMENT_BY_ID_SUCCESS, REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS, GET_ORDERS, CREATE_APARTMENT, ADD_SUBWAY_TO_APARTMENT_SUCCESS, CREATE_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR, GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS, GET_APARTMENTS, IMAGE_ADD_TO_APARTMENT_SUCESS, GET_APARTMENT_BY_ID, DELETE_APARTMENT_IMAGE_SUCCESS, ADD_SUBWAY_ERROR, ADD_SUBWAY_SUCCESS, UPDATE_BASIC_FIELDS_SUCCESS, DELETE_APARTMENT_BY_ID_ERROR, CLEAR_ORDER_EVENT, ADD_NEW_SERVICE_ERROR, ADD_NEW_SERVICE_SUCCESS, LOG_OUT, CHANGE_APARTMENT_ADRESS_FILTER } from "./actions";
import { immitateDeletionServiceFromApartment, immitateAddServiceToApartment } from "./redux-helpers";


// тут только одну переменную меняешь
let isDummy = false;
const initialState = {
    isAuth: localStorage.getItem('token') ? true : false,
    apartmentFilter: {
        adressField: ''
    },
    serviceUtilContainer: !isDummy ? new ServiceUtilContainer() : new DummyContainer(),
    orders: {
        data: [],
        error: false,
        loading: false
    },
    adminToken: localStorage.getItem('token') ? localStorage.getItem('token') : '',
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
        case LOG_OUT:
            localStorage.removeItem('token');
            return {
                ...state,
                isAuth: false
            }
        case GET_TOKEN_SUCCESS:
            console.log(payload);
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                isAuth: true,
                popupInfo: {}
            };
        case GET_TOKEN_ERROR:
            return {
                ...state,
                isAuth: false,
                popupInfo: {
                    authError: {
                        msg: 'Доступ был запрещен'
                    }
                }
            }
        case CHANGE_APARTMENT_ADRESS_FILTER:
            return {
                ...state,
                apartmentFilter: {
                    ...state.apartmentFilter,
                    adressField: payload.adressField
                }
            }
        case ADD_NEW_SERVICE_SUCCESS:

            return {
                ...state,

                popupInfo: {
                    addNewServiceSuccess: {
                        msg: 'успешно создана новая услуга'
                    }
                }
            }
        case ADD_NEW_SERVICE_ERROR:
            return {
                ...state,
                popupInfo: {
                    addNewServiceError: {
                        msg: 'не удалось создать новую услугу'
                    }
                }
            }
        case CLEAR_ORDER_EVENT:
            return {
                ...state,
                popupInfo: {}
            }
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
            //TODO: remove subway from current apartment
            let removedSubway = payload.subway;
            console.log({ removedSubway });
            // const { subway } = payload;
            let subwayAfterDeleted = state.apartment.data.Subways ? state.apartment.data.Subways : [];
            subwayAfterDeleted = subwayAfterDeleted.filter((item) => item.id != removedSubway.id);
            return {
                ...state,
                apartment: {
                    ...state.apartment,
                    data: {
                        ...state.apartment.data,
                        Subways: subwayAfterDeleted
                    }
                },
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
            const { subway } = payload;
            let subWaysForCurApartment = state.apartment.data.Subways ? state.apartment.data.Subways : [];
            subWaysForCurApartment = [...subWaysForCurApartment, subway]; // добавляем в subway для текушей квартиры
            // и убираем из subwaysNotIncludedInApartment данное метро
            // state.subwaysNotIncludedInApartment = state.subwaysNotIncludedInApartment.filter((subwayItem) => subwayItem.id != subway.id);
            let curSubWayInSelector = [...state.subwaysNotIncludedInApartment.data] || [];
            curSubWayInSelector = curSubWayInSelector.filter((subwayItem) => subwayItem.id !== subway.id);

            return {
                ...state,
                subwaysNotIncludedInApartment: {
                    ...state.subwaysNotIncludedInApartment,
                    data: curSubWayInSelector
                },
                apartment: {
                    ...state.apartment,
                    data: {
                        ...state.apartment.data,
                        Subways: subWaysForCurApartment
                    }
                },
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
                    msg: 'произошла ошибка при попытке создать квартиру'
                }
            };
        case CREATE_APARTMENT:
            return {
                ...state,
                popupInfo: {
                    createApartmentEvent: {
                        msg: 'Квартира была создана успешно'
                    },
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
