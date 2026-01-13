import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  growEnvData: null,
};

const growEnvironmentsStateSlice = createSlice({
  name: "growEnviromentState",
  initialState,
  reducers: {
    setGrowEnvData(state, action) {
      state.growEnvData = action.payload;
    },
  },
});

export const { setGrowEnvData } = growEnvironmentsStateSlice.actions;
export default growEnvironmentsStateSlice.reducer;
