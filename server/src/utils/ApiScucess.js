// ApiSuccess class ek successful API response ka structure define karti hai
class ApiSuccess {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode; // HTTP status code store kar rahe hain (e.g., 200, 201)
        this.data = data; // API response ka actual data store ho raha hai
        this.message = message; // Default success message "success" rakha hai (custom bhi ho sakta hai)
        
        // Agar status code 400 se chhota hai, toh success true hoga (kyunki 400+ codes errors hote hain)
        this.success = statusCode < 400;  
    }
}

export default ApiSuccess