import { useState, useEffect, useCallback } from "react";
import { IoMdBookmark } from "react-icons/io";
import { BsBookmark } from "react-icons/bs";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getQuestions, extractQuestions } from "../../shared/api/questions";
import { bookmarksApi } from "../../shared/api/bookmarks"; 

const Interview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const category = searchParams.get("category");
  const technologies = searchParams.get("technologies");
  const frameworks = searchParams.get("frameworks");
  const level = searchParams.get("level");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  

  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(true);

  const [stats, setStats] = useState({ know: 0, dontKnow: 0, questions: []});
  const [knowQuestions, setKnowQuestions] = useState([]);
  const [dontKnowQuestions, setDontKnowQuestions] = useState([]);


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


  const currentQuestion = questions[currentIndex];
  const isBookmarked = currentQuestion
    ? bookmarks.includes(currentQuestion._id)
    : false;

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getQuestions({
        category,
        technologies,
        frameworks,
        level,
      });

      const extracted = extractQuestions(response);

      if (extracted.length === 0) {
        setError(response?.message || "Нет вопросов по заданным фильтрам");
        setQuestions([]);
        return;
      }

      setQuestions(extracted);
      setCurrentIndex(0);
      setStats({ know: 0, dontKnow: 0 });
      setKnowQuestions([]);
      setDontKnowQuestions([]);
    } catch (err) {
      console.error("Ошибка загрузки вопросов", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Ошибка загрузки вопросов"
      );
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [category, technologies, frameworks, level]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = ({ know, question }) => {
    const questionStatus = {
      id: question._id || question.id,
      question: question,
      stats: know ? "know" : "dontKnow",
    };

    const updatedStats = {
      know: know ? stats.know + 1 : stats.know,
      dontKnow: !know ? stats.dontKnow + 1 : stats.dontKnow,
      questions: [...(stats.questions || []), questionStatus],
    };

    if (know) {
      setKnowQuestions((prev) => [...prev, question]);
    } else {
      setDontKnowQuestions((prev) => [...prev, question]);
    }

    setStats(updatedStats);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      localStorage.setItem("stats", JSON.stringify(updatedStats));
      localStorage.setItem(
        "know",
        JSON.stringify([...knowQuestions, know ? question : null].filter(Boolean))
      );
      localStorage.setItem(
        "dontKnow",
        JSON.stringify([...dontKnowQuestions, !know ? question : null].filter(Boolean))
      );
      navigate("/results");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-[var(--color-text)]">Загрузка вопросов...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Вопросы не найдены
          </h2>
          <p className="text-[var(--color-text)] mb-6">
            {error || "По заданным фильтрам нет вопросов"}
          </p>
          <button
            onClick={() => navigate("/startInterview")}
            className="bg-[var(--color-main)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            ← Вернуться к выбору фильтров
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[var(--color-text)]">Что-то пошло не так</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-full max-w-2xl px-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Вопрос {currentIndex + 1} из {questions.length}
          </h2>
          <button
            onClick={() => toggleBookmark(currentQuestion)}
            disabled={bookmarksLoading}
            aria-label="Добавить в избранное"
            className="relative flex items-center justify-center disabled:opacity-50"
          >
            {isBookmarked ? (
              <IoMdBookmark className="text-[20px] cursor-pointer text-[var(--color-main)]" />
            ) : (
              <BsBookmark className="text-[20px] cursor-pointer text-[var(--color-text)]" />
            )}
          </button>
        </div>

        <p className="mb-2 text-[var(--color-text)]">
          {currentQuestion.title || currentQuestion.question}
        </p>

        <div className="flex items-center cursor-pointer mb-2 gap-2">
          <button
            className="text-[#94A3B8]"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Скрыть ответ" : "Показать ответ"}
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`fill-st-black dark:fill-white icon mt-1 transition-transform duration-300 ${
              showAnswer ? "rotate-180" : ""
            }`}
            width="13"
            height="8"
            viewBox="0 0 13 8"
          >
            <path d="M6.5 7.4L0.5 1.4L1.9 0L6.5 4.6L11.1 0L12.5 1.4L6.5 7.4Z" />
          </svg>
        </div>

        {showAnswer && (
          <div className="answer-box">
            <p className="text-[var(--color-text)]">
              <strong>Ответ:</strong> {currentQuestion.answer}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6">
          <button
            className="text-[var(--color-text)] flex items-center gap-2 border-2 border-[var(--color-text)] rounded-lg px-2 py-1 cursor-pointer hover:border-[var(--color-main)] hover:text-[var(--color-main)] duration-300"
            onClick={() => handleAnswer({ know: true, question: currentQuestion })}
          >
            <AiFillLike className="btn-icon" />
            Знаю
          </button>
          <button
            className="text-[var(--color-text)] flex items-center gap-2 border-2 border-[var(--color-text)] rounded-lg px-2 py-1 cursor-pointer hover:border-[#ff0000] hover:text-[red] duration-300"
            onClick={() => handleAnswer({ know: false, question: currentQuestion })}
          >
            <AiFillDislike className="btn-icon" />
            Не знаю
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interview;