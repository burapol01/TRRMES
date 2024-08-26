// @ts-nocheck
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const SplashScreenContext = createContext("")

const SplashScreenProvider = ({ children }:any) => {
  const [count, setCount] = useState(0)
  const visible = count > 0
  useEffect(() => {
    // Show SplashScreen
    if (visible) {
      document.body.classList.remove('page-loading')

      return () => {
        document.body.classList.add('page-loading')
      }
    }

    // Hide SplashScreen
    let timeout:any
    if (!visible) {
      timeout = window.setTimeout(() => {
        document.body.classList.add('page-loading')
      }, 3000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [visible])

  const value:any = {
    setCount,
    count
  }

  useEffect(() => {
    const visible = true
    if (!visible) {
      return
    }

    if (setCount) {
      setCount((prev) => {
        return prev + 1
      })
    }

    return () => {
      if (setCount) {
        setCount((prev) => {
          return prev - 1
        })
      }
    }
  }, [setCount, visible])

  return (
    <SplashScreenContext.Provider value={value}>
      {children}
    </SplashScreenContext.Provider>
  )
}



export { SplashScreenProvider }
