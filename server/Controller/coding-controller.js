const Task = require("../Models/task-models");
const Submission = require("../Models/submission-models");
const mongoose = require("mongoose");

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
        .select("code language status createdAt testResults performance codeQuality");

      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения решений" });
    }
  }

  // 4. Метод отправки решения
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
      });

      res.status(201).json({
        message: "Решение сохранено",
        submission: newSubmission,
      });
    } catch (error) {
      console.error("Ошибка сохранения решения:", error);
      res.status(500).json({ message: "Ошибка сервера при сохранении", details: error.message });
    }
  }

  // 5. Удаление задачи по _id
  async deleteTask(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Неверный формат ID" });
      }

      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ message: "Задача не найдена" });
      }

      res.status(200).json({
        message: "Задача успешно удалена",
        deletedTask
      });
    } catch (error) {
      console.error("Ошибка удаления задачи:", error);
      res.status(500).json({ message: "Ошибка сервера при удалении задачи" });
    }
  }

  async deleteSubmission(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      // Выводим в консоль сервера то, что пришло:
      console.log("=== ПОПЫТКА УДАЛЕНИЯ РЕШЕНИЯ ===");
      console.log("ID решения из URL:", id);
      console.log("ID пользователя из токена (req.userId):", userId);

      // Проверка формата ID решения
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Неверный формат ID решения" });
      }

      // Проверка формата ID пользователя
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Неверный формат ID пользователя в токене" });
      }

      // ЯВНО конвертируем строку в ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Ищем решение с явным приведением типов
      const submission = await Submission.findOne({
        _id: id,
        userId: userObjectId
      });

      console.log("Найденное решение в БД:", submission); // Посмотрим, что нашлось

      if (!submission) {
        return res.status(404).json({
          message: "Решение не найдено или у вас нет прав на его удаление"
        });
      }

      // Удаляем решение
      await Submission.findByIdAndDelete(id);

      res.status(200).json({
        message: "Решение успешно удалено"
      });
    } catch (error) {
      console.error("Ошибка удаления решения:", error);
      res.status(500).json({ message: "Ошибка сервера при удалении решения" });
    }
  }
}

module.exports = new CodingController();