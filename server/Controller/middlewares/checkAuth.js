const jwt = require("jsonwebtoken");
const UserModel = require("../../Models/User-models");

// Middleware для проверки токена
module.exports = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      next();
    } catch (e) {
      console.log("Authorization:", req.headers.authorization);
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(402).json({
      message: "Нет доступа",
    });
  }
};

// Middleware для проверки подписки
module.exports.checkSubscription = async (req, res, next) => {
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