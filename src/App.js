import React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "./Pages/Dashboard"
import Login from "./Authentication/Login"
import Signup from "./Authentication/Signup"
import PrivateRoute from "./Utilities/PrivateRoute"

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>

              <PrivateRoute exact path="/" component={Dashboard} />

              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              
            </Switch>
          </AuthProvider>
        </Router>
  )
}

export default App
