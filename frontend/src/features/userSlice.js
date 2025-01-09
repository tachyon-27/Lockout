import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: false,
    user: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
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

export const {login, logout} = userSlice.actions

export default userSlice.reducer