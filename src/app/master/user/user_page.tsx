import React from 'react'
import { UserProvider } from './core/user_provider'
import User from '.'

export default function UserPage() {
  return (
    //สร้าง Provider ครอบเพื่อให้สามารถเรียกใช้ Validate แบบ Global 
    <UserProvider>
         <User/>       
      
    </UserProvider>
  )
}
