import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken } from "../../API";

export const getCurrentMessage = createAsyncThunk(
  "message/getCurrentMessage",
  async (params) => {
    try {
      const result = await getApiWithToken(params);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: {
    newMessage: "",
    currentMessage: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentMessage.fulfilled, (state, action) => {
      state.currentMessage = action.payload;
    });
  },
});
const { reducer } = messageSlice;
export default reducer;
