import React from 'react'
import {Outlet} from 'react-router-dom'
export default function AuthLayout() {
    React.useEffect(() => {
        const root = document.getElementById('root')
        if (root) {
          root.style.height = '100%'
        }
        return () => {
          if (root) {
            root.style.height = 'auto'
          }
        }
      }, [])
  return (
    <div>
      <Outlet/>
    </div>
  )
}
