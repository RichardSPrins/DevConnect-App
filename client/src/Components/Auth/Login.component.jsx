// React Imports
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
// Redux Imports
import { connect } from 'react-redux'
import { setAlert } from '../../redux/actions/alert'
import { loginUser } from '../../redux/actions/auth'
// Dependency Imports
import PropTypes from 'prop-types'


const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const { history, setAlert, loginUser, isAuthenticated } = props;
  
  // const token = localStorage.getItem('token')


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
      loginUser(user)
      // history.push('/')
    }
  }

  // redirect if logged in

  if(isAuthenticated){
    return <Redirect to='/dashboard'/>
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
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { setAlert, loginUser })(Login)
