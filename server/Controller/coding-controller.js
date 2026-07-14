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
      const userId = req.userId; // Из middleware авторизации (или убери, если авторизации пока нет)
      const { taskId } = req.params;

      const submissions = await Submission.find({ userId, taskId })
        .sort({ createdAt: -1 })
        .select("code language status createdAt");

      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения решений" });
    }
  }

  // 4. 👇 ВОТ ЭТОТ МЕТОД ДОЛЖЕН БЫТЬ ЗДЕСЬ!
  async submitCode(req, res) {
    try {
      const userId = req.userId || "guest"; // Временная заглушка, если нет авторизации
      const { taskId, code, language, status } = req.body;

      if (!taskId || !code) {
        return res.status(400).json({ message: "Недостаточно данных (taskId и code обязательны)" });
      }

      const newSubmission = await Submission.create({
        userId,
        taskId: Number(taskId),
        code,
        language: language || "JS",
        status: status || "Попытка",
      });

      res.status(201).json({
        message: "Решение сохранено",
        submission: newSubmission,
      });
    } catch (error) {
      console.error("Ошибка сохранения решения:", error);
      res.status(500).json({ message: "Ошибка сервера при сохранении" });
    }
  }
}

// 👇 ЭТА СТРОКА ОБЯЗАТЕЛЬНА!
module.exports = new CodingController();