import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUserStorage } from '../Utils'

export default function ProtectedRouter({children}) {
let user = getUserStorage()
if(!user){
    return <Navigate to={'/chat-app/login'} replace></Navigate>
}
  return children
}