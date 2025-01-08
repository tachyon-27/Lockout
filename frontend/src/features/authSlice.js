import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: false,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        verifyOTP: (state, action) => {
            state.status = false;
            state.user = action.payload
        },
        login: (state, action) => {
            state.status = true;
            state.user = action.payload
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
        }
    }
})

export const {login, logout, verifyOTP} = authSlice.actions

export default authSlice.reducer