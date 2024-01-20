import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: 'menuSlice',
    initialState:{
        active:'allChats',
        tab:'friendList'
    },
    reducers: {
        selectMenu:(state, action)=>{
            state.active = action.payload
        },
        selectTab:(state, action)=>{
            state.tab = action.payload
        }
    },
})
const { reducer, actions } = menuSlice;
  export const {selectMenu, selectTab} = actions
  export default reducer;