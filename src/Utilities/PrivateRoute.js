import React from "react"
import {Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const PrivateRoute = () => {
  const { authState } = useAuth()
  if (authState.authenticated!==true) {
    return <Navigate to={'/login'} replace />;
  }
  else return <Outlet />;
};