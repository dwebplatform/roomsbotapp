import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import { GET_ORDERS, CREATE_APARTMENT, CREATE_APARTMENT_ERROR, GET_APARTMENTS, GET_APARTMENT_BY_ID, DELETE_APARTMENT_IMAGE_SUCCESS } from "./actions";


// тут только одну переменную меняешь
let isDummy = false;
const initialState = {
    serviceUtilContainer: !isDummy ? new ServiceUtilContainer() : new DummyContainer(),
    orders: {
        data: [],
        error: false,
        loading: false
    },
    apartment: {
        data: {},
        error: false,
        loading: false
    },
    apartments: {
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
