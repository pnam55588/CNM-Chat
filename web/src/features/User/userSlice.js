import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken } from "../../API";

export const getPenddingRequests = createAsyncThunk(
  "user/getPenddingRequests",
  async (params) => {
    try {
      const pendingRequests = await getApiWithToken(params);
      return pendingRequests.data.pendingRequests;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getContacts = createAsyncThunk(
  "user/getContacts",
  async (params) => {
    try {
      const pendingRequests = await getApiWithToken(`/users/${params}/contacts`);
      return pendingRequests.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getBlocks = createAsyncThunk("user/getBlocks", async (params) => {
  try {
    const pendingRequests = await getApiWithToken(params);
    return pendingRequests.data.blocked;
  } catch (error) {
    console.log(error);
  }
});

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    pendingRequests: [],
    contacts: [],
    blocked:[],
    usersOnline:[]
  },
  reducers: {
    handleGetUsersOnline:(state, action)=>{
      state.usersOnline = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPenddingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      .addCase(getBlocks.fulfilled, (state, action) => {
        state.blocked = action.payload;
      });
  },
});
const { reducer, actions } = userSlice;
export const {handleGetUsersOnline} = actions
export default reducer;
