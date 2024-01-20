import {configureStore} from '@reduxjs/toolkit'
import menuReducer from './../features/Menu/menuSlice'

const rootReducer ={
    menuActive: menuReducer
}

const store = configureStore({
    reducer: rootReducer,
})

export default store