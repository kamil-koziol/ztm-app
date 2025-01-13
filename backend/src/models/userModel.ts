import mongoose, { Document, Schema, Model, Types} from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  stops: string[];
}

// Define the schema
const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stops: { type: [String], default: [] },
});

export const UserModel = mongoose.model("User", userSchema);
