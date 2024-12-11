import { jwtDecode } from "jwt-decode"

const inMemoryJwtManager = () => {
    let logoutEventName = 'ra-logout'
    let refreshEndpoint = '/api/token/refresh'
    let inMemoryJwt = null
    let inMemoryRoles = null
    let refreshTimeOutId
    let tokenCookie = null
    let isRefreshing = null
    let inMemoryJwtRefresh = null
    let inMemoryCheckValidSubscription = false

    window.addEventListener('storage', (event) => {
        if (event.key === logoutEventName) {
            inMemoryJwt = null
        }
    })

    const setRefreshTokenEndpoint = endpoint => refreshEndpoint = endpoint

    // This countdown feature is used to renew the JWT in a way that is transparent to the user.
    // before it's no longer valid
    const refreshToken = (delay) => {
        refreshTimeOutId = setTimeout(
            getRefreshedToken,
            delay * 1000 - 5000
        ) // Validity period of the token in seconds, minus 5 seconds
    }

    const abordRefreshToken = () => {
        if (refreshTimeOutId) {
            clearTimeout(refreshTimeOutId)
        }
    }

    const waitForTokenRefresh = () => {
        if (!isRefreshing) {
            return Promise.resolve()
        }
        return isRefreshing.then(() => {
            isRefreshing = null
            return true
        })
    }

    const checkAvailableRefreshToken = () => {
        const cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            const searchName = cookie.includes("xxx")
            if(searchName) {
                const refreshTokenCookie = cookie.split("=")[1]
                return refreshTokenCookie
            }
        }
        return false
    }

    const checkAvailableToken = () => {
        const cookies = document.cookie.split(';')
        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            const searchName = cookie.includes("yyy")
            const tokenCookie = cookie.split("=")[1]
            if(searchName && !!tokenCookie) return tokenCookie
        }
        return false
    }

    // The method makes a call to the refresh-token endpoint
    // If there is a valid cookie, the endpoint will return a fresh jwt.
    const getRefreshedToken = () => {
        
        const tokenCookie = checkAvailableRefreshToken()

        if(!tokenCookie) return false

        const bodyJson = JSON.stringify({refreshToken: tokenCookie})

        return fetch(refreshEndpoint, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: bodyJson,
        }).then((response) => {
            if (response.status !== 200) {
                ereaseToken()
                console.log(
                    'Failed to renew the jwt from the refresh token.'
                )
                return Promise.reject(new Error("Failed to renew the jwt from the refresh token.", 401))
            }
            return response.json()
        }).then(({ token, refreshToken }) => {
            if (token) {
                setRefreshToken(refreshToken)
                setToken(token)
                const getTokenData = jwtDecode(token)
                setRoles(getTokenData.roles)
                return Promise.resolve(token)
            }
            ereaseToken()
            return Promise.reject(new Error("No token available, please try login again!.", 401))
        }).catch(error => {
            console.error("Token refresh failed", error)    
            Promise.reject(error)
        })

            return isRefreshing
    }
    
    // const getRefreshedToken = () => {
        
    //     const tokenCookie = checkAvailableRefreshToken()

    //     if(!tokenCookie) return false

    //     const bodyJson = JSON.stringify({refreshToken: tokenCookie})

    //     isRefreshing = fetch(refreshEndpoint, {
    //         method: 'POST',
    //         headers: new Headers({ 'Content-Type': 'application/json' }),
    //         body: bodyJson,
    //     })
    //         .then((response) => {
    //             if (response.status !== 200) {
    //                 ereaseToken()
    //                 console.log(
    //                     'Failed to renew the jwt from the refresh token.'
    //                 )
    //                 return { token: null }
    //             }
    //             return response.json()
    //         })
    //         .then(({ token, refreshToken }) => {
    //             if (token) {
    //                 setRefreshToken(refreshToken)
    //                 setToken(token)
    //                 const getTokenData = jwtDecode(token)
    //                 setRoles(getTokenData.roles)
    //                 return token
    //             }
    //             ereaseToken()
    //             return false
    //         })

    //         return isRefreshing
    // }

    const getToken = () => {
        if(inMemoryJwt ){
            return inMemoryJwt
        } else {
            return checkAvailableToken() ?? false 
        }
    }

    const getRoles = () => inMemoryRoles
    
    const getValidSubscription = () => inMemoryCheckValidSubscription

    const setValidSubscription = (token) => {
        inMemoryCheckValidSubscription = token
        return true
    }

    const setToken = (token) => {
        const minutes = 7
        const expireDate = new Date()
        expireDate.setTime(expireDate.getTime()+(minutes*60*1000))
        document.cookie = 'yyy=' + token + ';path=/;Secure=true;expires=' + expireDate.toUTCString()
        inMemoryJwt = token
        return true
    }
    
    const setRoles = (roles) => {
        inMemoryRoles = [...roles]
        return true
    }

    const setRefreshToken = (token) => {
        localStorage.removeItem('ra-logout')
        inMemoryJwtRefresh = token
        const minutes = 10
        const expireDate = new Date()
        expireDate.setTime(expireDate.getTime()+(minutes*60*1000))
        document.cookie = 'xxx=' + token + ';path=/;Secure=true;expires=' + expireDate.toUTCString()
        return true
    }

    const ereaseToken = () => {
        inMemoryJwt = null
        const cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            const searchName = cookie.includes("yyy")
            const tokenCookie = cookie.split("=")[1]
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie

            // if (searchName) {
            //     document.cookie = name + "=;path=/dashboard;expires=" + Date.now()
            //     continue
            // }
            
            document.cookie = name + "=;path=/;expires=" + Date.now()            
        }
        localStorage.setItem('ra-logout', Date.now())
        return true
    }

    const setLogoutEventName = name => logoutEventName = name


    return {
        ereaseToken,
        getToken,
        getRoles,
        setLogoutEventName,
        getRefreshedToken,
        setRefreshTokenEndpoint,
        setRefreshToken,
        setToken,
        setRoles,
        refreshToken,
        abordRefreshToken,
        waitForTokenRefresh,
        getValidSubscription,
        setValidSubscription,
        checkAvailableToken,
        checkAvailableRefreshToken,
    }
}

export default inMemoryJwtManager()