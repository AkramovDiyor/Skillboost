import React, { useState } from 'react';
import { TaskDescription } from './TaskDescription';
import { MySolutionsList } from './MySolutionsList';

export const CodingTaskPanel = ({ taskData, mySolutions }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="w-1/3 min-w-[360px] lg:min-w-[400px] border-r border-gray-700 flex flex-col overflow-hidden">
      <div className="flex border-b border-gray-700 flex-shrink-0">
        {[
          { key: 'description', label: 'Описание' },
          { key: 'my-solutions', label: 'Решения' },
          { key: 'solutions', label: 'Обсуждения' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'description' && <TaskDescription taskData={taskData} />}
        {activeTab === 'my-solutions' && <MySolutionsList mySolutions={mySolutions} />}
        {activeTab === 'solutions' && <div className="text-center text-gray-400 py-8">Решения других пользователей</div>}
      </div>
    </div>
  );
};