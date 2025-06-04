import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    setColor: {
      type: Number,
      required: false,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeStamps: true,
  }
);

// pre ek middle ware hai before saving the function
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // const salt = await genSalt(); // salt encryption kew liye use hota hai
    this.password = await bcrypt.hash(this.password, 10);
  }

  next(); // next islkiye use hota hai kyuki server ko bataye ki yeh code hogaya hai aapo dusre code par jaa skte hai
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this.id },
    process.env.ACCESS_TOKEN_SECRET, // secret key jo env mai hogi
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
