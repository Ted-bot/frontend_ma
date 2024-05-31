const PostError = class extends Error {
    constructor(response, jsonResponse){
        super(response.statusText)

        this.name = 'PostError'
        this.message = response.statusText
        const responseMessages = jsonResponse
        // const responseMessages = new Promise(response.json())
        this.backendReport = responseMessages
        this.response = response
    }
}

export { PostError }