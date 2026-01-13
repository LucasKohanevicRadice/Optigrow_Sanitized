import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Reducers
import applicationStateReducer from "../features/applicationStateSlice";
import growEnvironmentsStateReducer from "../features/growEnvSlice";
import userSettingStateReducer from "../features/userSettingSlice";

const rootReducer = combineReducers({
  applicationState: applicationStateReducer,
  growEnvironmentsState: growEnvironmentsStateReducer,
  userSettingState: userSettingStateReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
