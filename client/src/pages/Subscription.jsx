import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { faqData } from "../shared/data/faqSubscriptionData";
import { useSubscription } from "../shared/hooks/useSubscription";
import { usePurchaseSubscription } from "../features/PurchaseSubscription";
import { FaCheckCircle } from "react-icons/fa";
import { SlDiamond } from "react-icons/sl";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import SuccessAnimation from "../shared/ui/SuccessAnimation"; 


const Subscription = () => {
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "", price: "", description: "", type: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successType, setSuccessType] = useState("standard");

  const contentRefs = useRef({});

  const { subscription: currentSubscription } = useSubscription();

  const { purchasingType, purchase } = usePurchaseSubscription(() => {
    setSuccessType(modalContent.type || purchasingType);
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 3000);
  });

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  const handleModalOpen = (content) => {
    if (currentSubscription?.isActive) return;
    setModalContent(content);
    setModalOpen(true);
    setAppliedPromo(null);
    setPromoCode("");
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setAppliedPromo({ code: promoCode, discount: 0 });
  };

  const Spinner = () => (
    <>
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Обработка...
    </>
  );

  return (
    <div>

      <SuccessAnimation show={showSuccessAnimation} type={successType} />

      <section className="flex flex-col">
        <h1 className="font-bold text-2xl text-[var(--color-text)] sm:text-5xl leading-10 sm:leading-[56px] mb-10">
          Оформи подписку и получи <br /> дополнительные преимущества
        </h1>

        {currentSubscription?.isActive && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-500 text-2xl" />
              <div>
                <p className="font-bold text-[var(--color-text)]">
                  У вас активна подписка {currentSubscription.subscriptionType === "standard" ? "Стандарт" : "Премиум"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Осталось {currentSubscription.daysRemaining} дн.
                </p>
              </div>
            </div>
            <Link to="/profile" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Перейти в профиль
            </Link>
          </div>
        )}

        <section className="flex md:flex-row flex-col items-center gap-10 w-full mt-10">
          {/* Standard */}
          <article className="group relative overflow-hidden bg-[#09B87E] flex flex-col gap-5 md:max-w-[500px] rounded-[20px] p-5 sm:p-7 basis-1/2 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#09B87E]/50">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-2xl">
                <HiOutlineRocketLaunch />
                <h3 className="font-bold text-2xl lg:text-3xl text-white">Старт карьеры</h3>
              </div>
              <p className="text-white text-md lg:text-xl font-light">
                Получи доступ к 500+ вопросам с реальных собеседований и подготовься за 30 дней
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/80 text-sm line-through">1990 ₽</span>
                <span className="bg-white/20 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">-35%</span>
              </div>
            </header>

            <section className="w-full mt-auto flex flex-col justify-between gap-3 p-4 rounded-[20px] bg-white">
              <div className="flex items-baseline gap-2">
                <h3 className="font-semibold text-4xl text-black">1290 ₽</h3>
                <span className="text-gray-500 text-sm">/ месяц</span>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#09B87E]">✓</span>
                  Все вопросы с собеседований
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#09B87E]">✓</span>
                  Подробные ответы и решения
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#09B87E]">✓</span>
                  Фильтр по уровню и технологии
                </li>
              </ul>

              <button
                onClick={() => handleModalOpen({
                  title: "🚀 Старт карьеры",
                  price: "1290 ₽",
                  description: "Полный доступ ко всем вопросам на 1 месяц. Идеально для быстрой подготовки к собеседованию.",
                  type: "standard",
                })}
                disabled={purchasingType !== null || currentSubscription?.isActive}
                className="cursor-pointer p-button p-button-sm !bg-transparent w-full max-w-48 text-st-green-90 border-2 hover:border-[#7cdbbbfd] hover:text-[#7cdbbbfd] duration-300 border-[#09B87E] text-[#09B87E] rounded-lg disabled:opacity-50 transition-all hover:scale-105"
              >
                Ввести промокод
              </button>
            </section>

            <button
              onClick={() => purchase("standard")}
              disabled={purchasingType !== null || currentSubscription?.isActive}
              className="relative bg-black text-white hover:bg-neutral-700 font-medium px-5 py-3 rounded-xl text-base z-10 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {purchasingType === "standard" ? <Spinner /> : (
                <>
                  <span className="relative z-10">Начать подготовку</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                </>
              )}
            </button>
          </article>

          {/* Premium */}
          <article className="group relative overflow-hidden flex flex-col gap-5 md:max-w-[500px] basis-1/2 p-5 sm:p-7 rounded-[20px] bg-[#9747FF] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#9747FF]/50">
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold z-20 animate-bounce-slow">
              🔥 ВЫГОДНО
            </div>

            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-2xl">
                <SlDiamond />
                <h3 className="font-bold lg:text-3xl text-white">Профи</h3>
              </div>
              <p className="text-white text-md lg:text-xl font-light">
                Безлимитный доступ на 3 месяца + тренажёр собеседований. Экономия 40%!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/80 text-sm line-through">4970 ₽</span>
                <span className="bg-white/20 text-white px-2 py-1 rounded text-sm font-bold animate-pulse">-40%</span>
              </div>
            </header>

            <section className="w-full mt-auto flex flex-col justify-between gap-3 p-4 rounded-[20px] bg-white z-10">
              <div className="flex items-baseline gap-2">
                <h3 className="font-semibold text-4xl text-black">2990 ₽</h3>
                <span className="text-gray-500 text-sm">/ 3 месяца</span>
              </div>

              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-[#9747FF]">✓</span>
                  Всё из тарифа "Старт карьеры"
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#9747FF]">✓</span>
                  Тренажёр собеседований (бесплатно)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#9747FF]">✓</span>
                  Приоритетная поддержка 24/7
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#9747FF]">✓</span>
                  Новые вопросы каждую неделю
                </li>
              </ul>

              <button
                onClick={() => handleModalOpen({
                  title: "💎 Профи",
                  price: "2990 ₽",
                  description: "Максимальная выгода: 3 месяца безлимитного доступа + тренажёр собеседований. Самый популярный выбор!",
                  type: "premium",
                })}
                disabled={purchasingType !== null || currentSubscription?.isActive}
                className="p-button p-button-sm !bg-transparent w-full max-w-48 text-st-green-90 border-2 hover:border-[#09B87E] border-[#09B87E] text-[#09B87E] rounded-lg disabled:opacity-50 transition-all hover:scale-105"
              >
                Ввести промокод
              </button>
            </section>

            <button
              onClick={() => purchase("premium")}
              disabled={purchasingType !== null || currentSubscription?.isActive}
              className="relative bg-black text-white hover:bg-neutral-700 font-medium px-5 py-3 rounded-xl text-base z-10 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/50 overflow-hidden group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              {purchasingType === "premium" ? <Spinner /> : (
                <>
                  <span className="relative z-10">Получить максимум</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                </>
              )}
            </button>
          </article>
        </section>
      </section>

      <SubscriptionDialog
        modalOpen={modalOpen}
        onClose={setModalOpen}
        content={modalContent}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onPurchase={() => purchase(modalContent.type)}
        purchaseLoading={purchasingType === modalContent.type}
      />

      <section className="w-full pb-20">
        <h2 className="font-bold text-[40px] mt-8 mb-6 text-[var(--color-text)]">FAQ</h2>
        <div className="w-full bg-[var(--bg-03)] rounded-lg border border-[#262840]">
          {faqData.map(({ id, title, content }) => {
            const isOpen = open === id;
            return (
              <div key={id} className="mb-2 px-2 border-t border-[#262840] overflow-hidden transition-all duration-500">
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className={`flex justify-between w-full text-left text-[#9493A1] text-lg py-4 px-2 font-medium dark:!bg-st-white-T5 ${isOpen ? "text-[var(--color-text)]" : ""} hover:text-[var(--color-text)] transition-colors`}
                >
                  {title}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z" fill="currentColor" />
                  </svg>
                </button>
                <div
                  ref={(el) => { contentRefs.current[id] = el; }}
                  className="transition-all duration-500 ease-in-out px-2 overflow-hidden text-[#9493A1]"
                  style={{ maxHeight: isOpen ? `${contentRefs.current[id]?.scrollHeight}px` : "0px" }}
                >
                  <p className="text-sm pb-4">{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

function SubscriptionDialog({ onClose, content, modalOpen, promoCode, setPromoCode, appliedPromo, onApplyPromo, onPurchase, purchaseLoading }) {
  if (modalOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "auto";

  return modalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] animate-fade-in">
      <div className="relative bg-[var(--bg-03)] border border-[#262840] w-[400px] rounded-lg p-6 animate-scale-up">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">{content.title}</h1>
            <p className="mt-1 text-gray-400 text-sm">{content.description}</p>
          </div>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 bg-[var(--color-accent)] px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:border-2 focus:border-[var(--color-main)] placeholder-gray-500 text-[var(--color-text)] transition-all"
              placeholder="Введите промокод"
              maxLength={30}
              autoFocus
            />
            <button
              onClick={onApplyPromo}
              disabled={!promoCode.trim() || !!appliedPromo}
              className="px-6 bg-[var(--color-main)] disabled:opacity-50 rounded-lg text-white font-medium transition-all hover:scale-105"
            >
              {appliedPromo ? "✓" : "Применить"}
            </button>
          </div>

          {appliedPromo && (
            <div className="text-green-500 text-sm flex items-center gap-2 animate-slide-in-right">
              <FaCheckCircle /> Промокод "{appliedPromo.code}" применён
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Стоимость подписки</span>
            <span className="text-2xl font-bold text-[var(--color-text)]">{content.price}</span>
          </div>

          <button
            onClick={onPurchase}
            disabled={purchaseLoading}
            className="w-full py-3 bg-[var(--color-main)] disabled:opacity-50 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg"
          >
            {purchaseLoading ? "Обработка..." : "Перейти к оплате"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscription;