import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    verifyOTP: false,
    forgotPassword: false,
    _id: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        verifyOTP: (state, action) => {
            state.verifyOTP = true
            state._id = action.payload
        },
        forgotPassword: (state, action) => {
            state.forgotPassword = true
            state._id = action.payload
        },
        reset: (state) => {
            state.forgotPassword = false
            state.verifyOTP = false
            state._id = null
        }
    }
})

export const {verifyOTP, forgotPassword, reset} = authSlice.actions

export default authSlice.reducer