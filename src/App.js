import React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from "./Pages/Dashboard"
import { Category } from "./Pages/Category"
import { Post } from "./Pages/Post"
import { Login } from "./Pages/Login"
import { Signup } from "./Pages/Signup"
import { PrivateRoute } from "./Utilities/PrivateRoute"

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/post" element={<Post />} />
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

