import React, { useState, useMemo, useRef, useEffect } from 'react';
import { allCompanies, tasksData } from '../../shared/data/codingData';
import LanguageSelect from '../../widgets/Coding/CodingLanguageSelect';
import CodingTaskCard from '../../entities/CodingTaskCard';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../shared/hooks/useSubscription'; 

export default function Coding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [activeCompany, setActiveCompany] = useState(null);
  const [maxHeight, setMaxHeight] = useState('60px');
  const contentRef = useRef(null);

 
  const { subscription, loading } = useSubscription();
  const hasAccess = subscription?.isActive;

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setMaxHeight(showAllCompanies ? `${scrollHeight}px` : '60px');
    }
  }, [showAllCompanies]);

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    let tasks = tasksData;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(q)
      );
    }

    if (selectedLanguage !== 'all') {
      tasks = tasks.filter((t) => t.languages.includes(selectedLanguage));
    }

    if (activeCompany) {
      tasks = tasks.filter(
        (t) =>
          t.companies.includes(activeCompany) ||
          (t.extraCompanies > 0 && t.companies[0] === activeCompany)
      );
    }

    return tasks;
  }, [searchQuery, selectedLanguage, activeCompany]);

  const handleCompanyClick = (companyName) => {
    if (activeCompany === companyName) {
      setActiveCompany(null);
    } else {
      setActiveCompany(companyName);
    }
  };

  return (
    <div className="min-h-screen text-[var(--color-text)]">
      <h1 className="text-3xl font-bold mb-8">Задачи на код</h1>

      <section className="mb-3">
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: maxHeight }}
        >
          <div ref={contentRef} className="flex gap-2 flex-wrap pb-2">
            {allCompanies.map((spec) => (
              <button
                key={spec.name}
                onClick={() => handleCompanyClick(spec.name)}
                className={`${
                  spec.name === activeCompany
                    ? 'bg-[var(--bg-04)] text-[var(--bg-02)]'
                    : ''
                } py-[5px] flex items-center rounded-full px-3 text-center border hover:shadow transition-all duration-300`}
              >
                {spec.icon && (
                  <span className="flex mr-1 bg-gray-100 rounded-full p-1 min-w-6 min-h-6 items-center justify-around">
                    <img src={spec.icon} alt={spec.name} width="16" height="16" />
                  </span>
                )}
                {spec.name}
                <span className="text-xs text-gray-500 ml-3 px-1.5 py-[1px] bg-gray-100 rounded-full transition-colors">
                  {spec.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAllCompanies(!showAllCompanies)}
          className="flex items-center justify-center gap-3 mt-4 w-fit mx-auto hover:scale-105 transition-transform duration-300"
        >
          <span className="transition-all duration-300">
            {showAllCompanies ? 'Свернуть' : 'Развернуть'}
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
      </section>

      {/* Поля ввода */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2 text-[var(--color-text)]">
        <input
          type="text"
          placeholder="Введите название задания"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-700 rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <LanguageSelect
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        />
      </div>

      {/* Сетка задач */}
      {filteredTasks.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {filteredTasks.map((task) => {
            const isPremiumLocked = task.isPremium && !hasAccess;


            if (isPremiumLocked) {
              return <CodingTaskCard key={task.id} task={task} isLocked />;
            }

            return (
              <Link to={`/coding/${task.id}`} key={task.id}>
                <CodingTaskCard task={task} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}