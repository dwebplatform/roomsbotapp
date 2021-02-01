export const GET_ORDERS = "GET_ORDERS";
export const GET_APARTMENTS = "GET_APARTMENTS";
export const GET_APARTMENT_BY_ID = "GET_APARTMENT_BY_ID";
export const GET_APARTMENT_BY_ID_ERROR = "GET_APARTMENT_BY_ID_ERROR";
export const GENERAL_ERROR = "GENERAL_ERROR";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const CREATE_APARTMENT = "CREATE_APARTMENT";
export const CREATE_APARTMENT_ERROR = "CREATE_APARTMENT_ERROR";
export const GET_ALL_APARTMENT_ERROR = "GET_ALL_APARTMENT_ERROR";

export const DELETE_APARTMENT_IMAGE_SUCCESS = "DELETE_APARTMENT_IMAGE_SUCCESS";
export const DELETE_APARTMENT_IMAGE_ERROR = "DELETE_APARTMENT_IMAGE_ERROR";



export const deleteApartmentImageByIndexAction = (apartmentId, imageIndex) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.deleteApartmentImageByIndex(apartmentId, imageIndex);
    console.log(data);
    if (data.status == 'ok') {
        dispatch({
            type: DELETE_APARTMENT_IMAGE_SUCCESS
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
export const createOrderAction = (formDataObject) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.createApartment(formDataObject);
    if (data.status == 'ok') {
        dispatch({ type: CREATE_APARTMENT, payload: data });
    } else {
        dispatch({ type: CREATE_APARTMENT_ERROR })
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
                loading: false,
                error: true,
                msg: 'Не удалось получить ни одного заказа'
            }
        });
    }
}