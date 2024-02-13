import {configureStore} from '@reduxjs/toolkit'
import menuReducer from './../features/Menu/menuSlice'
import userReducer from './../features/User/userSlice'
import conversationReducer from './../features/Conversations/conversationsSlice'
import messageReducer from './../features/Message/messageSlice'

const rootReducer ={
    menuActive: menuReducer,
    userReducer: userReducer,
    conversationReducer: conversationReducer,
    messageReducer: messageReducer
}

const store = configureStore({
    reducer: rootReducer,
})

export default store