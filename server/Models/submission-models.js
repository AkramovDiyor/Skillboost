const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id: {
      type: Number, // ID задачи из твоего tasksData
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
  },
  { timestamps: true }
);

// Индекс, чтобы быстро искать последние решения пользователя для конкретной задачи
submissionSchema.index({ userId: 1, taskId: 1, createdAt: -1 });

module.exports = mongoose.model("Submission", submissionSchema);