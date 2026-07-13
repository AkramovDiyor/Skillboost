import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { questionsApi } from "../../shared/api/questions";
import { bookmarksApi } from "../../shared/api/bookmarks";
import { IoMdBookmark } from "react-icons/io";
import { BsBookmark } from "react-icons/bs";
import { FaLock } from "react-icons/fa"; 
import { SkeletonCard } from "../../shared/ui/Skeleton/SkeletonCard";
import { useSubscription } from "../../shared/hooks/useSubscription";

function QuestionsPage() {
  const { tech } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const [questions, setQuestions] = useState([]);
  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);
  const [bookmarks, setBookmarks] = useState([]); 
  const [bookmarksLoading, setBookmarksLoading] = useState(true); 
  
  const {subscription, loading: subscriptionLoading} = useSubscription()
  const hasAccess = subscription.isActive

  const [difficulty, setDifficulty] = useState(params.get("difficulty") || null);
  const difficultyLevels = ["Стажёр", "Junior", "Middle", "Senior"];

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setBookmarksLoading(true);
        const data = await bookmarksApi.getAll();
        setBookmarks(data.map(q => q._id));
      } catch (error) {
        console.error("Ошибка при получении закладок:", error);
        setBookmarks([]);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const toggleBookmark = async (question) => {
    const questionId = question._id;
    const wasBookmarked = bookmarks.includes(questionId);

    if (wasBookmarked) {
      setBookmarks(bookmarks.filter(id => id !== questionId));
    } else {
      setBookmarks([...bookmarks, questionId]);
    }

    try {
      const response = await bookmarksApi.toggle(questionId);
      
      if (response.isBookmarked !== !wasBookmarked) {
        setBookmarks(response.isBookmarked 
          ? [...bookmarks, questionId]
          : bookmarks.filter(id => id !== questionId)
        );
      }
    } catch (error) {
      console.error("Ошибка при обновлении закладки:", error);

      if (wasBookmarked) {
        setBookmarks([...bookmarks, questionId]);
      } else {
        setBookmarks(bookmarks.filter(id => id !== questionId));
      }
      
      alert("Не удалось обновить закладку. Попробуйте ещё раз.");
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ tech });
      if (difficulty) query.set("difficulty", difficulty);
      const { data } = await questionsApi.getByTech(query);
      setQuestions(data);
    } catch (error) {
      console.error("Ошибка при получении вопросов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [tech, difficulty]);

  const handleDifficultyClick = (level) => {
    setDifficulty(level);
    navigate(`?difficulty=${encodeURIComponent(level)}`);
  };

  const isBookmarked = (questionId) => {
    return bookmarks.includes(questionId);
  };

  return (
    <div className="text-[var(--color-text)]">
      <Link to={"/baza_voprosov"} className="truncate">
        <button className="flex items-center gap-1 text-sm text-st-gray-60 cursor-pointer mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            className="iconify iconify--st-icons"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            style={{ fontSize: "16px" }}
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 6l-6 6l6 6"
            ></path>
          </svg>
          Вернуться к базе вопросов
        </button>
      </Link>

      <div>
        <h1 className="lg:text-5xl text-3xl font-bold mb-4">
          ТОП вопросов по {tech}
        </h1>
        <div className="text-xl">
          Подборка самых частых вопросов на собеседованиях {tech} разработчикам
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <p className="text-md font-medium">Выберите грейд</p>
        <div className="flex items-center gap-2 flex-wrap">
          {difficultyLevels.map((level) => (
            <div 
              key={level}
              onClick={() => handleDifficultyClick(level)} 
              className="rounded-2xl p-1 px-3 text-md bg-[var(--bg-03)] cursor-pointer hover:bg-[var(--bg-02)] flex gap-1 items-center transition-colors"
            >
              <span>{level}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="relative w-full my-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          className="absolute top-2 left-2 iconify iconify--ic"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          style={{ fontSize: "32px" }}
        >
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"
          ></path>
        </svg>
        <input
          type="text"
          className="p-inputtext p-component !px-10 w-full border border-[var(--color-border)] rounded-lg bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          placeholder="Введите название или содержание вопроса"
        />
      </section>

      <div>
        <h2 className="text-2xl font-bold mb-4">Вопросы</h2>
         
        {loading && (
          <>
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        )}

        {!loading && questions.length === 0 && (
          <p>Вопросов по выбранным фильтрам не найдено</p>
        )}

        {!loading && questions.map((question, index) => {
          const isPremium = question.isPremium === true; // 👈 Проверяем isPremium
          
          return (
            <section 
              key={question._id} 
              className="scroll-my-[75px] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-surface-500 w-full py-2 px-4 rounded-2xl my-4 relative"
            >
              <section className="relative w-full">
                <section className="flex flex-col gap-3 pt-4 pb-2">
                  <section className="flex flex-col gap-2 text-sm">
                    <header className="text-xl font-medium flex gap-2 items-center">
                      <span className="min-w-[10px] min-h-[10px] inline-block rounded-full bg-gray-300"></span>
                      <section className="flex items-center gap-2 relative support-selectable">
                        <section>
                          <h2 className="font-normal">{question.title}</h2>
                        </section>
                      </section>
                      <section className="relative inline-flex ml-auto">
                        <button
                          onClick={() => toggleBookmark(question)}
                          disabled={bookmarksLoading}
                          aria-label="Добавить в избранное"
                          className="relative flex items-center justify-center disabled:opacity-50"
                        >
                          {isBookmarked(question._id) ? (
                            <IoMdBookmark className="text-[20px] cursor-pointer text-[var(--color-main)]" />
                          ) : (
                            <BsBookmark className="text-[20px] cursor-pointer text-[var(--color-text)]" />
                          )}
                        </button>
                      </section>
                    </header>

                    <div className="rounded-2xl p-0.5 px-3 w-fit font-medium text-base bg-[var(--bg-02)]">
                      {question.difficulty}
                    </div>
                    <div>
                      Рейтинг вопроса:
                      <span className="font-medium">{question.rating}</span>
                    </div>
                  </section>

                  {visibleAnswerIndex === index ? (
                    <div className="answer-box">
                      <p>
                        <strong>Ответ:</strong> {question.answer}
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
                      className={`flex gap-1 items-center text-slate-500 dark:text-slate-400 hover:underline hover:decoration-1 hover:decoration-slate-300 hover:underline-offset-4 `}
                      onClick={() =>  setVisibleAnswerIndex(index)}
      
                    >
                      Показать ответ
                    </button>
                  )}
                </section>

              </section>
                {/* 👇 Премиум оверлей */}
                {isPremium && !hasAccess && (
                  <div className="p-0 absolute inset-0 bg-[var(--bg-03)]/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3 text-center px-4">
                      <FaLock className="text-3xl text-[var(--tag-red-border)]" />
                      <p className="text-lg font-medium text-[var(--tag-red-border)]">
                        Вопрос доступен <Link to={'/subscription'} className="underline">по подписке</Link> 
                      </p>
                    </div>
                  </div>
                )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionsPage;