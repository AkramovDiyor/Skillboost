// server/Models/submission-models.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "JS",
    },
    status: {
      type: String,
      enum: ["Попытка", "Решено"],
      default: "Попытка",
    },
    // 👇 Новое поле для красивой статистики в истории
    testResults: {
      passedCount: { type: Number, default: 0 },
      totalTests: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);