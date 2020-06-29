import React from 'react'
import { withRouter } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { connect } from  'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../redux/actions/auth'

const Navbar = (props) => {
  const { auth: { isAuthenticated, loading}, history } = props
  const authLinks = (
    <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
  );

  const guestLinks = (
    <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
  )
  // console.log(history)

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {
        isAuthenticated
        ? authLinks
        : guestLinks
      }
      {/* <ul>
        <li><Link to="/profiles">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul> */}
    </nav>
  )
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

const NavBarWithRouter = withRouter(Navbar)

export default connect(mapStateToProps, { logout })(NavBarWithRouter)
