const TestTask = require("../Models/test-task-models");

class TestTaskController {
  async getAllTestTasks(req, res) {
    try {
      const { specialty } = req.query;
      // Если передан specialty, фильтруем, иначе возвращаем все
      const query = specialty && specialty !== 'all' ? { specialty } : {};
      
      const tasks = await TestTask.find(query);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения тестовых заданий" });
    }
  }

  async getTestTaskById(req, res) {
    try {
      const { id } = req.params;
      
      // 👇 Ищем по стандартному _id из MongoDB
      const task = await TestTask.findById(id);
      
      if (!task) {
        return res.status(404).json({ message: "Задание не найдено" });
      }
      res.status(200).json(task);
    } catch (error) {
      // 👇 Добавили лог, чтобы видеть реальную ошибку в консоли сервера
      console.error("Ошибка получения задания:", error);
      res.status(500).json({ message: "Ошибка получения задания" });
    }
  }
}

module.exports = new TestTaskController();