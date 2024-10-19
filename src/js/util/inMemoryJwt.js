const inMemoryJwtManager = () => {
    let logoutEventName = 'ra-logout'
    let refreshEndpoint = '/api/token/refresh'
    let inMemoryJwt = null
    let refreshTimeOutId
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
                const tokenCookie = cookie.split("=")[1]
                return tokenCookie
            }
            return false
        }
    }

    // The method makes a call to the refresh-token endpoint
    // If there is a valid cookie, the endpoint will return a fresh jwt.
    const getRefreshedToken = () => {
        
        const tokenCookie = checkAvailableRefreshToken()

        if(!tokenCookie) return

        const bodyJson = JSON.stringify({refreshToken: tokenCookie})

        isRefreshing = fetch(refreshEndpoint, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: bodyJson,
        })
            .then((response) => {
                if (response.status !== 200) {
                    ereaseToken()
                    console.log(
                        'Failed to renew the jwt from the refresh token.'
                    )
                    return { token: null }
                }
                return response.json()
            })
            .then(({ token, refreshToken }) => {
                if (token) {
                    setRefreshToken(refreshToken)
                    setToken(token)
                    return true
                }
                ereaseToken()
                return false
            })

            return isRefreshing
    }

    const getToken = () => inMemoryJwt
    
    const getValidSubscription = () => inMemoryCheckValidSubscription

    const setValidSubscription = (token) => {
        inMemoryCheckValidSubscription = token
        return true
    }

    const setToken = (token) => {
        inMemoryJwt = token
        return true
    }

    const setRefreshToken = (token) => {
        inMemoryJwtRefresh = token
        const minutes = 10
        const expireDate = new Date()
        expireDate.setTime(expireDate.getTime()+(minutes*60*1000))
        document.cookie = 'xxx=' + token + '; expires=' + expireDate.toUTCString()
        return true
    }

    const ereaseToken = () => {
        inMemoryJwt = null
        const cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            const eqPos = cookie.indexOf("=")
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
            const expireDate = new Date()
            document.cookie = name + "=;expires=" + expireDate.toUTCString()
            // document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
        localStorage.setItem('ra-logout', Date.now())
        return true
    }

    const setLogoutEventName = name => logoutEventName = name



    return {
        ereaseToken,
        getToken,
        setLogoutEventName,
        getRefreshedToken,
        setRefreshTokenEndpoint,
        setRefreshToken,
        setToken,
        refreshToken,
        abordRefreshToken,
        waitForTokenRefresh,
        getValidSubscription,
        setValidSubscription,
        checkAvailableRefreshToken
    }
}

export default inMemoryJwtManager()