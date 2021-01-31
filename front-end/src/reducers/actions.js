export const INCREMENT = "INCREMENT";
export const GET_ORDERS = "GET_ORDERS";
export const GENERAL_ERROR = "GENERAL_ERROR";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const CREATE_APARTMENT = "CREATE_APARTMENT";
export const CREATE_APARTMENT_ERROR = "CREATE_APARTMENT_ERROR";
export const createOrderAction = (formDataObject) => async (dispatch, getState) => {
    let { data } = await getState().serviceUtilContainer.createApartment(formDataObject);
    if (data.status == 'ok') {
        dispatch({ type: CREATE_APARTMENT, payload: data });
    } else {
        dispatch({ type: CREATE_APARTMENT_ERROR })
    }

}
export const updateStatusAction = (selectedStatus, orderId) => async (dispatch, getState) => {
    try {
        let data = await getState().serviceUtilContainer.updateOrderStatus(selectedStatus, orderId);
        console.log(data);
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
        console.log(data);
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