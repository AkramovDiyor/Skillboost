import React, { useState, useRef, useEffect } from 'react';
import { workerCode } from '../../shared/data/codingTaskData'; // Worker остается локальным
import { TaskTags } from '../../widgets/Coding/CodingTaskTags';
import { CodingEditorPanel } from '../../widgets/Coding/CodingEditorPanel';
import { Link, useParams } from 'react-router-dom';
import { codingApi } from '../../shared/api/coding'; // 👈 Добавили API

export const CodingPage = () => {
  const { id } = useParams();

  const [taskData, setTaskData] = useState(null); // 👇 Теперь это объект из API, а не поиск в массиве
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [bottomTab, setBottomTab] = useState('result');
  const [mobileView, setMobileView] = useState('description');

  const workerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 👇 Загружаем конкретную задачу с сервера при изменении id в URL
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await codingApi.getTaskById(id);
        setTaskData(data);
        setCode(data.starterCode); // Устанавливаем стартовый код из БД
      } catch (error) {
        console.error("Ошибка загрузки задачи:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleRun = () => {
    if (isRunning || !taskData) return;

    setIsRunning(true);
    setResults(null);
    setBottomTab('result');
    if (isMobile) setMobileView('editor');

    if (workerRef.current) workerRef.current.terminate();

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    workerRef.current = worker;

    const timeout = setTimeout(() => {
      worker.terminate();
      workerRef.current = null;
      setIsRunning(false);
      setResults({
        success: false,
        error: 'Превышено время выполнения (10 секунд). Возможно, бесконечный цикл.',
      });
      URL.revokeObjectURL(workerUrl);
    }, 10000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      setResults(e.data);
      setIsRunning(false);
      worker.terminate();
      workerRef.current = null;
      URL.revokeObjectURL(workerUrl);
    };

    worker.onerror = (error) => {
      clearTimeout(timeout);
      setResults({
        success: false,
        error: error.message || 'Неизвестная ошибка в Worker',
      });
      setIsRunning(false);
      worker.terminate();
      workerRef.current = null;
      URL.revokeObjectURL(workerUrl);
    };

    worker.postMessage({
      userCode: code,
      testCases: taskData.testCases, // 👈 Берем тесты из загруженной задачи
    });
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Загрузка задачи...</div>;
  }

  if (!taskData) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Задача не найдена</div>;
  }

  const TaskDescription = () => (
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
        status="Не решено" // Пока заглушка, позже можно подтянуть реальный статус из API
        companies={taskData.companies}
        extraCompanies={taskData.extraCompanies || 0}
        solvedPercent={taskData.solvedPercent || 0}
        languages={taskData.languages}
      />

      <div className="space-y-3">
        {taskData.description?.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
        {taskData.requirements && (
          <div className="mt-4 space-y-2">
            {taskData.requirements.map((item, idx) => <p key={idx}>{item}</p>)}
          </div>
        )}
        {taskData.examples?.map((example, idx) => (
          <div key={idx} className="mt-4 space-y-3">
            <h3 className="font-semibold">Пример {idx + 1}:</h3>
            <div>
              <p className="text-gray-400 mb-2">Ввод:</p>
              <div className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-sm whitespace-pre overflow-x-auto">
                {example.input}
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Вывод:</p>
              <div className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-sm">
                {example.output}
              </div>
            </div>
            {example.explanation && (
              <div className="text-gray-500 text-xs space-y-1">
                {example.explanation.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-[var(--color-text)] flex flex-col h-screen">
      <div className="sm:px-2 sm:pt-2 pb-1">
        <Link to="/coding" className="truncate">
          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style={{ fontSize: "16px" }}>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 6l-6 6l6 6" />
            </svg>
            Вернуться к списку задач
          </button>
        </Link>
      </div>

      <header className="px-2 sm:px-4 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-[13px] sm:text-lg font-semibold truncate">
              {isMobile ? taskData.title : 'Coding Challenge'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isRunning ? '⏳' : '▶'} <span className="hidden sm:inline">Запустить</span>
            </button>
            {/* Кнопка "Отправить" пока без логики сохранения, добавим её на следующем шаге */}
            <button className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md text-sm font-medium transition-colors whitespace-nowrap">
              <span className="hidden sm:inline">Отправить</span>
              <span className="sm:hidden">✓</span>
            </button>
          </div>
        </div>
      </header>

      {!isMobile && (
        <div className="flex-1 flex overflow-hidden">
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
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[var(--color-main)] text-[var(--color-main)]'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'description' && <TaskDescription />}
              {activeTab === 'my-solutions' && <div className="text-center text-gray-400 py-8">У вас пока нет решений</div>}
              {activeTab === 'solutions' && <div className="text-center text-gray-400 py-8">Решения других пользователей</div>}
            </div>
          </div>

          <CodingEditorPanel
            Language={taskData.languages}
            code={code}
            onCodeChange={setCode}
            results={results}
            isRunning={isRunning}
            bottomTab={bottomTab}
            onBottomTabChange={setBottomTab}
            testCases={taskData.testCases}
          />
        </div>
      )}

      {isMobile && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-700 flex-shrink-0">
            <button
              onClick={() => setMobileView('description')}
              className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors text-center ${
                mobileView === 'description' ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Описание
            </button>
            <button
              onClick={() => setMobileView('editor')}
              className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors text-center ${
                mobileView === 'editor' ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Редактор
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {mobileView === 'description' ? (
              <div className="h-full overflow-y-auto p-4"><TaskDescription /></div>
            ) : (
              <div className="h-full flex flex-col">
                <CodingEditorPanel
                  Language={taskData.languages}
                  code={code}
                  onCodeChange={setCode}
                  results={results}
                  isRunning={isRunning}
                  bottomTab={bottomTab}
                  onBottomTabChange={setBottomTab}
                  testCases={taskData.testCases}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};