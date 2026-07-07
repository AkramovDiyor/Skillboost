const UserModel = require("../Models/User-models");

// Middleware для проверки доступа к премиум-вопросам
const checkQuestionsSubscription = async (req, res, next) => {
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
      user.subscriptionType = "none";
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      await user.save();
    }

    if (user.subscriptionType === "none" || isExpired) {
      return res.status(403).json({ 
        message: "Требуется активная подписка для доступа к вопросам",
        hasAccess: false
      });
    }

    // Добавляем информацию о подписке в запрос
    req.subscription = {
      type: user.subscriptionType,
      endDate: user.subscriptionEndDate,
    };

    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ошибка проверки подписки" });
  }
};

module.exports = { checkQuestionsSubscription };