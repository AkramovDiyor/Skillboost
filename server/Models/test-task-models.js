
const mongoose = require("mongoose");

const testTaskSchema = new mongoose.Schema(
  {
    taskId: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    difficulty: { type: String, required: true },
    tech: { type: String, required: true },
    specialty: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestTask", testTaskSchema);