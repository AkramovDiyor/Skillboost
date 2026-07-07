const UserModel = require("../Models/User-models");

class UserController {
  // ... другие методы ...

  //   Получить все закладки пользователя
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

  //   Toggle: добавить или убрать из избранного
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

  async purchaseSubscription(req, res) {
    try {
      const userId = req.userId;
      const { subscriptionType } = req.body; // "standard" или "premium"

      if (!userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      if (!subscriptionType || !["standard", "premium"].includes(subscriptionType)) {
        return res.status(400).json({ message: "Неверный тип подписки" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Определяем длительность подписки
      // Standard = 1 месяц, Premium = 3 месяца
      const subscriptionDuration = subscriptionType === "standard" ? 1 : 3;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + subscriptionDuration);

      // Обновляем подписку
      user.subscriptionType = subscriptionType;
      user.subscriptionStartDate = startDate;
      user.subscriptionEndDate = endDate;
      await user.save();

      return res.json({
        success: true,
        message: `Подписка ${subscriptionType === "standard" ? "Стандарт" : "Премиум"} успешно активирована`,
        subscription: {
          type: subscriptionType,
          duration: subscriptionDuration,
          startDate: startDate,
          endDate: endDate,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Не удалось активировать подписку" });
    }
  }

  //   Получить текущую подписку
  async getSubscription(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверяем, не истекла ли подписка
      const now = new Date();
      const isExpired = user.subscriptionEndDate && now > user.subscriptionEndDate;

      if (isExpired) {
        // Сбрасываем подписку если она истекла
        user.subscriptionType = "none";
        user.subscriptionStartDate = null;
        user.subscriptionEndDate = null;
        await user.save();
      }

      return res.json({
        subscriptionType: isExpired ? "none" : user.subscriptionType,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        isActive: !isExpired && user.subscriptionType !== "none",
        daysRemaining: isExpired
          ? 0
          : Math.ceil((user.subscriptionEndDate - now) / (1000 * 60 * 60 * 24)),
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Не удалось получить информацию о подписке" });
    }
  }

  //   Проверка доступа к премиум-вопросам
  async checkQuestionsAccess(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      const now = new Date();
      const isExpired = user.subscriptionEndDate && now > user.subscriptionEndDate;
      const hasAccess = user.subscriptionType !== "none" && !isExpired;

      return res.json({
        hasAccess,
        subscriptionType: hasAccess ? user.subscriptionType : "none",
        daysRemaining: hasAccess
          ? Math.ceil((user.subscriptionEndDate - now) / (1000 * 60 * 60 * 24))
          : 0,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Не удалось проверить доступ" });
    }
  }

  //   Отмена подписки
  async cancelSubscription(req, res) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверяем, есть ли активная подписка
      const now = new Date();
      const isExpired = user.subscriptionEndDate && now > user.subscriptionEndDate;

      if (user.subscriptionType === "none" || isExpired) {
        return res.status(400).json({
          message: "У вас нет активной подписки"
        });
      }

      // Сохраняем информацию о том, что подписка была отменена
      const previousSubscription = user.subscriptionType;

      // Сбрасываем подписку
      user.subscriptionType = "none";
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      await user.save();

      return res.json({
        success: true,
        message: `Подписка ${previousSubscription} успешно отменена`,
        previousSubscription,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Не удалось отменить подписку" });
    }
  }
}

module.exports = new UserController();