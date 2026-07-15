// server/Controller/coding-controller.js
const Task = require("../Models/task-models");
const Submission = require("../Models/submission-models");

class CodingController {
  // 1. Получить список всех задач
  async getAllTasks(req, res) {
    try {
      const tasks = await Task.find({}, "taskId title companies difficulty isPremium languages extraCompanies");
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения списка задач" });
    }
  }

  // 2. Получить одну задачу подробно
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findOne({ taskId: Number(id) });
      
      if (!task) {
        return res.status(404).json({ message: "Задача не найдена" });
      }
      
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения задачи" });
    }
  }


  // 3. Получить мои решения для задачи

  async getUserSubmissions(req, res) {
    try {
      const userId = req.userId; 
      const { taskId } = req.params;

      const submissions = await Submission.find({ userId, taskId })
        .sort({ createdAt: -1 })
        // 👇 ДОБАВЬ СЮДА performance И codeQuality
        .select("code language status createdAt testResults performance codeQuality");

      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения решений" });
    }
  }

  // Метод отправки решения
  async submitCode(req, res) {
    try {
      const userId = req.userId; 
      const { taskId, code, language, status, testResults, performance, codeQuality } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Пользователь не авторизован" });
      }
      if (!taskId || !code) {
        return res.status(400).json({ message: "Недостаточно данных" });
      }

      const newSubmission = await Submission.create({
        userId,
        taskId: Number(taskId),
        code,
        language: language || "JS",
        status: status || "Попытка",
        testResults: testResults || { passedCount: 0, totalTests: 0, percent: 0 },
        performance: performance || { executionTimeMs: 0, rating: "Хорошо" }, 
        codeQuality: codeQuality || { score: 0, issues: [] } 
      }); // 👈 Убрал лишнюю точку с запятой

      res.status(201).json({
        message: "Решение сохранено",
        submission: newSubmission,
      });
    } catch (error) {
      console.error("Ошибка сохранения решения:", error);
      res.status(500).json({ message: "Ошибка сервера при сохранении", details: error.message });
    }
  }
// server/Controller/coding-controller.js (метод submitCode)
async submitCode(req, res) {
  try {
    const userId = req.userId; 
    const { taskId, code, language, status, testResults, performance, codeQuality } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }
    if (!taskId || !code) {
      return res.status(400).json({ message: "Недостаточно данных" });
    }


    const newSubmission = await Submission.create({
      userId,
      taskId: Number(taskId),
      code,
      language: language || "JS",
      status: status || "Попытка",
      testResults: testResults || { passedCount: 0, totalTests: 0, percent: 0 },
      performance: performance || { executionTimeMs: 0, rating: "Хорошо" }, // 👈
      codeQuality: codeQuality || { score: 0, issues: [] } // 👈
    });;

    res.status(201).json({
      message: "Решение сохранено",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Ошибка сохранения решения:", error);
    res.status(500).json({ message: "Ошибка сервера при сохранении", details: error.message });
  }
}
}

// 👇 ЭТА СТРОКА ОБЯЗАТЕЛЬНА!
module.exports = new CodingController();