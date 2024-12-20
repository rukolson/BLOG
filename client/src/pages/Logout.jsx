import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Logout = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext)

  useEffect(() => {
    // axios.get(`${process.env.REACT_APP_BASE_URL}/users/logout/${currentUser.id}`)
    setCurrentUser(null)
  }, [])
  
  const navigate = useNavigate()
  navigate('/login')
  return (
    <div></div>
  )
  
}

export default Logout