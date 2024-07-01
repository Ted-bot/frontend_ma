export function getAuthToken(){
    const token = JSON.parse(localStorage.getItem('auth'))
    return token
}

export function tokenLoader() {
    return getAuthToken()
}