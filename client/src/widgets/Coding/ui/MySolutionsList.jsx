import React from 'react';

export const MySolutionsList = ({ mySolutions = [] }) => {
  if (!mySolutions || mySolutions.length === 0) {
    return <div className="text-center text-gray-400 py-8">У вас пока нет отправленных решений</div>;
  }

  const getPerfColor = (rating) => {
    if (rating === "Отлично") return "text-green-400";
    if (rating === "Хорошо") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">История решений</h3>
      {mySolutions.map((sub) => (
        <div key={sub._id} className="bg-[var(--bg-03)] p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'Решено' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>
              {sub.status}
            </span>
            <span className="text-gray-500 text-xs">{new Date(sub.createdAt).toLocaleString()}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-black/20 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Тесты</div>
              <div className="text-sm font-bold text-white">{sub.testResults?.percent || 0}%</div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Скорость</div>
              <div className={`text-sm font-bold ${getPerfColor(sub.performance?.rating)}`}>
                {sub.performance?.executionTimeMs || 0}мс
              </div>
            </div>
            <div className="bg-black/20 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Чистота</div>
              <div className={`text-sm font-bold ${sub.codeQuality?.score >= 80 ? 'text-green-400' : sub.codeQuality?.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {sub.codeQuality?.score || 0}/100
              </div>
            </div>
          </div>

          {sub.codeQuality?.issues?.length > 0 && (
            <div className="mb-3 text-xs space-y-1">
              {sub.codeQuality.issues.map((issue, i) => (
                <div key={i} className="text-yellow-500 flex items-start gap-1">
                  <span>⚠️</span> <span>{issue}</span>
                </div>
              ))}
            </div>
          )}

          <details className="group">
            <summary className="cursor-pointer text-gray-300 text-sm hover:text-white flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Посмотреть код
            </summary>
            <pre className="mt-2 bg-black/30 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap text-gray-300 font-mono">
              {sub.code}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
};