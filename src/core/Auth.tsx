import React, { createContext, } from 'react'
import { useDispatch } from 'react-redux';
import { addCurrentUser, addUserRoleMenu, addUserRoleMenuFunc } from '../../redux/actions/userAction';

const AuthContext = createContext("")

const AuthProvider = ({ children }:any) => {
    const dispatch = useDispatch();
    const getAuth = async () => {
        if (!localStorage) {
            return
        }
        const lsValue = await localStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY)
        if (!lsValue) {
            return
        }

        try {
            const auth = await JSON.parse(lsValue)
            if (auth) {
                // You can easily check auth_token expiration also
                await dispatch(addCurrentUser(auth?.data?.auth_role_profile[0]))
                await dispatch(addUserRoleMenu(auth?.data?.auth_role_menu))
                await dispatch(addUserRoleMenuFunc(auth?.data?.auth_role_menu_func))
                // console.log(auth,'authauthauthauthauth');
            }
        } catch (error) {
            console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
        }
    }
    React.useMemo(() => {
        getAuth()
    },[])

    return (
        <AuthContext.Provider value={{ getAuth: () => Promise.resolve() } as unknown as string}>
            {children}
        </AuthContext.Provider>
    )
}



export { AuthProvider }
