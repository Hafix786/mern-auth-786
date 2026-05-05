import { useState } from 'react'
import { AppContext } from './AppContext'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { useCallback } from 'react';

axios.defaults.withCredentials = true

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    
    const getUserData = useCallback(async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }, [backendUrl])

    useEffect(() => {
        const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
              setIsLoggedin(true)  
              getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
        getAuthState()
    }, [getUserData, backendUrl])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    
    return(
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}