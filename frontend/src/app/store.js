import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/userSlice'

const store = configureStore({
    reducer: {
        user: authReducer,
    }
})

export default store;