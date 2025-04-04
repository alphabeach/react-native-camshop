import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { otherReducer } from "./reducers/otherReducer";
import { productReducer } from "./reducers/productReducer";
import { cartReducer } from "./reducers/cartReducer";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Setup axios interceptors
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  error => {
    console.log("API error:", error.response?.status, error.response?.data?.message);
    return Promise.reject(error);
  }
);

export const store = configureStore({
  reducer: {
    user: userReducer,
    other: otherReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export const server = "http://192.168.225.189:4000/api/v1";