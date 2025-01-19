import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../ReduxToolkit/Reducers/authSlice";
import darkModeReducer from "../ReduxToolkit/Reducers/darkModeSlice";
import companyReducer from "../ReduxToolkit/Reducers/companySlice";
import taskReducer from "../ReduxToolkit/Reducers/taskSlice";
import userReducer  from "../ReduxToolkit/Reducers/userSlice";
import netReducer from "../ReduxToolkit/Reducers/bsf/netSlice";
import pondReducer from "../ReduxToolkit/Reducers/bsf/pondSlice";


// Combine all feature reducers
const rootReducer = combineReducers({
  auth: authReducer,
  darkMode: darkModeReducer,
  company: companyReducer,
  tasks: taskReducer,
  nets: netReducer,
  user: userReducer,
  ponds: pondReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>; // Define the RootState type
export default rootReducer;
