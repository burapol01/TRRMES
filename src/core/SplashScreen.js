import { jsx as _jsx } from "react/jsx-runtime";
// @ts-nocheck
import { createContext, useEffect, useState, } from 'react';
const SplashScreenContext = createContext("");
const SplashScreenProvider = ({ children }) => {
    const [count, setCount] = useState(0);
    const visible = count > 0;
    useEffect(() => {
        // Show SplashScreen
        if (visible) {
            document.body.classList.remove('page-loading');
            return () => {
                document.body.classList.add('page-loading');
            };
        }
        // Hide SplashScreen
        let timeout;
        if (!visible) {
            timeout = window.setTimeout(() => {
                document.body.classList.add('page-loading');
            }, 3000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [visible]);
    const value = {
        setCount,
        count
    };
    useEffect(() => {
        const visible = true;
        if (!visible) {
            return;
        }
        if (setCount) {
            setCount((prev) => {
                return prev + 1;
            });
        }
        return () => {
            if (setCount) {
                setCount((prev) => {
                    return prev - 1;
                });
            }
        };
    }, [setCount, visible]);
    return (_jsx(SplashScreenContext.Provider, { value: value, children: children }));
};
export { SplashScreenProvider };
