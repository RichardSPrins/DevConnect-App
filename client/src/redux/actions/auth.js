import {
  REGISTER_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types'

import { setAlert } from './alert'

import axios from 'axios'

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