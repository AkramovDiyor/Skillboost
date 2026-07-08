import { api_local, api } from "./base";

export const subscriptionApi = {
  // Покупка подписки
  purchase: async (subscriptionType) => {
    const { data } = await api.post("/subscription/purchase", {
      subscriptionType,
    });
    return data;
  },

  // Получить текущую подписку пользователя
  getSubscription: async () => {
    const { data } = await api.get("/subscription");
    return data;
  },

  // Проверить доступ к премиум-вопросам
  checkQuestionsAccess: async () => {
    const { data } = await api.get("/subscription/check-questions-access");
    return data;
  },

    // Отменить подписку
  cancel: async () => {
    const { data } = await api.post("/subscription/cancel");
    return data;
  },
};