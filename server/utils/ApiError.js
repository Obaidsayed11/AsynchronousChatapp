class ApiError extends Error {
    constructor(statusCode, message = "Server error", errors = [], stack = "") {
        super(message);  // Parent class (Error) ka constructor call kiya

        this.statusCode = statusCode; // HTTP status code
        this.success = false; // Error ke case me hamesha false rahega
        this.errors = errors; // Additional errors
        this.data = null; // Data null rahega kyunki error hai

        // Agar custom stack diya gaya hai toh use karein, warna default stack generate karein
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;