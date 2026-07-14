// server/Models/task-models.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // 👇 Единственное важное числовое поле для идентификации задачи
    taskId: { 
      type: Number, 
      required: true, 
      unique: true,
      index: true 
    },
    title: { type: String, required: true },
    companies: [{ type: String }],
    difficulty: { type: String, enum: ["Легкая", "Средняя", "Сложная"], required: true },
    isPremium: { type: Boolean, default: false },
    languages: [{ type: String, default: ["JS"] }],
    
    description: [{ type: String }],
    requirements: [{ type: String }],
    examples: [{
      input: String,
      output: String,
      explanation: [{ type: String }]
    }],
    starterCode: { type: String, required: true },
    testCases: [{
      input: { type: mongoose.Schema.Types.Mixed },
      expected: { type: mongoose.Schema.Types.Mixed }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);