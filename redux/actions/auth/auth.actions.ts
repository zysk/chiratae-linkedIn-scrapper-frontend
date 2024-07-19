// import { login } from "../../../services/users.service";
"use client"
import {jwtDecode} from "jwt-decode";
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../../store';
import { Action } from 'redux';
import { login } from '@/utils/services/users.service';

export const AUTH = "AUTH";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const LOGOUT = "LOGOUT";
export const sidebarToggle = "sidebarToggle";

interface AuthForm {
    email: string;
    password: string;
}
interface AuthRequestAction {
    type: typeof AUTH;
  }
  
interface AuthSuccessAction {
    type: typeof AUTH_SUCCESS;
    payload: any; // Replace with appropriate type
}
  
interface AuthFailureAction {
    type: typeof AUTH_FAIL;
    payload: string;
}

interface LogoutAction {
    type: typeof LOGOUT;
    payload: string;
}

interface SidebarToggleAction {
    type: typeof sidebarToggle;
}


export type DataActionTypes =
  | AuthRequestAction
  | AuthSuccessAction
  | AuthFailureAction
  | LogoutAction
  | SidebarToggleAction;

export const loginUser = (formData:AuthForm):ThunkAction<void, RootState, unknown, Action<string>> => async (dispatch) => {
  try {
    dispatch({ type: AUTH });
    let { data: response } = await login(formData);
    if (response) {
      let decodedToken: any = await jwtDecode(response.token);
      localStorage.setItem("token", response.token);
      if (`${decodedToken.role}`.toLowerCase() == "admin") {
        window.location.href = "/All-Leads"
        dispatch({
              type: AUTH_SUCCESS,
              payload: {
                ...response.data,
                token: response.token,
                role: decodedToken.role,
                user: decodedToken.user,
              },
            });
      }
      else {
        window.location.href = "/My-Leads"
      }
      }
  } catch (err) {
    console.error(err);
    dispatch({ type: AUTH_FAIL, payload: err });
  }
};

export const logoutUser = ():ThunkAction<void, RootState, unknown, Action<string>>  => async (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.removeItem("token");

};


export const toggleSideBarFromHeader = ():ThunkAction<void, RootState, unknown, Action<string>>  => async (dispatch) => {
  dispatch({ type: sidebarToggle });

};
