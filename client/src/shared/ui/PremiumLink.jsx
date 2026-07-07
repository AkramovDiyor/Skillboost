// shared/ui/PremiumLink.jsx
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { useSubscription } from "../hooks/useSubscription";

const PremiumLink = ({ onClick, className = "" }) => {
  const { subscription, loading } = useSubscription();
  const hasActiveSubscription = subscription?.isActive;
  const subscriptionType = subscription?.subscriptionType;
  const storedRaw = localStorage.getItem("data");
  const isAuth = storedRaw ? true : false;

  if (!isAuth) return null; 

  if (loading) {
    return (
      <Link
        to="/subscription"
        onClick={onClick}
        className={`flex items-center gap-2 transition-all ${className}`}
      >
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </Link>
    );
  }

  const getStarColor = () => {
    if (!hasActiveSubscription) return "text-yellow-400";
    if (subscriptionType === "premium") return "text-purple-500";
    if (subscriptionType === "standard") return "text-green-500";
    return "text-yellow-400";
  };

  const getText = () => {
    if (!hasActiveSubscription) return "Премиум";
    if (subscriptionType === "premium") return "Премиум";
    if (subscriptionType === "standard") return "Стандарт";
    return "Премиум";
  };

  return (
    <Link
      to="/subscription"
      onClick={onClick}
      className={`flex items-center gap-2 transition-all ${className}`}
    >
      <FaStar className={`text-xl transition-colors duration-300 ${getStarColor()}`} />
      <h3 className={`font-normal ${getStarColor()} transition-all`}>
        {getText()}
      </h3>
    </Link>
  );
};

export default PremiumLink;