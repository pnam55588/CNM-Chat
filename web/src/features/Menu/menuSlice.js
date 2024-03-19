import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: 'menuSlice',
    initialState:{
        active:'allChats',
        tab:'friendList',
        loading: false
    },
    reducers: {
        selectMenu:(state, action)=>{
            state.active = action.payload
        },
        selectTab:(state, action)=>{
            state.tab = action.payload
        },
        setLoading:(state, action)=>{
            state.loading = action.payload
        }
    },
})
const { reducer, actions } = menuSlice;
  export const {selectMenu, selectTab, setLoading} = actions
  export default reducer;