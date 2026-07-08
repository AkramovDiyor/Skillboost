import React from 'react';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CodingTaskCard = ({ task, isLocked = false }) => {
  const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
      case 'Легкая':
        return {
          bg: 'bg-[#132C33]',
          text: 'text-[#2CC36B]',
          dot: 'bg-[#2CC36B]',
        };
      case 'Средняя':
        return {
          bg: 'bg-[#3F2B26]',
          text: 'text-[#FE8901]',
          dot: 'bg-[#FE8901]',
        };
      case 'Сложная':
        return {
          bg: 'bg-[#311C30]',
          text: 'text-[#F05D5B]',
          dot: 'bg-[#F05D5B]',
        };
      default:
        return {
          dot: 'bg-gray-400',
          text: 'text-gray-400',
        };
    }
  };

  const styles = getDifficultyStyles(task.difficulty);

  return (
    <div
      className={`relative rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors ${
        isLocked ? 'cursor-not-allowed' : ''
      }`}
    >

      {isLocked && (
        <div className="p-0 absolute inset-0 bg-[var(--bg-03)]/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <FaLock className="text-3xl text-[var(--tag-red-border)]" />
          <p className="text-lg font-medium text-[var(--tag-red-border)]">
            Вопрос доступен <Link to={'/subscription'} className="underline">по подписке</Link> 
          </p>
        </div>
      </div>
      )}

      <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">
        {task.title}
      </h3>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">

        <div className={`flex items-center gap-1.5 ${styles.bg} p-1 px-2 rounded-xl sm:rounded-2xl`}>
          <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${styles.dot}`}></span>
          <span className={`text-[10px] sm:text-sm font-medium ${styles.text}`}>
            {task.difficulty}
          </span>
        </div>


        <div className="flex items-center gap-2 text-[10px] sm:text-sm text-gray-400">
          <span className="bg-[var(--bg-03)] rounded-xl sm:rounded-2xl p-1 px-2 truncate max-w-[120px] sm:max-w-none">
            {task.companies.join(', ')}
          </span>
          <span className="bg-[var(--bg-03)] rounded-xl sm:rounded-2xl p-1 px-2 shrink-0">
            {task.solvedPercent}%
          </span>
        </div>

     
        <div className="flex items-center gap-1.5">
          {task.languages.map((lang) => (
            <span
              key={lang}
              className="bg-gray-700 text-gray-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-2xl text-[10px] sm:text-xs font-medium"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodingTaskCard;