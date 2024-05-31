export function getAuthToken(){
    const token = localStorage.getItem('auth')
    return token
}

export function tokenLoader() {
    return getAuthToken()
}