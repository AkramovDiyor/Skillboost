const UserModel = require("../Models/User-models");

class UserController {
  // ... другие методы ...

  // ✅ Получить все закладки пользователя
  async getBookmarks(req, res) {
    try {
      const userId = req.userId; // из middleware авторизации
      
      const user = await UserModel.findById(userId).populate("bookmarks");
      
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }


      return res.json(user.bookmarks);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Не удалось получить закладки" });
    }
  }

  // ✅ Toggle: добавить или убрать из избранного
  async toggleBookmark(req, res) {
    try {
      const userId = req.userId; // ID из auth middleware
      const { questionId } = req.body; // ID вопроса из тела запроса
      if (!userId) {
        console.log("❌ No userId");
        return res.status(401).json({ message: "Не авторизован" });
      }
  
      if (!questionId) {
        console.log("❌ No questionId");
        return res.status(400).json({ message: "Не указан ID вопроса" });
      }

      if (!questionId) {
        return res.status(400).json({ message: "Не указан ID вопроса" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверяем, есть ли уже вопрос в закладках
      const isBookmarked = user.bookmarks.some(
        (id) => id.toString() === questionId
      );

      if (isBookmarked) {
        // Убираем из избранного
        user.bookmarks = user.bookmarks.filter(
          (id) => id.toString() !== questionId
        );
        await user.save();
        return res.json({ isBookmarked: false, message: "Удалено из избранного" });
      } else {
        // Добавляем в избранное
        user.bookmarks.push(questionId);
        await user.save();
        return res.json({ isBookmarked: true, message: "Добавлено в избранное" });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ошибка при обновлении закладок" });
    }
  }
}

module.exports = new UserController();