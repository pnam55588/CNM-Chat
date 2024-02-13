import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken } from "../../API";

export const getAllConversations = createAsyncThunk(
  "conversation/getAllconversations",
  async (params) => {
    try {
      const result = await getApiWithToken(params);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const selectedConversation = createAsyncThunk(
  "conversation/selectedConersation",
  async (params) => {
    try {
      const result = await getApiWithToken(params);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getConversationById= createAsyncThunk(
  "conversation/getConversationById",
  async(params)=>{
    try {
      const result = await getApiWithToken(params);
      return result.data
    } catch (error) {
      console.log(error);
    }
  }
)

const conversationsSlice = createSlice({
  name: "conversationsSlice",
  initialState: {
    allConversation: [],
    selectedConversation: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllConversations.fulfilled, (state, action) => {
        state.allConversation = action.payload;
      })
      .addCase(selectedConversation.fulfilled, (state, action) => {
        state.selectedConversation = action.payload;
      })
      .addCase(getConversationById.fulfilled, (state, action)=>{
        state.selectedConversation = action.payload
      });
  },
});
const { reducer, actions } = conversationsSlice;
export const {} = actions;
export default reducer;
