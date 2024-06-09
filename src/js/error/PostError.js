const PostError = class extends Error {
    constructor(message, response ){
        super(response.statusText)

        this.name = 'PostError'
        this.message = message
        this.responseMessages = response.statusText
        // const responseMessages = new Promise(response.json())
        // this.backendReport = getResultError
        this.response = response
    }
}

export { PostError }