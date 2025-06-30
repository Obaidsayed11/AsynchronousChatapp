import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        messageType: {
            type: String,
            enum: ['text', 'file'],
            required: true,
        },
        content: {
            type: String,
            required: function () {
                return this.messageType === "text";
            },
        },
        file: {
            type: String,
            required: function () {
                return this.messageType === "file";
            },
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true  // ✅ Fixed typo (was "timeStamps")
    }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
