class ApiResponse {
    //contructor is called whenever we send a response using this ApiResponse class
    constructor(statusCode, data, message="Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}

//this class in node.js helps us to send custom api responses with various featues like status code success etc