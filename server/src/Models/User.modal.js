import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: [true, "Email is require"],
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        firstName: {
            type: String,
            require: false
        },
        lastName: {
            type: String,
            require: false
        },
        image: {
            type: String,
            require: false
        },
        setColor: {
            type: Number,
            require: false
        },
        profileSetup: {
            type: Boolean,
            require: false
        }
    },
    {
        timeStamps: true

    }
)

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key jo env file me hogi
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const User = mongoose.model('User', userSchema);

export default User;