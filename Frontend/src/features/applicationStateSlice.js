import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isMobile: null,
  userID: null,
};

const applicationStateSlice = createSlice({
  name: "applicationState",
  initialState,
  reducers: {
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
    setUserID(state, action) {
      state.userID = action.payload;
    },
  },
});

export const { setIsMobile, setUserID } = applicationStateSlice.actions;
export default applicationStateSlice.reducer;
