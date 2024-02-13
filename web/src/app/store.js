import {configureStore} from '@reduxjs/toolkit'
import menuReducer from './../features/Menu/menuSlice'
import userReducer from './../features/User/userSlice'
import conversationReducer from './../features/Conversations/conversationsSlice'

const rootReducer ={
    menuActive: menuReducer,
    userReducer: userReducer,
    conversationReducer: conversationReducer
}

const store = configureStore({
    reducer: rootReducer,
})

export default store