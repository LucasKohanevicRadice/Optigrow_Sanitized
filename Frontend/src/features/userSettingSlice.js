import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  theme: "light", //PLACEHOLDER FOR THEME SETTING
};

const userSettingStateSlice = createSlice({
  name: "userSettingState",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = userSettingStateSlice.actions;
export default userSettingStateSlice.reducer;
