import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice.js'
import carReducer from '../features/carSlice.js'


const store = configureStore({
    reducer:{
        user : userReducer,
        car : carReducer
    }
})

export  {store}