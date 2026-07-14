import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../shared/hooks/useSubscription';
import { codingApi } from '../../shared/api/coding'; 
import LanguageSelect from '../../widgets/Coding/CodingLanguageSelect';
import CodingTaskCard from '../../entities/CodingTaskCard';
import { baseCompanies } from '../../shared/data/codingData'; // 👈 Используем только базовый список имен

export default function Coding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [activeCompany, setActiveCompany] = useState(null);
  const [maxHeight, setMaxHeight] = useState('60px');
  const contentRef = useRef(null);

  // Состояния для данных с сервера
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { subscription } = useSubscription();
  const hasAccess = subscription?.isActive;

  // 1. Загружаем список задач при монтировании
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await codingApi.getTasksList();
        setTasks(data);
      } catch (error) {
        console.error("Ошибка загрузки списка задач:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Анимация раскрытия списка компаний
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setMaxHeight(showAllCompanies ? `${scrollHeight}px` : '60px');
    }
  }, [showAllCompanies]);

  // 2. 👇 Динамический подсчет на основе baseCompanies и загруженных задач
  const companiesWithCounts = useMemo(() => {
    return baseCompanies
      .map(company => {
        // Считаем, сколько задач содержит эту компанию из загруженных с сервера
        const count = tasks.filter(t => t.companies.includes(company.name)).length;
        return {
          name: company.name,
          count: count
        };
      })

      .sort((a, b) => b.count - a.count); // Сортируем по популярности (от большего к меньшему)
  }, [tasks]);

  // 3. Фильтрация задач
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (selectedLanguage !== 'all') {
      result = result.filter((t) => t.languages.includes(selectedLanguage));
    }

    if (activeCompany) {
      result = result.filter((t) => t.companies.includes(activeCompany));
    }

    return result;
  }, [tasks, searchQuery, selectedLanguage, activeCompany]);

  const handleCompanyClick = (companyName) => {
    if (activeCompany === companyName) {
      setActiveCompany(null); // Сброс фильтра при повторном клике
    } else {
      setActiveCompany(companyName);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Загрузка задач...</div>;
  }

  return (
    <div className="min-h-screen text-[var(--color-text)]">
      <h1 className="text-3xl font-bold mb-8">Задачи на код</h1>

      <section className="mb-3">
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: maxHeight }}
        >
          <div ref={contentRef} className="flex gap-2 flex-wrap pb-2">
            {companiesWithCounts.map((spec) => (
              <button
                key={spec.name}
                onClick={() => handleCompanyClick(spec.name)}
                className={`${
                  spec.name === activeCompany
                    ? 'bg-[var(--color-main)] text-white' 
                    : 'bg-[var(--bg-03)] hover:bg-[var(--bg-02)] text-[var(--color-text)]'
                } py-[5px] flex items-center rounded-full px-3 text-center border border-gray-700 hover:shadow transition-all duration-300`}
              >
                {spec.name}
                <span className={`text-xs ml-2 px-1.5 py-[1px] rounded-full transition-colors ${
                   spec.name === activeCompany ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {spec.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {companiesWithCounts.length > 5 && (
          <button
            onClick={() => setShowAllCompanies(!showAllCompanies)}
            className="flex items-center justify-center gap-3 mt-4 w-fit mx-auto hover:scale-105 transition-transform duration-300 text-sm text-gray-400 hover:text-[var(--color-text)]"
          >
            <span className="transition-all duration-300">
              {showAllCompanies ? 'Свернуть' : 'Развернуть все компании'}
            </span>
            <svg
              width="14"
              height="15.08"
              viewBox="0 0 13 14"
              className="transition-transform duration-500 ease-in-out"
              style={{
                transform: showAllCompanies ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <g fill="none">
                <path
                  d="M6.5 14.0016L0.5 8.00156L1.9 6.60156L6.5 11.1766L11.1 6.60156L12.5 8.00156L6.5 14.0016ZM6.5 8.00156L0.5 2.00156L1.9 0.601562L6.5 5.17656L11.1 0.601562L12.5 2.00156L6.5 8.00156Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
        )}
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 text-[var(--color-text)]">
        <input
          type="text"
          placeholder="Введите название задания"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-700 rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent transition-all"
        />
        <LanguageSelect
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {filteredTasks.map((task) => {
            const isPremiumLocked = task.isPremium && !hasAccess;

            if (isPremiumLocked) {
              return <CodingTaskCard key={task.taskId} task={task} isLocked />;
            }

            return (
              <Link to={`/coding/${task.taskId}`} key={task.taskId}>
                <CodingTaskCard task={task} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20 py-10 rounded-xl">
          <p className="text-lg">Ничего не найдено </p>
          <p className="text-sm mt-2">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      )}
    </div>
  );
}