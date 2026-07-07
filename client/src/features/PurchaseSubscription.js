
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionApi } from "../shared/api/subscription";
import { subscriptionStore } from "../shared/store/subscriptionStore";

export const usePurchaseSubscription = (onSuccess) => {
  const navigate = useNavigate();
  const [purchasingType, setPurchasingType] = useState(null);

  const checkAuth = () => {
    const userData = localStorage.getItem("data");
    if (!userData) {
      setTimeout(() => navigate("/auth"), 1500);
      return false;
    }
    return true;
  };

  const purchase = async (type) => {
    if (!checkAuth()) return;

    setPurchasingType(type);
    try {
      const result = await subscriptionApi.purchase(type);
      if (result.success) {
        await subscriptionStore.loadSubscription();
        if (onSuccess) onSuccess();
        setTimeout(() => navigate("/profile"), 2500);
      }
    } catch (error) {
      console.error("Ошибка покупки:", error);
    } finally {
      setPurchasingType(null);
    }
  };

  return { purchasingType, purchase };
};