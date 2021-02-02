import { DummyContainer, ServiceUtilContainer } from "../util/serviceUtil";
import {DELETE_APARTMENT_BY_ID_SUCCESS,REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS, GET_ORDERS, CREATE_APARTMENT,ADD_SUBWAY_TO_APARTMENT_SUCCESS, CREATE_APARTMENT_ERROR,GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR,GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS, GET_APARTMENTS,IMAGE_ADD_TO_APARTMENT_SUCESS, GET_APARTMENT_BY_ID, DELETE_APARTMENT_IMAGE_SUCCESS } from "./actions";


// тут только одну переменную меняешь
let isDummy = false;
const initialState = {
    serviceUtilContainer: !isDummy ? new ServiceUtilContainer() : new DummyContainer(),
    orders: {
        data: [],
        error: false,
        loading: false
    },
    subwaysNotIncludedInApartment:{
        data:[],
        error:false,
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
         case REMOVE_SUBWAY_FROM_APARTMENT_SUCCESS:
         return {
            ...state,
            popupInfo:{
                removeSubWayFromApartmentSuccess: true
            }
         }
         case DELETE_APARTMENT_BY_ID_SUCCESS:
         return {
            ...state,
            popupInfo:{
                deletedApartmentSuccess: true
            }
         }
         case ADD_SUBWAY_TO_APARTMENT_SUCCESS:
         return {
            ...state,
            popupInfo:{
                subwayAdded:true
            }
         }
         case GET_SUBWAY_FOR_CURRENT_APARTMENT_ERROR:
         return {
            ...state,
            subwaysNotIncludedInApartment:{
                data:[],
                error:true,
                loading:false
            }
         };
         case GET_SUBWAY_FOR_CURRENT_APARTMENT_SUCCESS:
         return {
            ...state,
            subwaysNotIncludedInApartment:{
                data:payload.subways,
                error: false,
                loading: false
            }
         }
        case IMAGE_ADD_TO_APARTMENT_SUCESS:
        return {
                ...state,
                popupInfo:{
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
