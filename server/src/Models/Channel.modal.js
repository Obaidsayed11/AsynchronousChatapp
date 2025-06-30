import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    }],
    admin: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    }],
    message: [{
        type: mongoose.Schema.ObjectId,
        ref: "Message",
        require: false
    }]
},
    {
        timestamps: true
    }
)


// ChannelSchema.pre("save",function(next){
//     this.
// })

const Channel = mongoose.model("channel", ChannelSchema)
export default Channel