class ValidationError extends Error {
    constructor(data) {
        super(data);
        this.name = "ValidationError";
        this.data = data;
    }
}

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        this.message = message;
    }
}


module.exports = {
    ForbiddenError,
    ValidationError
};