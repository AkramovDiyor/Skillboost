import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ResultsPanel } from './CodingResultsPanel';

const languageMap = {
  'JS': 'javascript',
  'JavaScript': 'javascript',
  'GO': 'go',
  'C': 'c',
  'C++': 'cpp',
  'Python': 'python',
  'SQL': 'sql',
  'Java': 'java',
  'TypeScript': 'typescript',
  'TS': 'typescript',
};

export const CodingEditorPanel = ({
  code,
  onCodeChange,
  results,
  isRunning,
  bottomTab,
  onBottomTabChange,
  testCases,
  Language 
}) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const handleThemeChange = (event) => {
      setTheme(event.detail);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  const primaryLanguage = Language?.[0];
  const monacoLanguage = languageMap[primaryLanguage] || primaryLanguage?.toLowerCase() || 'javascript';
  const displayLanguage = Language?.join(', ') || primaryLanguage;

  return (
    // 🔧 Ключевое: min-h-0 позволяет flex-детям сжиматься
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      
      {/* Editor Header */}
      <div className="border-b border-gray-700 px-3 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">{displayLanguage}</span>
        </div>
      </div>

      {/* Monaco Editor */}
      {/* 🔧 flex-1 + min-h-0 + h-0 позволяет редактору занимать доступное место */}
      <div className="flex-1 min-h-[120px] sm:flex-none sm:h-[60%]">
        <Editor
          defaultLanguage={monacoLanguage}
          language={monacoLanguage}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          theme={theme === 'dark' ? "vs-dark" : "light"}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true, // 🔧 Важно: авто-ресайз при изменении контейнера
            padding: { top: 12 },
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            matchBrackets: 'always',
            tabSize: 2,
            wordWrap: 'on',
            // 🔧 Оптимизация для мобильных
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* Bottom Panel - адаптивная высота */}
      <div className="flex-shrink-0 border-t border-gray-700 flex flex-col 
                      h-90 sm:h-56 md:h-[350px]">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 flex-shrink-0">
          <button
            onClick={() => onBottomTabChange('result')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex-1 ${
              bottomTab === 'result'
                ? 'border-[var(--color-main)] text-[var(--color-main)]'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Результат
          </button>
          <button
            onClick={() => onBottomTabChange('testcases')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex-1 ${
              bottomTab === 'testcases'
                ? 'border-[var(--color-main)] text-[var(--color-main)]'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Тесты
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto min-h-[42px]">
          {bottomTab === 'result' ? (
            <ResultsPanel results={results} isRunning={isRunning} />
          ) : (
            <div className="p-3 space-y-3">
              <p className="text-gray-400 text-xs">Тесты:</p>
              {testCases.map((test, idx) => (
                <div key={idx} className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-xs">
                  <div className="text-gray-400 truncate">
                    Вход: [{test.input.map(JSON.stringify).join(', ')}]
                  </div>
                  <div className="text-yellow-400 truncate">
                    Ожидается: {JSON.stringify(test.expected)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};