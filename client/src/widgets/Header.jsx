import { Link, useLocation } from "react-router-dom";
import ThemeSwitcher from "../features/ThemeSwitcher";
import { useEffect, useRef, useState } from "react";
import { IoIosContact } from "react-icons/io";
import { linkList, interview, learning } from "../shared/data/headerData";
import PremiumLink from "../shared/ui/PremiumLink";


const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const storedRaw = localStorage.getItem("data");
  const storedData = storedRaw ? JSON.parse(storedRaw) : null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  
  const [menuAnimation, setMenuAnimation] = useState(false);

  const interviewDropdownRef = useRef(null);
  const learningDropdownRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      requestAnimationFrame(() => {
        setMenuAnimation(true);
      });
      document.body.style.overflow = 'hidden';
    } else {
      setMenuAnimation(false);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (interviewDropdownRef.current && !interviewDropdownRef.current.contains(event.target)) {
        setIsInterviewOpen(false);
      }
      if (learningDropdownRef.current && !learningDropdownRef.current.contains(event.target)) {
        setIsLearningOpen(false);
      }
    };

    if (isInterviewOpen || isLearningOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInterviewOpen, isLearningOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsInterviewOpen(false);
      setIsLearningOpen(false);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <section className="top-0 z-50 w-full">
        <nav className="flex items-center justify-between min-h-[60px]">
          {/* Логотип */}
          <section className="text-2xl font-semibold">
            <Link to="/" className="text-[var(--color-text)]">
              Skillboost
            </Link>
          </section>

          {/* Бургер-меню (мобилка) */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-[var(--color-text)] hover:bg-[var(--bg-02)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-main)] relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Навигация — desktop */}
          <article className="hidden lg:flex gap-3 items-center">
            <section className="top-0 z-50">
              <nav className="flex flex-row items-center justify-between p-2 min-h-[60px]">
                <article className="hidden lg:flex gap-3 items-center">
                  {/* Дропдаун "Вопросы с собеседований" */}
                  <div className="group relative">
                    <button
                      className={`px-3 cursor-pointer inline-flex items-center gap-1.5 py-2 rounded-lg
                        hover:text-[var(--color-main)] hover:bg-[var(--bg-03)] 
                        ${["/baza_voprosov", "/startInterview"].includes(currentPath)
                          ? "text-[#09B87E] bg-[var(--bg-02)]"
                          : "text-[var(--color-text)]"
                        }`}
                      onClick={() => setIsInterviewOpen(!isInterviewOpen)}
                    >
                      Вопросы с собеседований
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`icon mt-1 transition-transform duration-300 ${isInterviewOpen ? "rotate-180" : ""}`}
                        width="13"
                        height="8"
                        viewBox="0 0 13 8"
                      >
                        <path
                          d="M6.5 7.4L0.5 1.4L1.9 0L6.5 4.6L11.1 0L12.5 1.4L6.5 7.4Z"
                          fill="var(--color-text)"
                        />
                      </svg>
                    </button>

                    <div
                      ref={interviewDropdownRef}
                      className={`absolute top-12 left-0 w-full min-w-[200px] bg-[var(--bg-03)] border border-[#262840] shadow-lg rounded-xl py-2 z-50 transition-all duration-200 ease-out ${
                        isInterviewOpen
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible pointer-events-none"
                      }`}
                    >
                      <ul className="flex flex-col">
                        {interview.map(({ name, path }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setIsInterviewOpen(false)}
                            className={
                              path === currentPath
                                ? "text-[#09B87E] block font-normal px-4 py-2.5 hover:bg-[var(--bg-02)] transition-colors"
                                : "px-4 py-2.5 text-[var(--color-text)] hover:bg-[var(--bg-02)] rounded"
                            }
                          >
                            {name}
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to="/coding"
                    className={`px-3 cursor-pointer inline-flex items-center gap-1.5 py-2 rounded-lg
                      hover:text-[var(--color-main)] hover:bg-[var(--bg-03)]
                      ${currentPath === "/coding"
                        ? "text-[#09B87E] bg-[var(--bg-02)]"
                        : "text-[var(--color-text)]"
                      }`}
                  >
                    Лайв кодинг
                  </Link>

                  {/* Дропдаун "Обучение" */}
                  <div className="group relative">
                    <button
                      className={`px-3 cursor-pointer inline-flex items-center gap-1.5 py-2 rounded-lg
                        hover:text-[var(--color-main)] hover:bg-[var(--bg-03)] 
                        ${["/roadmaps", "/test-tasks"].includes(currentPath)
                          ? "text-[#09B87E] bg-[var(--bg-02)]"
                          : "text-[var(--color-text)]"
                        }`}
                      onClick={() => setIsLearningOpen(!isLearningOpen)}
                    >
                      Обучение
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`icon mt-1 transition-transform duration-300 ${isLearningOpen ? "rotate-180" : ""}`}
                        width="13"
                        height="8"
                        viewBox="0 0 13 8"
                      >
                        <path
                          d="M6.5 7.4L0.5 1.4L1.9 0L6.5 4.6L11.1 0L12.5 1.4L6.5 7.4Z"
                          fill="var(--color-text)"
                        />
                      </svg>
                    </button>

                    <div
                      ref={learningDropdownRef}
                      className={`absolute top-12 left-0 w-full min-w-[200px] bg-[var(--bg-03)] border border-[#262840] shadow-lg rounded-xl py-2 z-50 transition-all duration-200 ease-out ${
                        isLearningOpen
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible pointer-events-none"
                      }`}
                    >
                      <ul className="flex flex-col">
                        {learning.map(({ name, path }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setIsLearningOpen(false)}
                            className={
                              path === currentPath
                                ? "text-[#09B87E] block font-normal px-4 py-2.5 hover:bg-[var(--bg-02)] transition-colors"
                                : "px-4 py-2.5 text-[var(--color-text)] hover:bg-[var(--bg-02)] rounded"
                            }
                          >
                            {name}
                          </Link>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </nav>
            </section>
          </article>

          <div
            className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              mobileMenuOpen && menuAnimation
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Меню */}
          <div
            className={`lg:hidden fixed top-0 right-0 w-full max-w-[320px] h-[100vh] bg-[var(--bg-03)] shadow-xl z-40 transition-transform duration-300 ease-out ${
              mobileMenuOpen && menuAnimation
                ? 'translate-x-0'
                : 'translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-lg font-semibold text-[var(--color-text)]">Меню</span>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-64px)]">
              <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                {storedData ? (
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    to="/profile"
                    className="flex items-center gap-3"
                  >
                    <IoIosContact style={{ color: 'var(--color-text)' }} className="w-10 h-10" />
                    <span className="text-[var(--color-text)]">Профиль</span>
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium rounded-lg px-5 py-[9px] text-center text-white bg-black hover:text-white dark:bg-white dark:text-black"
                  >
                    Войти
                  </Link>
                )}
                <ThemeSwitcher />
              </div>


              <PremiumLink 
                onClick={() => setMobileMenuOpen(false)} 
                className="px-3 py-2 rounded-lg hover:bg-[var(--bg-02)]" 
              />

              <div className="border-t border-gray-700 my-2" />

              {linkList.map(({ name, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    currentPath === path
                      ? "text-[#09B87E] bg-[var(--bg-02)] font-medium"
                      : "text-[var(--color-text)] hover:bg-[var(--bg-02)]"
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Справа — только для десктопа */}
          <section className="hidden lg:flex items-center gap-3">
            {/* 👇 ЗАМЕНА: Используем PremiumLink вместо старого кода */}
            <PremiumLink />
            
            {storedData ? (
              <Link to="/profile">
                <IoIosContact style={{ color: 'var(--color-text)' }} className="w-10 h-10" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="font-medium rounded-lg px-5 py-[9px] text-center text-white bg-black hover:text-white dark:bg-white dark:text-black dark:border dark:hover:text-black"
              >
                Войти
              </Link>
            )}

            <ThemeSwitcher />
          </section>
        </nav>
      </section>
    </>
  );
};

export default Header;