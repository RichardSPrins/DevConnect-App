import React from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from  'react-redux'

const Navbar = (props) => {
  const { isAuthenticated, history } = props
  // console.log(history)

  const handleLogout = e => {
    e.preventDefault()
    localStorage.removeItem('token')
    history.push('/')
  }
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        {
          isAuthenticated
          ? <li style={{ cursor: 'pointer'}} onClick={handleLogout}>Log Out</li>
          : <li><Link to="/login">Login</Link></li>
        }
      </ul>
    </nav>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

const NavBarWithRouter = withRouter(Navbar)

export default connect(mapStateToProps)(NavBarWithRouter)
