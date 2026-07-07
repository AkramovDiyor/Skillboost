// shared/hooks/useSubscription.js
import { useState, useEffect, useRef } from "react";
import { subscriptionStore } from "../store/subscriptionStore";

export function useSubscription() {
  const [state, setState] = useState(subscriptionStore.getState());
  const prevTokenRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscriptionStore.subscribe(() => {
      setState(subscriptionStore.getState());
    });

    return unsubscribe;
  }, []);

  // 👇 Отслеживаем изменение токена
  useEffect(() => {
    const storedRaw = localStorage.getItem("data");
    const currentToken = storedRaw ? JSON.parse(storedRaw)?.token : null;
    
    // Если токен изменился (вошли или вышли) — перезагружаем подписку
    if (currentToken !== prevTokenRef.current) {
      prevTokenRef.current = currentToken;
      
      if (currentToken) {
        // Пользователь вошёл — загружаем подписку
        subscriptionStore.loadSubscription();
      } else {
        // Пользователь вышел — сбрасываем состояние
        setState({
          subscription: { subscriptionType: "none", isActive: false, daysRemaining: 0 },
          loading: false,
        });
      }
    }
  });

  return {
    subscription: state.subscription,
    loading: state.loading,
    refresh: subscriptionStore.loadSubscription,
  };
}