import { createReducer } from "@reduxjs/toolkit";

export const userReducer = createReducer(
  {
    loading: false,
    isAuthenticated: false,
    user: null,
    message: null,
    error: null,
  },
  (builder) => {
    builder
      .addCase("loginRequest", (state) => {
        state.loading = true;
      })
      .addCase("loadUserRequest", (state) => {
        state.loading = true;
      })
      .addCase("logoutRequest", (state) => {
        state.loading = true;
      })
      .addCase("registerRequest", (state) => {
        state.loading = true;
      })
      .addCase("clearLoading", (state) => {
        state.loading = false;
      })
      .addCase("loginSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.message = action.payload;
      })
      .addCase("loadUserSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase("logoutSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase("registerSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.message = action.payload;
      })
      .addCase("loginFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase("loadUserFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase("logoutFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("registerFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase("clearError", (state) => {
        state.error = null;
      })
      .addCase("clearMessage", (state) => {
        state.message = null;
      });
  }
);