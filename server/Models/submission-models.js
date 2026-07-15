// server/Models/submission-models.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: Number, required: true },
    code: { type: String, required: true },
    language: { type: String, default: "JS" },
    status: { type: String, enum: ["Попытка", "Решено"], default: "Попытка" },
    testResults: {
      passedCount: { type: Number, default: 0 },
      totalTests: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    // 👇 НОВЫЕ ПОЛЯ ДЛЯ ОЦЕНКИ LEETCODE-STYLE
    performance: {
      executionTimeMs: { type: Number, default: 0 },
      rating: { type: String, enum: ["Отлично", "Хорошо", "Плохо"], default: "Хорошо" }
    },
    codeQuality: {
      score: { type: Number, default: 0 }, // От 0 до 100
      issues: [{ type: String }] // Массив замечаний, например ["Использовано var", "Есть console.log"]
    }
  },
  { timestamps: true }
);
// ... index и module.exports остаются без изменений

submissionSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);