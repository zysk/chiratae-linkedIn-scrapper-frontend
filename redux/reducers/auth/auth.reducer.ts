import { AUTH, AUTH_FAIL, AUTH_SUCCESS, LOGOUT, sidebarToggle,DataActionTypes } from "../../actions/auth/auth.actions";

interface DataState {
    isAuthorized:boolean;
    user: any | null;
    role: any | null;
    token: any |null;
    loading: boolean;
    sideBarOpen: boolean;
    error: string | null;
  }


const initialState: DataState = {
    isAuthorized: false,
    user: null,
    role: null,
    token: null,
    loading: false,
    sideBarOpen: true,
    error: null,
  };

  export const authReducer = (state = initialState, action:DataActionTypes): DataState => {
    switch (action.type) {
      case AUTH:
        return {
          ...state,
          isAuthorized: false,
          user: null,
          role: null,
          loading: true,
          token: null,
          error: null,
        };
      case AUTH_SUCCESS:
        return {
          ...state,
          isAuthorized: true,
          user: action.payload.user,
          role: action.payload.role,
          loading: false,
          token: action.payload.token,
          error: null,
        };
      case AUTH_FAIL:
        // toastError(action.payload);
        console.log(action.payload)
        return {
          ...state,
          isAuthorized: false,
          user: null,
          role: null,
          token: null,
          loading: false,
          error: action.payload,
        };
      case sidebarToggle:
        return {
          ...state,
          sideBarOpen: !state.sideBarOpen
        };
      case LOGOUT:
        // toastSuccess("Logged Out");
        console.log("Logged out")
        return { ...initialState };
      default:
        return state;
    }
  };