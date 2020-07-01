import {
  REGISTER_START,
  REGISTER_SUCCESS, 
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR} from '../actions/types'

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null
}

const registerReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    // case REGISTER_START:
    //   localStorage.getItem('token')
    //   return {
    //     ...state,
    //     loading: true
    //   }
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };


    case USER_LOADED:
      return { 
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
      
    default:
      return state;
  }
}


export default registerReducer