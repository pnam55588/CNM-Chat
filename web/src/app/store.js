import {configureStore} from '@reduxjs/toolkit'
import menuReducer from './../features/Menu/menuSlice'
import userReducer from './../features/User/userSlice'

const rootReducer ={
    menuActive: menuReducer,
    userReducer: userReducer
}

const store = configureStore({
    reducer: rootReducer,
})

export default store