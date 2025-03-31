import axios from "axios";
import { server } from "../store";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: "registerRequest",
    });

    const { data } = await axios.post(`${server}/user/new`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    // Store token in AsyncStorage
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }

    dispatch({
      type: "registerSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "registerFail",
      payload: error.response.data.message,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: "loginRequest",
    });

    const { data } = await axios.post(
      `${server}/user/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Store token in AsyncStorage
    if (data.token) {
      await AsyncStorage.setItem('token', data.token);
    }

    dispatch({
      type: "loginSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "loginFail",
      payload: error.response.data.message,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });
    
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      // Don't show error message, just update auth state
      return dispatch({
        type: "loadUserFail",
        payload: "",
      });
    }
    
    const { data } = await axios.get(`${server}/user/me`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    dispatch({
      type: "loadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    console.log("Load user error:", error.response?.data?.message || error.message);
    // Don't show error toast for auth failures
    dispatch({
      type: "loadUserFail",
      payload: "",
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({
      type: "logoutRequest",
    });

    // Clear token from AsyncStorage
    await AsyncStorage.removeItem('token');
    
    const { data } = await axios.get(`${server}/user/logout`, {
      withCredentials: true,
    });

    dispatch({
      type: "logoutSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "logoutFail",
      payload: error.response.data.message,
    });
  }
};
