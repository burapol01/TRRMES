import {useEffect} from 'react'
import {Navigate, Routes} from 'react-router-dom'
import { useSelector } from "react-redux";


export function Logout() {
  const currentuser = useSelector((state:any)=>state?.user)
  useEffect(() => {
    document.location.reload()
  }, [currentuser])

  return (
    <Routes>
      <Navigate to='/auth' />
    </Routes>
  )
}