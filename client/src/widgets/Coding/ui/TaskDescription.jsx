import React from 'react';
import { TaskTags } from './CodingTaskTags'; // Если у тебя он в widgets, поправь путь

export const TaskDescription = ({ taskData }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{taskData.title}</h2>
      <button className="text-gray-400 hover:text-gray-300">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </div>

    <TaskTags
      difficulty={taskData.difficulty}
      status="Не решено"
      companies={taskData.companies}
      extraCompanies={taskData.extraCompanies || 0}
      solvedPercent={taskData.solvedPercent || 0}
      languages={taskData.languages}
    />

    <div className="space-y-3">
      {taskData.description?.map((p, idx) => <p key={idx}>{p}</p>)}
      {taskData.requirements && (
        <div className="mt-4 space-y-2">{taskData.requirements.map((item, idx) => <p key={idx}>{item}</p>)}</div>
      )}
      {taskData.examples?.map((example, idx) => (
        <div key={idx} className="mt-4 space-y-3">
          <h3 className="font-semibold">Пример {idx + 1}:</h3>
          <div>
            <p className="text-gray-400 mb-2">Ввод:</p>
            <div className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-sm whitespace-pre overflow-x-auto">{example.input}</div>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Вывод:</p>
            <div className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-sm">{example.output}</div>
          </div>
          {example.explanation && (
            <div className="text-gray-500 text-xs space-y-1">{example.explanation.map((line, i) => <div key={i}>{line}</div>)}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);