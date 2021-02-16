export const CHANGE_APARTMENT_ADRESS_FILTER = "CHANGE_APARTMENT_ADRESS_FILTER";
export const GET_ORDERS = "GET_ORDERS";
export const GET_APARTMENTS = "GET_APARTMENTS";
export const GET_APARTMENT_BY_ID = "GET_APARTMENT_BY_ID";
export const GET_APARTMENT_BY_ID_ERROR = "GET_APARTMENT_BY_ID_ERROR";
export const GENERAL_ERROR = "GENERAL_ERROR";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const CREATE_APARTMENT = "CREATE_APARTMENT";
export const CREATE_APARTMENT_ERROR = "CREATE_APARTMENT_ERROR";
export const GET_ALL_APARTMENT_ERROR = "GET_ALL_APARTMENT_ERROR";
export const CHANGE_SUBWAY_NAME = "CHANGE_SUBWAY_NAME";
export const CHANGE_SUBWAY_NAME_ERROR = "CHANGE_SUBWAY_NAME_ERROR";

export const IMAGE_ADD_TO_APARTMENT_SUCESS = "IMAGE_ADD_TO_APARTMENT_SUCESS";
export const IMAGE_ADD_TO_APARTMENT_FAIL = "IMAGE_ADD_TO_APARTMENT_FAIL";

export const DELETE_APARTMENT_IMAGE_SUCCESS = "DELETE_APARTMENT_IMAGE_SUCCESS";
export const DELETE_APARTMENT_IMAGE_ERROR = "DELETE_APARTMENT_IMAGE_ERROR";
export const GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS = "GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS";
export const GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR = "GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR";

export const ADD_SUBWAY_TO_APARTMENT_SUCCESS = "ADD_SUBWAY_TO_APARTMENT_SUCCESS";
export const ADD_SUBWAY_TO_APARTMENT_ERROR = "ADD_SUBWAY_TO_APARTMENT_ERROR";

export const DELETE_APARTMENT_BY_ID_SUCCESS = "DELETE_APARTMENT_BY_ID_SUCCESS";
export const DELETE_APARTMENT_BY_ID_ERROR = "DELETE_APARTMENT_BY_ID_ERROR";

export const REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS = "REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS";
export const REMOVE_SUBWAY_FROM_APARTMENT_ERROR = "REMOVE_SUBWAY_FROM_APARTMENT_ERROR";

export const ADD_SUBWAY_SUCCESS = "ADD_SUBWAY_SUCCESS";
export const ADD_SUBWAY_ERROR = "ADD_SUBWAY_ERROR";

export const GET_SERVICE_TO_APARTMENT_SUCCESS = "GET_SERVICE_TO_APARTMENT_SUCCESS";
export const GET_SERVICE_TO_APARTMENT_ERROR = "GET_SERVICE_TO_APARTMENT_ERROR";

export const REMOVE_SERVICE_FROM_APARTMENT_SUCCESS = "REMOVE_SERVICE_FROM_APARTMENT_SUCCESS";
export const REMOVE_SERVICE_FROM_APARTMENT_ERROR = "REMOVE_SERVICE_FROM_APARTMENT_ERROR";

export const GET_ALL_SERVICES_SUCCESS = "GET_ALL_SERVICES_SUCCESS";
export const GET_ALL_SERVICES_ERROR = "GET_ALL_SERVICES_ERROR";

export const ADD_SERVICE_TO_APARTMENT_SUCCESS = "ADD_SERVICE_TO_APARTMENT_SUCCESS";
export const ADD_SERVICE_TO_APARTMENT_ERROR = "ADD_SERVICE_TO_APARTMENT_ERROR";

export const UPDATE_SERVICE_NAME_SUCCESS = "UPDATE_SERVICE_NAME_SUCCESS";
export const UPDATE_SERVICE_NAME_ERROR = "UPDATE_SERVICE_NAME_ERROR";

export const UPDATE_BASIC_FIELDS_SUCCESS = "UPDATE_BASIC_FIELDS_SUCCESS";

export const DELETE_SUBWAY_BY_ID_SUCCESS = "DELETE_SUBWAY_BY_ID_SUCCESS";
export const DELETE_SUBWAY_BY_ID_ERROR = "DELETE_SUBWAY_BY_ID_ERROR";

export const CLEAR_ORDER_EVENT = "CLEAR_ORDER_EVENT";

export const ADD_NEW_SERVICE_SUCCESS = "ADD_NEW_SERVICE_SUCCESS";
export const ADD_NEW_SERVICE_ERROR = "ADD_NEW_SERVICE_ERROR";

export const DELETE_SERVICE_SUCCESS = "DELETE_SERVICE_SUCCESS";
export const DELETE_SERVICE_ERROR = "DELETE_SERVICE_ERROR";


export const GET_TOKEN_SUCCESS = "GET_TOKEN_SUCCESS";
export const GET_TOKEN_ERROR = "GET_TOKEN_ERROR";

export const LOG_OUT = "LOG_OUT";
export const logoutAction = () => {
    return {
        type: LOG_OUT
    }
};
export const submitUserAction = (email, pass) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.getToken(email, pass);
    if (data.status == 'ok') {
        dispatch({
            type: GET_TOKEN_SUCCESS,
            payload: {
                token: data.token
            }
        });
    } else {
        dispatch({
            type: GET_TOKEN_ERROR,
            payload: {
                msg: 'не удалось войти'
            }
        });
    }
}
export const deleteServiceAction = (serviceId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteService(serviceId);
    if (data.status == 'ok') {
        dispatch({
            type: DELETE_SERVICE_SUCCESS,
            payload: {
                serviceId
            }
        })
    } else {
        dispatch({
            type: DELETE_SERVICE_ERROR
        });

    }
};
export const addServiceAction = (serviceName) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.addService(serviceName);

    if (data.status == "ok") {
        dispatch({
            type: ADD_NEW_SERVICE_SUCCESS,
            payload: {
                service: data.service
            }
        });
    } else {
        dispatch({
            type: ADD_NEW_SERVICE_ERROR,

        });
    }
}

export const renameSubWayAction = (subWayId, name) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.renameSubWayById(subWayId, name);
    console.log(data);
    if (data.status == 'ok') {
        dispatch({
            type: CHANGE_SUBWAY_NAME,
            payload: {
                name: name
            },
        })
    } else {
        dispatch({
            type: CHANGE_SUBWAY_NAME_ERROR,
            payload: {
                name: name
            },
        })
    }
}
export const handleDeleteSubWayAction = (subwayId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteSubWayById(subwayId);
    console.log(data)
    if (data.status == 'ok') {
        dispatch({

            type: DELETE_SUBWAY_BY_ID_SUCCESS,
            payload: {
                subways: data.subways
            }
        });
    } else {
        dispatch({
            type: DELETE_SUBWAY_BY_ID_ERROR
        });

    }

}
export const updateServiceNameAction = (serviceId, newServiceName) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.updateServiceName(serviceId, newServiceName);

    if (data.status === 'ok') {
        dispatch({
            payload: {
                services: data.services,
            },
            type: UPDATE_SERVICE_NAME_SUCCESS
        });
    } else {
        dispatch({
            type: UPDATE_SERVICE_NAME_ERROR

        })
    }
}
export const adressFilterChangeAction = (adressValue) => (dispatch) => {
    dispatch({
        type: CHANGE_APARTMENT_ADRESS_FILTER, payload: {
            adressField: adressValue
        }
    });
}

export const addServiceToApartmentAction = (apartmentId, selectedServiceId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.addServiceToApartment(apartmentId, selectedServiceId);
    if (data.status == 'ok') {
        dispatch({
            type: ADD_SERVICE_TO_APARTMENT_SUCCESS,
            payload: {
                service: data.service,
            }
        })
    } else {
        dispatch({
            type: ADD_SERVICE_TO_APARTMENT_ERROR
        });
    }


}
export const getAllServiceAction = () => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.getAllServices();
    if (data.status == 'ok') {
        dispatch({
            type: GET_ALL_SERVICES_SUCCESS,
            payload: {
                services: data.services
            }
        });
    } else {
        dispatch({
            type: GET_ALL_SERVICES_ERROR,
            payload: {
                services: [],

            }
        });
    }


}
export const deleteServiceFromApartmentAction = (apartmentId, serviceId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteServiceFromApartmentAction(apartmentId, serviceId);
    if (data.status === 'ok') {
        dispatch({
            type: REMOVE_SERVICE_FROM_APARTMENT_SUCCESS,
            payload: {
                apartmentId, serviceId
            }
        });
    } else {
        dispatch({
            type: REMOVE_SERVICE_FROM_APARTMENT_ERROR,
            payload: {
                error: true,
                loading: false
            }
        })
    }
}

export const getServicesForApartmentAction = (apartmentId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.getServicesForApartment(apartmentId);
    if (data.status == 'ok') {
        dispatch({
            type: GET_SERVICE_TO_APARTMENT_SUCCESS,
            payload: {
                services: data.services,
                error: false,
                loading: false
            }
        });
    } else {
        dispatch({
            type: GET_SERVICE_TO_APARTMENT_ERROR,
            payload: {
                services: [],
                error: true,
                loading: false,
            }
        });
    }
}

export const addSubWayAction = ({ name, geo }) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.addSubway(name, geo);
    if (data.status === 'ok') {
        dispatch({
            type: ADD_SUBWAY_SUCCESS,
            payload: {

                //TODO: msg из data
                msg: 'Вы успешно добавили новое метро'
            }
        })
    } else {
        dispatch({
            type: ADD_SUBWAY_ERROR,
            payload: {
                msg: data.msg || 'произошла серверная ошибка при добавлении метро'
            }
        });
    }
}

export const removeSubWayFromApartmentAction = (apartmentId, subwayId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.removeSubWayFromApartment(apartmentId, subwayId);
    if (data.status === 'ok') {
        dispatch({
            type: REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS,
            payload: {
                subway: data.subway
            }
        });
    } else {
        dispatch({
            type: REMOVE_SUBWAY_FROM_APARTMENT_ERROR
        });
    }
}

export const deleteApartmentByIdAction = (apartmentId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteApartmentById(apartmentId);
    console.log(data);
    if (data.status == 'ok') {
        dispatch({
            type: DELETE_APARTMENT_BY_ID_SUCCESS
        });
    } else {
        dispatch({ type: DELETE_APARTMENT_BY_ID_ERROR });
    }


}
export const addSubwayForApartmentAction = (addedSubwayId, apartmentId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.addSubwayForApartment(addedSubwayId, apartmentId);
    console.log({ data });
    if (data.status == 'ok') {
        dispatch({
            type: ADD_SUBWAY_TO_APARTMENT_SUCCESS,
            payload: {
                subway: data.subway
            }
        })
    } else {
        dispatch({
            type: ADD_SUBWAY_TO_APARTMENT_ERROR
        })
    }
}

export const getAllSubWaysAction = (apartmentId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.getAllSubway(apartmentId);
    if (data.status == 'ok') {
        dispatch({
            type: GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS,
            payload: {
                subways: data.subways,
                error: false,
                loading: false
            }
        });
    } else {
        dispatch({
            type: GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR,
            payload: {
                subways: [],
                error: true,
                loading: false
            }
        });
    }
}
export const addNewImageToApartmentAction = (apartmentId, imageFileArray) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.addNewImageToApartment(apartmentId, imageFileArray);
    console.log(data);
    if (data.status == 'ok') {
        dispatch({
            type: IMAGE_ADD_TO_APARTMENT_SUCESS,
        });
    } else {
        dispatch({
            type: IMAGE_ADD_TO_APARTMENT_FAIL,
        });
    }
}
export const updateBasicApartmentFieldsAction = (apartmentId, fields) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.updateApartmentById(apartmentId, fields);
    console.log({ data });
    dispatch({
        type: UPDATE_BASIC_FIELDS_SUCCESS
    });

};

export const deleteApartmentImageByIndexAction = (apartmentId, imageIndex) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteApartmentImageByIndex(apartmentId, imageIndex);
    console.log(data);
    if (data.status == 'ok') {
        dispatch({
            type: DELETE_APARTMENT_IMAGE_SUCCESS,
            payload: {
                imageIndex
            }
        });
    } else {
        dispatch({
            type: DELETE_APARTMENT_IMAGE_ERROR
        });
    }

}
export const getApartmentByIdAction = (apartmentId) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.getApartmentById(apartmentId);
    if (data.status === 'ok') {
        // servicesForCurrentApartment: servicesForCurrentApartmentAfterDelete,
        dispatch({
            type: GET_APARTMENT_BY_ID,
            payload: {
                apartment: data.apartment,
                loading: false,
                error: false
            }
        });
    } else {
        dispatch({
            type: GET_APARTMENT_BY_ID_ERROR,
            payload: {
                error: true,
                loading: false,
                data: {}
            }
        })
    }

}

export const clearOrderEventAction = () => async (dispatch, getState) => {
    dispatch({
        type: CLEAR_ORDER_EVENT
    });
}
export const createApartmentAction = (formDataObject) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.createApartment(formDataObject);

    if (data.status === 'ok') {

        dispatch({
            type: CREATE_APARTMENT, payload: {
                ...data,
            }
        });
    } else {
        dispatch({
            type: CREATE_APARTMENT_ERROR, payload: {
                error: {
                    msg: data.msg || 'произошла ошибка при попытке создать новый адрес'
                }
            }
        })
    }

}

export const getAllApartmentsAction = () => async (dispatch, getState) => {
    try {
        let { data } = await getState().serviceUtilContainer.getAllApartments();
        if (data.status == 'ok') {
            dispatch({
                type: GET_APARTMENTS,
                payload: {
                    apartments: data.apartments,
                    error: false,
                    loading: false
                }
            })
        } else {
            dispatch({
                type: GET_ALL_APARTMENT_ERROR,
                payload: {
                    error: true,
                    loading: false
                }
            });
        }

    } catch (e) {
        dispatch({
            type: GET_ALL_APARTMENT_ERROR,
            payload: {
                error: true,
                loading: false
            }
        })
    }
}
export const updateStatusAction = (selectedStatus, orderId) => async (dispatch, getState) => {
    try {
        let data = await getState().serviceUtilContainer.updateOrderStatus(selectedStatus, orderId);
        if (data.status === 'ok') {
            dispatch({
                type: UPDATE_ORDER_STATUS,
                payload: {
                    status: "ok"
                }
            });
        } else {
            dispatch({
                type: GENERAL_ERROR,
                payload: {
                    status: "error",

                }
            });
        }
    } catch (e) {
        dispatch({ type: GENERAL_ERROR });
    }
}
export const getOrdersAction = (page, { filterObject }) => async (dispatch, getState) => {
    try {
        page = page || 1;
        // add filter params = fromDate, toDate
        console.log('DISPATCHED FILTER OBJECT NOW', filterObject);
        localStorage.setItem('from_date', filterObject.fromDate);
        localStorage.setItem('to_date', filterObject.toDate);
        let data = await getState().serviceUtilContainer.getOrders(page, { filterObject });
        if (data.status == 'ok') {
            dispatch({
                type: GET_ORDERS,
                payload: {
                    data: data.orders,
                    loading: false,
                    error: false
                }
            });
        } else {
            dispatch({
                type: GET_ORDERS,
                payload: {
                    data: [],
                    msg: 'Не удалось получить ни одного заказа',
                    loading: false,
                    error: true
                }
            })
        }

    } catch (e) {
        dispatch({
            type: GET_ORDERS,
            payload: {
                data: [],
                loading: false,
                error: true,
                msg: 'Не удалось получить ни одного заказа'
            }
        });
    }
}