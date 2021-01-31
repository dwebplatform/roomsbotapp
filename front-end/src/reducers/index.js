import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import { INCREMENT, GET_ORDERS, CREATE_APARTMENT, CREATE_APARTMENT_ERROR } from "./actions";


// тут только одну переменную меняешь
let isDummy = true;
const initialState = {


    serviceUtilContainer: isDummy ? new ServiceUtilContainer() : new DummyContainer(),
    orders: {
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
                    data: payload.data,
                    error: payload.error,
                    loading: payload.loading
                }
            };
        default:
            return state;
    }
};

export default reducer;
