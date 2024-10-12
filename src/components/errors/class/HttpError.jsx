class HttpError extends Error {
    constructor(message, status) {
      super(message); // (1)
      this.name = "HttpError" // (2)
      this.status = status
    }
  }