// shared/store/subscriptionStore.js
import { subscriptionApi } from "../api/subscription";

// Глобальное хранилище
let state = {
  subscription: {
    subscriptionType: "none",
    isActive: false,
    daysRemaining: 0,
  },
  loading: true,
  listeners: new Set(),
};

// Подписка на изменения
const subscribe = (listener) => {
  state.listeners.add(listener);
  return () => state.listeners.delete(listener);
};

// Уведомление всех подписчиков
const notify = () => {
  state.listeners.forEach((listener) => listener());
};

// Загрузка подписки
const loadSubscription = async () => {
  try {
    state.loading = true;
    notify();
    
    const data = await subscriptionApi.getSubscription();
    state.subscription = data;
    state.loading = false;
    notify();
  } catch (error) {
    console.error("Ошибка загрузки подписки:", error);
    state.subscription = { subscriptionType: "none", isActive: false, daysRemaining: 0 };
    state.loading = false;
    notify();
  }
};

// Получение состояния
const getState = () => ({
  subscription: state.subscription,
  loading: state.loading,
});

// Первичная загрузка
loadSubscription();

export const subscriptionStore = {
  getState,
  subscribe,
  loadSubscription,
};