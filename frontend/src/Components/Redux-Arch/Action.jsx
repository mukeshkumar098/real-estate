import axios from "axios";
import * as types from "./ActionType";


// User Registration Actions
const getRequest = () => ({ type: types.GETREQUEST });
const getSuccess = (payload) => ({ type: types.GETSUCCESS, payload });
const getFailure = () => ({ type: types.GETFAILURE });

export const registerUser = (payload) => {
  return (dispatch) => {
    dispatch(getRequest());

    return axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/register`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.data, "User registered successfully");
        dispatch(getSuccess(res.data));
        return res;
      })
      .catch((err) => {
        console.error(err, "Error while registering user");
        dispatch(getFailure());
        return err;
      });
  };
};

// Fetch Properties Actions
const getPropertiesRequest = () => ({ type: types.GET_PROPERTIES_REQUEST });
const getPropertiesSuccess = (payload) => ({ type: types.GET_PROPERTIES_SUCCESS, payload });
const getPropertiesFailure = () => ({ type: types.GET_PROPERTIES_FAILURE });

export const fetchProperties = () => {
  return (dispatch) => {
    dispatch(getPropertiesRequest());

    return axios
      .get(`${import.meta.env.VITE_BACK_END_URL}/properties/getProperties `)
      .then((res) => {
        console.log(res.data, "Fetched properties successfully");
        dispatch(getPropertiesSuccess(res.data));
      })
      .catch((err) => {
        console.error(err, "Error while fetching properties");
        dispatch(getPropertiesFailure());
      });
  };
};

// Post Property Actions
const postPropertyRequest = () => ({ type: types.POST_PROPERTY_REQUEST });
const postPropertySuccess = (payload) => ({ type: types.POST_PROPERTY_SUCCESS, payload });
const postPropertyFailure = () => ({ type: types.POST_PROPERTY_FAILURE });
const token = localStorage.getItem("authToken")
console.log(token);

export const postProperty = (payload) => {
    return (dispatch, getState) => {
      dispatch(postPropertyRequest());
  
      // Get token from the Redux store (assuming it's stored in `auth.token`)
      const token = localStorage.getItem("authToken")
  
      return axios
        .post(`${BACK_END_URL}/properties/add-properties`, payload, {
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Add the token here
          },
        })
        .then((res) => {
          console.log(res.data, "Property posted successfully");
          dispatch(postPropertySuccess(res.data));
          return res;
        })
        .catch((err) => {
          console.error(err, "Error while posting property");
          dispatch(postPropertyFailure());
          return err;
        });
    };
  };  

  export const searchProperties = (searchParams) => {
    return (dispatch) => {
      dispatch({ type: types.SEARCH_PROPERTIES_REQUEST });
  
      // Convert price to number if it exists
      if (searchParams.price) {
        searchParams.price = Number(searchParams.price);
      }
  
      return axios
        .get(`${import.meta.env.VITE_BACK_END_URL}/properties/searchProperties`, { 
          params: {
            location: searchParams.location || '',
            property_type: searchParams.property_type || '',
            price: searchParams.price || '',
            query: searchParams.query || ''
          }
        })
        .then((res) => {
          console.log("Search results:", res.data);
          dispatch({ type: types.SEARCH_PROPERTIES_SUCCESS, payload: res.data });
          return res.data;
        })
        .catch((err) => {
          console.error("Search error:", err);
          dispatch({ type: types.SEARCH_PROPERTIES_FAILURE });
          return err;
        });
    };
  };
  
  export const getPropertyById = (id) => {
    return (dispatch) => {
      dispatch({ type: types.GET_PROPERTY_BY_ID_REQUEST });
  
      return axios
        .get(`${import.meta.env.VITE_BACK_END_URL}/properties/getPropertyById/${id}`)
        .then((res) => {
          dispatch({ type: types.GET_PROPERTY_BY_ID_SUCCESS, payload: res.data });
          return res.data;
        })
        .catch((err) => {
          dispatch({ type: types.GET_PROPERTY_BY_ID_FAILURE });
          console.error("Property fetch error:", err);
          return err;
        });
    };
  };


  const loginRequest = () => ({ type: types.LOGIN_REQUEST });
  const loginSuccess = (payload) => ({ type: types.LOGIN_SUCCESS, payload });
  const loginFailure = () => ({ type: types.LOGIN_FAILURE });
  
  export const loginUser = (payload) => {
    return (dispatch) => {
      dispatch(loginRequest());
  
      return axios.post(`${import.meta.env.VITE_BACK_END_URL}/user/login`, payload, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log("Login success:", res.data);
  
          // Save token and user info to localStorage
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
  
          dispatch(loginSuccess(res.data));
          return res.data;
        })
        .catch((err) => {
          console.error("Login error:", err.response?.data || err.message);
          dispatch(loginFailure());
          return err;
        });
    };
  };