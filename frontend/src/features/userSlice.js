import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: localStorage.getItem("token") ? true : false,
    userRole: localStorage.getItem("role") || null,
    token: localStorage.getItem("token") || null
};

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.userRole = action.payload.role;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userRole = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
        }
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;