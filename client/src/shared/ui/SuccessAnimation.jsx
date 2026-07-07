import { FaCheckCircle } from "react-icons/fa";

const SuccessAnimation = ({ show, type = "standard" }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col items-center gap-6 animate-scale-up">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                backgroundColor: ['#09B87E', '#9747FF', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>


        <div className={`w-32 h-32 rounded-full flex items-center justify-center animate-bounce-in ${
          type === 'premium' 
            ? 'bg-gradient-to-br from-[#9747FF] to-[#6B35B8]' 
            : 'bg-gradient-to-br from-[#09B87E] to-[#078F5F]'
        }`}>
          <FaCheckCircle className="text-white text-6xl" />
        </div>

        {/* Текст */}
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-3 animate-slide-up">
            Отличный выбор! 🎉
          </h2>
          <p className="text-2xl text-gray-300 animate-slide-up-delay">
            Вы получили максимальные возможности!
          </p>
        </div>

        {/* Прогресс бар */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-white animate-progress" />
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;