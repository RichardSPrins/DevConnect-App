import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAlert } from '../../redux/actions/alert'
import { register } from '../../redux/actions/auth'
import PropTypes from 'prop-types'

import axios from 'axios'

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPass: ''
  })

  const { setAlert, register } = props
  const  { name, email, password, confirmPass } = formData

  const inputHandler = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const submitHandler = async e => {
    e.preventDefault()
    if(password !== confirmPass){
      setAlert('Passwords do not match', 'danger')
    } else {
      // console.log(formData)
      // console.log('Success!')
      const newUser = {
        name: name,
        email: email,
        password: password
      }
      register(newUser)
    }
  }

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => submitHandler(e)}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name"
            onChange={e => inputHandler(e)}
            value={name}
            // required 
          />
        </div>
        <div className="form-group">
          <input type="email" 
            placeholder="Email Address" 
            name="email"
            value={email}
            onChange={e => inputHandler(e)}
          />
          <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPass"
            value={confirmPass}
            onChange={e => inputHandler(e)}
          />
        </div>
        <input type="submit"
        className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
} 

export default connect(null, { setAlert, register })(Register)