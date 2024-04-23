import { combineReducers } from "redux";

import { authReducer } from "./auth/auth.reducer";
import { userReducer } from "./Users/users.reducer";

const RootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
});

export default RootReducer;
