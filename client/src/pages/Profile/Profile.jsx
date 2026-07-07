import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoMdBookmark } from "react-icons/io";
import { MdOutlineSubscriptions } from "react-icons/md";
import Edit from "./Edit/Edit";
import { useNavigate, Link } from "react-router-dom";
import { bookmarksApi } from "../../shared/api/bookmarks";
import { useSubscription } from "../../shared/hooks/useSubscription";
import { subscriptionApi } from "../../shared/api/subscription";

const Profile = () => {
  const [edit, setEdit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  

  const { subscription, loading: subscriptionLoading, refresh } = useSubscription();
  
  const storedData = JSON.parse(localStorage.getItem("data")) || {};
  const avatarUrl = storedData.avatarUrl ? storedData.avatarUrl : null;

  const navigate = useNavigate();


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setBookmarksLoading(true);
        const data = await bookmarksApi.getAll();
        setBookmarks(data);
      } catch (error) {
        console.error("Ошибка при получении закладок:", error);
        setBookmarks([]);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const removeBookmark = async (questionId) => {
    const updatedBookmarks = bookmarks.filter(item => item._id !== questionId);
    setBookmarks(updatedBookmarks);

    try {
      await bookmarksApi.toggle(questionId);
    } catch (error) {
      console.error("Ошибка при удалении из избранного:", error);
      setBookmarks(bookmarks);
      alert("Не удалось удалить из избранного");
    }
  };


  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const result = await subscriptionApi.cancel();
      if (result.success) {
     
        await refresh();
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error("Ошибка отмены подписки:", error);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("data");
    localStorage.clear();
    navigate('/auth');
  };

  const tabs = [
    { id: 0, title: "Информация" },
    { id: 1, title: "Избранное" },
  ];

  const formatEndDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderSubscriptionBlock = () => {
    if (subscriptionLoading) {
      return (
        <section className="flex flex-col gap-3 border border-[var(--color-text)] p-3 md:p-4 dark:bg-st-white-T5 rounded-2xl animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </section>
      );
    }

    const isActive = subscription?.isActive;
    const isStandard = subscription?.subscriptionType === "standard";
    const isPremium = subscription?.subscriptionType === "premium";

    return (
      <section 
        className={`flex flex-col gap-3 border p-3 md:p-4 dark:bg-st-white-T5 rounded-2xl ${
          isActive 
            ? isPremium 
              ? "border-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-transparent"
              : "border-green-500 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-transparent"
            : "border-[var(--color-text)]"
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <MdOutlineSubscriptions className="text-[var(--color-main)]" />
            Подписка
          </h3>
          
          {isActive && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPremium 
                ? "bg-purple-500 text-white" 
                : "bg-green-500 text-white"
            }`}>
              {isPremium ? " Премиум" : "Стандарт"}
            </span>
          )}
        </div>

        {isActive ? (
          <>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[#6e8a9e]">Статус:</span>
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Активна
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6e8a9e]">Действует до:</span>
                <span className="font-bold text-[var(--color-text)]">
                  {formatEndDate(subscription.endDate)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[#6e8a9e]">Осталось дней:</span>
                <span className={`font-bold ${
                  subscription.daysRemaining <= 3 ? "text-red-500" : "text-[var(--color-text)]"
                }`}>
                  {subscription.daysRemaining} {subscription.daysRemaining === 1 ? "день" : subscription.daysRemaining < 5 ? "дня" : "дней"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 border border-red-500 text-red-500 py-2 px-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer font-medium"
              >
                Отменить подписку
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-[#6e8a9e]">
                У вас нет активной подписки. Оформите подписку, чтобы получить доступ ко всем вопросам.
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <Link 
                to="/subscription" 
                className="flex-1 bg-[var(--color-main)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
              >
                Оформить подписку
              </Link>
            </div>
          </>
        )}
      </section>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <section className="w-full flex flex-col gap-3">
              <section className="flex flex-col gap-3 border border-[var(--color-text)] p-3 md:p-4 dark:bg-st-white-T5 rounded-2xl sm:flex-row">
                <section className="flex justify-between items-start gap-1.5">
                  <button className="relative w-fit h-fit" disabled>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                      {avatarUrl ? (
                        <img
                          src={`http://localhost:4444${avatarUrl}`}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-full h-full text-[#6e8a9e] dark:text-st-gray-60" />
                      )}
                    </div>
                  </button>
                </section>
                <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <section className="flex flex-col gap-1">
                    <p className="text-[#6e8a9e]">Имя</p>
                    <p className="text-xl font-bold text-[var(--color-text)]">
                      {storedData.fullName}
                    </p>
                  </section>
                  <section className="flex flex-col gap-1">
                    <p className="text-[#6e8a9e]">Никнейм</p>
                    <p className="transition-colors text-xl font-bold w-fit text-[var(--color-text)]">
                      {storedData.username || "Не указан"}
                    </p>
                  </section>
                  <section className="flex flex-col gap-1">
                    <p className="text-[#6e8a9e]">Страна, город</p>
                    <p className="text-xl font-bold text-[var(--color-text)]">
                      {storedData.location || "Не указан"}
                    </p>
                  </section>
                  <section className="flex flex-col gap-1 lg:col-span-2">
                    <p className="text-[#6e8a9e]">Email</p>
                    <p className="text-xl font-bold text-wrap break-words text-[var(--color-text)]">
                      {storedData.email || "Не указан"}
                    </p>
                  </section>
                </section>
              </section>

              {renderSubscriptionBlock()}

              <section className="flex flex-col gap-3 border border-[var(--color-text)] p-3 md:p-4 dark:bg-st-white-T5 rounded-2xl">
                <h3 className="text-2xl font-bold text-[var(--color-text)]">О себе</h3>
                <p className="text-[#6e8a9e]">
                  {storedData.bio || "Биография не указана"}
                </p>
              </section>

              <section className="flex flex-col gap-3 border border-[var(--color-text)] p-3 md:p-4 dark:bg-st-white-T5 rounded-2xl">
                <h3 className="text-2xl font-bold text-[var(--color-text)]">Опыт</h3>
                <section className="flex flex-col gap-4">
                  <p className="text-[#6e8a9e]">
                    {storedData.specialization || "Специализация не указана"}
                  </p>
                </section>
              </section>

              <div className="flex justify-end gap-5">
                <button
                  onClick={handleLogout}
                  className="border border-[#ff0000] text-[#ff0000] p-2 rounded-lg cursor-pointer self-end"
                >
                  Выйти из аккаунта
                </button>
                <button
                  onClick={() => setEdit(true)}
                  className="border border-[var(--color-main)] text-[var(--color-main)] p-2 rounded-lg cursor-pointer self-end"
                >
                  Редактировать
                </button>
              </div>
            </section>
          </div>
        );
      
      case 1:
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-3 text-[var(--color-text)]">Избранное</h3>

            {bookmarksLoading ? (
              <div className="text-center py-8 text-gray-400">
                <p>Загрузка избранных...</p>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <p>Пока ничего не добавлено в избранное</p>
                <p className="text-sm mt-1">Добавляйте вопросы во время собеседований</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((item, index) => (
                  <section 
                    key={item._id} 
                    className="text-[var(--color-text)] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-surface-500 w-full py-2 px-4 rounded-2xl my-4"
                  >
                    <section className="relative w-full">
                      <section className="flex flex-col gap-3 pt-4 pb-2">
                        <section className="flex flex-col gap-2 text-sm">
                          <header className="text-xl font-medium flex gap-2 items-center">
                            <section className="flex items-center gap-2 relative support-selectable">
                              <section>
                                <h2 className="font-normal text-base sm:text-xl">{item.title}</h2>
                              </section>
                            </section>
                            <section className="relative inline-flex ml-auto">
                              <button
                                onClick={() => removeBookmark(item._id)}
                                aria-label="Удалить из избранного"
                                className="relative flex items-center justify-center text-[var(--color-main)]"
                              >
                                <IoMdBookmark className="text-[20px] cursor-pointer" />
                              </button>
                            </section>
                          </header>

                          <div className="rounded-2xl p-0.5 px-3 w-fit font-medium text-base bg-[var(--bg-03)]">
                            {item.difficulty || "Без уровня"}
                          </div>
                          <div>
                            Рейтинг вопроса:
                            <span className="font-medium">
                              {" "}{item.rating || "Нет оценки"}
                            </span>
                          </div>
                        </section>

                        {visibleAnswerIndex === index ? (
                          <div className="answer-box">
                            <p>
                              <strong>Ответ:</strong> {item.answer}
                            </p>
                            <button
                              className="flex gap-1 items-center text-slate-500 dark:text-slate-400 hover:underline hover:decoration-1 hover:decoration-slate-300 hover:underline-offset-4 mt-2"
                              onClick={() => setVisibleAnswerIndex(null)}
                            >
                              Скрыть ответ
                            </button>
                          </div>
                        ) : (
                          <button
                            className="flex gap-1 items-center text-slate-500 dark:text-slate-400 hover:underline hover:decoration-1 hover:decoration-slate-300 hover:underline-offset-4"
                            onClick={() => setVisibleAnswerIndex(index)}
                          >
                            Посмотреть ответ
                          </button>
                        )}
                      </section>
                    </section>
                  </section>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {edit ? (
        <div>
          <Edit setEdit={setEdit} />
        </div>
      ) : (
        <div className="pb-5">
          <div className="relative">
            <ul className="flex list-none p-0 m-0 relative w-[260px]">
              {tabs.map((tab) => (
                <li key={tab.id} className="flex-1 sm:flex-none">
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setVisibleAnswerIndex(null);
                    }}
                    className={`
                      w-full sm:w-auto px-6 py-4 text-sm font-medium transition-colors duration-300
                      ${activeTab === tab.id ? "text-[var(--color-main)]" : "text-[#6e8a9e] hover:text-[var(--color-text)]"}
                    `}
                  >
                    {tab.title}
                  </button>
                </li>
              ))}

              <li
                className="absolute bottom-0 h-1 transition-all duration-300 ease-in-out"
                style={{
                  width: `${100 / tabs.length}%`,
                  left: `${(activeTab * 100) / tabs.length}%`,
                  backgroundColor: 'var(--color-main)',
                  borderRadius: '2px 2px 0 0'
                }}
              />
            </ul>
          </div>

          <h1 className="font-bold text-[32px] px-2 md:px-0 my-5 text-[var(--color-text)]">
            Мой профиль
          </h1>

          <div>
            {renderTabContent()}
          </div>

          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4 text-[var(--color-text)]">
                  Отменить подписку?
                </h3>
                <p className="text-[#6e8a9e] mb-6">
                  После отмены вы потеряете доступ к премиум-вопросам. 
                  Оставшиеся дни не будут компенсированы.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    disabled={cancelLoading}
                    className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-[var(--color-text)]"
                  >
                    Оставить подписку
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {cancelLoading ? "Отмена..." : "Отменить"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Profile;