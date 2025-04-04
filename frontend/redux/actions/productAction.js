import axios from "axios";
import { server } from "../store";

export const getAllProducts = (keyword = "", category = "", minPrice = 0, maxPrice = 100000) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });
    
    // Build URL with proper query parameters
    let url = `${server}/product/all`;
    const params = new URLSearchParams();
    
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("category", category);
    if (minPrice > 0) params.append("minPrice", minPrice);
    if (maxPrice < 100000) params.append("maxPrice", maxPrice);
    
    // Only append query string if we have parameters
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const { data } = await axios.get(url, { withCredentials: true });
    
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
    
  } catch (error) {
    dispatch({
      type: "getAllProductsFail",
      payload: error.response.data.message,
    });
  }
};

export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAdminProductsRequest",
    });
    const { data } = await axios.get(`${server}/product/admin`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAdminProductsSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "getAdminProductsFail",
      payload: error.response.data.message,
    });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getProductDetailsRequest",
    });

    const { data } = await axios.get(`${server}/product/single/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "getProductDetailsSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "getProductDetailsFail",
      payload: error.response.data.message,
    });
  }
};
