import React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import {Dashboard} from "./Pages/Dashboard"
import {Category} from "./Pages/Category"
import {Post} from "./Pages/Post"
import {Login} from "./Pages/Login"
import {Signup} from "./Pages/Signup"
import {PrivateRoute} from "./Utilities/PrivateRoute"

export const App = () => {
  return (
        <Router>
          <AuthProvider>
            <Switch>

              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute exact path="/category" component={Category} />
              <PrivateRoute exact path="/post" component={Post} />

              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              
            </Switch>
          </AuthProvider>
        </Router>
  )
}

