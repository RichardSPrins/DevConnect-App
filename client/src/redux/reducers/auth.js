import {
  REGISTER_START,
  REGISTER_SUCCESS, 
  REGISTER_FAIL} from '../actions/types'

const initialState = {
  token: localStorage.getItem('x-auth-token'),
  isAuthenticated: null,
  loading: true,
  user: null
}

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    // case REGISTER_START:
    //   localStorage.getItem('x-auth-token')
    //   return {
    //     ...state,
    //     loading: true
    //   }

    case REGISTER_SUCCESS:
      localStorage.setItem('x-auth-token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      }

    case REGISTER_FAIL:
      localStorage.removeItem('x-auth-token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      }
      
    default:
      return state;
  }
}


export default registerReducer