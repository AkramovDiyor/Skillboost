import React from 'react';

export const CodingHeader = ({ title, isMobile, isRunning, isSubmitting, onRun, onSubmit }) => {
  return (
    <header className="px-2 sm:px-4 py-2 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <h1 className="text-[13px] sm:text-lg font-semibold truncate">
          {isMobile ? title : 'Coding Challenge'}
        </h1>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isRunning || isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isRunning ? '⏳' : '▶'} <span className="hidden sm:inline">Запустить</span>
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            className={`px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${isSubmitting || isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? '⏳' : (isMobile ? '✓' : 'Отправить')}
            {!isMobile && isSubmitting && '...'}
          </button>
        </div>
      </div>
    </header>
  );
};