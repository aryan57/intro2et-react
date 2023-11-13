import React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from "./Pages/Dashboard"
import MathGame from "./Pages/MathGame"
import Leaderboard from "./Pages/Leaderboard"

import { Login } from "./Pages/Login"
import { Signup } from "./Pages/Signup"
import { PrivateRoute } from "./Utilities/PrivateRoute"

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MathGame />} />
            <Route path="/mathgame" element={<MathGame />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

