import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken, postApiWithToken } from "../../API";

export const getCurrentMessage = createAsyncThunk(
  "message/getCurrentMessage",
  async (params) => {
    try {
      const result = await getApiWithToken(`/conversation/getMessages/${params}`);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (params) => {
    try {
      const result = await postApiWithToken(
        "/conversation/sendMessage",
        params
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const messageSlice = createSlice({
  name: "messageSlice",
  initialState: {
    newMessage: [],
    currentMessage: [],
  },
  reducers: {
    handleSetCurrentMessage:(state,action)=>{
      state.currentMessage=[...state.currentMessage, action.payload]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentMessage.fulfilled, (state, action) => {
        state.currentMessage = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.newMessage = action.payload;
        state.currentMessage = [...state.currentMessage, action.payload];
      });
  },
});
const { reducer, actions } = messageSlice;
export const {handleSetCurrentMessage} = actions
export default reducer;
