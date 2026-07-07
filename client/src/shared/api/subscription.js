import { api_local } from "./base";

export const subscriptionApi = {
  // Покупка подписки
  purchase: async (subscriptionType) => {
    const { data } = await api_local.post("/subscription/purchase", {
      subscriptionType,
    });
    return data;
  },

  // Получить текущую подписку пользователя
  getSubscription: async () => {
    const { data } = await api_local.get("/subscription");
    return data;
  },

  // Проверить доступ к премиум-вопросам
  checkQuestionsAccess: async () => {
    const { data } = await api_local.get("/subscription/check-questions-access");
    return data;
  },

    // Отменить подписку
  cancel: async () => {
    const { data } = await api_local.post("/subscription/cancel");
    return data;
  },
};