
import { useState, useEffect, useRef } from "react";
import { subscriptionStore } from "../store/subscriptionStore";

export function useSubscription() {
  const [state, setState] = useState(subscriptionStore.getState());
  

  const hasInitialized = useRef(false);

  useEffect(() => {

    const unsubscribe = subscriptionStore.subscribe(() => {
      setState(subscriptionStore.getState());
    });

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      const storedRaw = localStorage.getItem("data");
      const token = storedRaw ? JSON.parse(storedRaw)?.token : null;
      
      if (token) {

        subscriptionStore.loadSubscription();
      } else {
    
        subscriptionStore.loadSubscription(); 
      }
    }


    return unsubscribe;
  }, []); 

  return {
    subscription: state.subscription,
    loading: state.loading,
  
    refresh: () => subscriptionStore.loadSubscription(true),
  };
}