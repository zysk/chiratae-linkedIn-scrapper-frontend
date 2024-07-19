import { combineReducers } from "redux";

import { authReducer } from "./auth/auth.reducer";
// import { userReducer } from "./users/users.reducer";

const RootReducer:any = combineReducers({
  auth: authReducer,
//   users: userReducer,
});

export default RootReducer;
