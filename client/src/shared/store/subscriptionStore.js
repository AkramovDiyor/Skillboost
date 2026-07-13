
import { subscriptionApi } from "../api/subscription";

const CACHE_DURATION = 2 * 60 * 1000; 

let state = {
  subscription: { subscriptionType: "none", isActive: false, daysRemaining: 0 },
  loading: true,
  lastFetched: 0, 
  listeners: new Set(),
};

const subscribe = (listener) => {
  state.listeners.add(listener);
  return () => state.listeners.delete(listener);
};

const notify = () => {
  state.listeners.forEach((listener) => listener());
};

const loadSubscription = async (force = false) => {
  const storedRaw = localStorage.getItem("data");
  const token = storedRaw ? JSON.parse(storedRaw)?.token : null;
  
  if (!token) {
    state.subscription = { subscriptionType: "none", isActive: false, daysRemaining: 0 };
    state.loading = false;
    state.lastFetched = 0;
    notify();
    return;
  }

 
  const now = Date.now();
  if (!force && state.lastFetched > 0 && (now - state.lastFetched < CACHE_DURATION)) {
    state.loading = false;
    notify();
    return;
  }

  try {
    state.loading = true;
    notify();
    
    const data = await subscriptionApi.getSubscription();
    state.subscription = data;
    state.lastFetched = Date.now(); // 👈 Обновляем время
  } catch (error) {
    console.error("Ошибка загрузки подписки:", error);
    state.subscription = { subscriptionType: "none", isActive: false, daysRemaining: 0 };
  } finally {
    state.loading = false;
    notify();
  }
};


const storedRaw = localStorage.getItem("data");
if (storedRaw && JSON.parse(storedRaw)?.token) {
  loadSubscription();
} else {
  state.loading = false;
}

export const subscriptionStore = {
  getState: () => ({ subscription: state.subscription, loading: state.loading }),
  subscribe,
  loadSubscription,
};
