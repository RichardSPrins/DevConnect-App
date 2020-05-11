import React from 'react';
// Component Imports
import Navbar from './Components/Layout/Navbar.component'
import Alert from './Components/Layout/Alert.component'
import Landing from './Components/Layout/Landing.component'
import Login from './Components/Auth/Login.component'
import Register from './Components/Auth/Register.component'
import { Route, Switch } from 'react-router-dom'
// Style imports
import './App.css';





const App = () => {
  return (
    <>
      <Navbar />
      <Route exact path="/" component={Landing}/>
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/login" component={Login}/>
        </Switch>
      </section>
    </>
  );
}

export default App;
