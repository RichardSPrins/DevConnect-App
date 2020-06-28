import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setAlert } from '../../redux/actions/alert'


import axios from 'axios'

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const  { email, password } = formData
  const { history, setAlert } = props;
  const token = localStorage.getItem('token')

  const inputHandler = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitHandler = async e => {
    e.preventDefault()
    if(!password){
      setAlert('Please enter your password!', 'danger')
    } else {
      // console.log(formData)
      // console.log('Success!')
      const user = {
        email,
        password
      }
      
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        const body = JSON.stringify(user)
        const res = await axios.post('/api/auth', body, config)
        console.log(res.data)
        localStorage.setItem('token', res.data.token)
        history.push('/')
      } catch (error) {
        setAlert(error.response.data.errors[0].msg, 'danger')
      }
    }
  }

  if(token){
    return <Redirect to='/'/>
  }

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e => submitHandler(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => inputHandler(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => inputHandler(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  )
}

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
}


export default connect(null, { setAlert })(Login)
