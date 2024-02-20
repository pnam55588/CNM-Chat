import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken } from "../../API";

export const getAllConversations = createAsyncThunk(
  "conversation/getAllconversations",
  async (params) => {
    try {
      const result = await getApiWithToken(`/conversation/getConversations/${params}`);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
);

// export const selectedConversationApi = createAsyncThunk(
//   "conversation/selectedConersation",
//   async (params) => {
//     console.log(params);
//     try {
//       const result = await getApiWithToken(`/conversation/${params}`);
//       return result.data;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// );

export const getRecipient= createAsyncThunk(
  "conversation/getRecipient",
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
    selectedConversation: null,
    userRecipient: null
  },
  reducers: {
    selectConversation:(state, action)=>{
      state.selectedConversation = action.payload
    },
    handleNewConversation:(state, action)=>{
      state.allConversation=[...state.allConversation, action.payload]
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllConversations.fulfilled, (state, action) => {
        state.allConversation = action.payload;
      })
      // .addCase(selectedConversationApi.fulfilled, (state, action) => {
      //   state.selectedConversation = action.payload;
      // })
      .addCase(getRecipient.fulfilled, (state, action)=>{
        state.userRecipient = action.payload
      });
  },
});
const { reducer, actions } = conversationsSlice;
export const {selectConversation, handleNewConversation} = actions;
export default reducer;
