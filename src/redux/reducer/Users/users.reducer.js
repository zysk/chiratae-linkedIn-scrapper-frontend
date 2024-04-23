import { toastError, toastSuccess } from '../../../utils/toastUtils'
import * as User from '../../actions/Users/users.actions'

const initialState = {
    users: [],
    userObj: {},
    customerObj: {},
    error: null,
    loading: null,
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case User.USER_ADD:
            return {
                ...state,
                users: null,
                loading: true,
                error: null,
            }
        case User.USER_ADD_SUCCESS:
            toastSuccess(action.payload.message)
            return {
                ...state,
                users: action.payload.users,
                loading: false,
                error: null,
            }
        case User.USER_ADD_FAIL:
            toastError(action.payload)
            return {
                ...state,
                users: null,
                loading: false,
                error: action.payload,
            }
        case User.USER_GET:
            return {
                ...state,
                users: null,
                loading: true,
                error: null,
            }
        case User.USER_GET_SUCCESS:
            // toastSuccess(action.payload.message)
            return {
                ...state,
                users: action.payload.users,
                loading: false,
                error: null,
            }
        case User.USER_GET_FAIL:
            toastError(action.payload)
            return {
                ...state,
                users: null,
                loading: false,
                error: action.payload,
            }
        case User.USER_DELETE:
            return {
                ...state,
                // users: null,
                loading: true,
                error: null,
            }
        case User.USER_DELETE_SUCCESS:
            toastSuccess(action.payload.message)
            return {
                ...state,
                loading: false,
                error: null,
            }
        case User.USER_DELETE_FAIL:
            toastError(action.payload)
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case User.GET_SPECIFIC_CUSTOMER:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case User.GET_SPECIFIC_CUSTOMER_SUCCESS:
            // toastSuccess(action.payload.message)
            return {
                ...state,
                customerObj: action.payload.userObj,
                loading: false,
                error: null,
            }
        case User.GET_SPECIFIC_CUSTOMER_FAIL:
            toastError(action.payload)
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case User.GET_USER_BY_ID:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case User.GET_USER_BY_ID_SUCCESS:
            // toastSuccess(action.payload.message)
            return {
                ...state,
                userObj: action.payload.userObj,
                loading: false,
                error: null,
            }
        case User.GET_USER_BY_ID_FAIL:
            toastError(action.payload)
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case User.USER_UPDATE:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case User.USER_UPDATE_SUCCESS:
            toastSuccess(action.payload.message)
            return {
                ...state,
                // userObj: action.payload.userObj,
                loading: false,
                error: null,
            }
        case User.USER_UPDATE_FAIL:
            toastError(action.payload)
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

        default:
            return state
    }
}
