import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },

}, { timestamps: true })
const messagemodel = mongoose.model("Message", MessageSchema);
export default messagemodel;