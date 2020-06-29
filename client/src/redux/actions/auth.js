import {
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from './types'

import { setAlert } from './alert'

import axios from 'axios'
import setAuthToken from '../../utils/setAuthToken'

// REGISTER USER action

export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers : {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ name, email, password })

  try {
    const res = await axios.post('/api/users', body, config)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })
  } catch (error) {
    console.log(error.response)
    const errors = error.response.data.errors
    if(errors){
      errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
    }
    dispatch({
      type: REGISTER_FAIL
    })
  }
}

// LOGIN USER action

export const loginUser = ({ email, password }) => async dispatch => {
  const config = {
    headers : {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post('/api/auth', body, config)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })
  } catch (error) {
    console.log(error.response)
    const errors = error.response.data.errors
    if(errors){
      errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
      console.log(errors)
    }
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

//LOAD USER action

export const loadUser = () => async dispatch => {
  if(localStorage.token){
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get('/api/auth')

    dispatch({
      type: USER_LOADED,
      payload:res.data
    })
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    })
  }
}

// LOGOUT USER action
1
export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  })
}


