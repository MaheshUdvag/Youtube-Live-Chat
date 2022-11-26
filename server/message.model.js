import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  message: {
    type: String,
    required: [true, "name is required"],
  },
});

export default mongoose.model("message", messageSchema, "message");
