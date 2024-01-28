import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiWithToken } from "../../API";

export const getPenddingRequests = createAsyncThunk(
  "user/getPenddingRequests",
  async (params) => {
    try {
      const pendingRequests = await getApiWithToken(params);
      return pendingRequests.data.pendingRequests;
    } catch (error) {}
  }
);
export const getContacts = createAsyncThunk(
  "user/getContacts",
  async (params) => {
    try {
      const pendingRequests = await getApiWithToken(params);
      return pendingRequests.data.contacts;
    } catch (error) {}
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    pendingRequests: [],
    contacts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPenddingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.contacts = action.payload
      });
  },
});
const { reducer } = userSlice;
export default reducer;
