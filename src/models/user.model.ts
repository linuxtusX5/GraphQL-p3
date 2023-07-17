import mongoose, { ObjectId } from "mongoose";

interface User {
    name: string;
    email: string;
    password: string;
    messages: ObjectId[];
    received: ObjectId[];
}
const UserSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true,
        },
    email: {
        type: String,
        required: true,
        },
    password: {
        type: String,
        required: true,
        },
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'Message',
    }],
    received: [{
        type: mongoose.Types.ObjectId,
        ref: 'Message',
    }]
}, { timestamps: true })
const usermodel = mongoose.model<User>("User", UserSchema);
export default usermodel;