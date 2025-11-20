import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: { type: String, enum: ["low", "medium", "high"] },
//   status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
status:{
type:String,
enum:["pending","in-progress","completed"],
default:"pending"
},
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
