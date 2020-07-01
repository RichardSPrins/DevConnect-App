// React Imports
import React, { useEffect } from 'react';
// Component Imports
import Navbar from './Components/Layout/Navbar.component'
import Alert from './Components/Layout/Alert.component'
import Landing from './Components/Layout/Landing.component'
import Login from './Components/Auth/Login.component'
import Register from './Components/Auth/Register.component'
import { Route, Switch } from 'react-router-dom'
// Style imports
import './App.css';
// Action Imports
import { loadUser } from './redux/actions/auth'
// Util imports
import setAuthToken from './utils/setAuthToken'
import Dashboard from './Components/User/Dashboard.component';
import Profiles from './Components/User/Profiles.component';

const App = (props) => {
  const { store } = props
  // console.log(store)

  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token)
    }
    store.dispatch(loadUser())
  }, [])

  return (
    <>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/profiles" component={Profiles} />
        </Switch>
      </section>
    </>
  );
}

export default App;
