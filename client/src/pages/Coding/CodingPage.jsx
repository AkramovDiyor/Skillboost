import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { workerCode } from '../../shared/data/workerDataCode';
import { TaskTags } from '../../widgets/Coding/CodingTaskTags';
import { CodingEditorPanel } from '../../widgets/Coding/CodingEditorPanel';
import { Link, useParams } from 'react-router-dom';
import { codingApi } from '../../shared/api/coding';

export const CodingPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient(); // 👈 Для обновления списка решений после отправки

  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bottomTab, setBottomTab] = useState('result');
  const [mobileView, setMobileView] = useState('description');

  const workerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 1. Получение данных задачи
  const { data: taskData, isLoading: isTaskLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => codingApi.getTaskById(id),
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
  });

  // 👇 2. Получение истории решений пользователя
  const { data: mySolutions = [] } = useQuery({
    queryKey: ['my-solutions', taskData?.taskId],
    queryFn: () => codingApi.getMySolutions(taskData.taskId),
    enabled: !!taskData?.taskId, // Запрос пойдет только когда taskData загружена
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (taskData) {
      setCode(taskData.starterCode);
    }
  }, [taskData]);

  // Универсальная функция запуска Web Worker
  const executeTests = (userCode, testCases) => {
    return new Promise((resolve, reject) => {
      if (workerRef.current) workerRef.current.terminate();

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      workerRef.current = worker;

      const timeout = setTimeout(() => {
        worker.terminate();
        workerRef.current = null;
        URL.revokeObjectURL(workerUrl);
        reject(new Error('Превышено время выполнения (10 секунд). Возможно, бесконечный цикл.'));
      }, 10000);

      worker.onmessage = (e) => {
        clearTimeout(timeout);
        worker.terminate();
        workerRef.current = null;
        URL.revokeObjectURL(workerUrl);
        resolve(e.data);
      };

      worker.onerror = (error) => {
        clearTimeout(timeout);
        worker.terminate();
        workerRef.current = null;
        URL.revokeObjectURL(workerUrl);
        reject(error);
      };

      worker.postMessage({ userCode, testCases });
    });
  };

  // Логика кнопки "Запустить"
  const handleRun = async () => {
    if (isRunning || isSubmitting || !taskData) return;

    setIsRunning(true);
    setResults(null);
    setBottomTab('result');
    if (isMobile) setMobileView('editor');

    try {
      const data = await executeTests(code, taskData.testCases);
      setResults(data);
    } catch (error) {
      setResults({ success: false, error: error.message || 'Неизвестная ошибка в Worker' });
    } finally {
      setIsRunning(false);
    }
  };

  // 👇 3. Логика кнопки "Отправить" (только если все тесты пройдены)
  const handleSubmit = async () => {
    if (isSubmitting || isRunning || !taskData) return;

    setIsSubmitting(true);
    setResults(null);
    setBottomTab('result');
    if (isMobile) setMobileView('editor');

    try {
      const workerData = await executeTests(code, taskData.testCases);
      setResults(workerData);

      // Проверяем, что код выполнился без ошибок
      if (!workerData.success) {
        alert("❌ В коде есть ошибка! Исправьте её перед отправкой.");
        return;
      }

      const passedCount = workerData.results.filter(r => r.passed).length;
      const totalTests = workerData.results.length;

      // 👇 ГЛАВНОЕ УСЛОВИЕ: Отправляем только если все тесты пройдены
      if (passedCount !== totalTests) {
        alert(`❌ Тесты не пройдены! Успешно: ${passedCount} из ${totalTests}. Сначала решите задачу правильно.`);
        return;
      }

      // Если мы здесь, значит все тесты пройдены на 100%
      const testResultsPayload = { passedCount, totalTests, percent: 100 };
      const status = "Решено";

      // Отправляем на сервер
      await codingApi.submitSolution(
        taskData.taskId, 
        code, 
        taskData.languages?.[0] || "JS", 
        status, 
        testResultsPayload
      );

      alert("🎉 Задача успешно решена и отправлена!");
      
      // 👇 Обновляем список решений во вкладке "Решения"
      queryClient.invalidateQueries(['my-solutions', taskData.taskId]);

    } catch (error) {
      console.error("Ошибка при отправке решения:", error);
      alert("Произошла ошибка при отправке. Возможно, вы не авторизованы?");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  if (isTaskLoading) {
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
        status="Не решено"
        companies={taskData.companies}
        extraCompanies={taskData.extraCompanies || 0}
        solvedPercent={taskData.solvedPercent || 0}
        languages={taskData.languages}
      />

      <div className="space-y-3">
        {taskData.description?.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
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

  // 👇 4. Компонент для отображения истории отправленных решений
  const MySolutionsList = () => {
    if (mySolutions.length === 0) {
      return <div className="text-center text-gray-400 py-8">У вас пока нет отправленных решений</div>;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">История решений</h3>
        {mySolutions.map((sub) => (
          <div key={sub._id} className="bg-[var(--bg-03)] p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'Решено' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>
                {sub.status}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(sub.createdAt).toLocaleString()}
              </span>
            </div>
            
            {sub.testResults && (
              <div className="mb-3 text-sm">
                <span className="text-gray-400">Тесты: </span>
                <span className="font-mono text-white">
                  {sub.testResults.passedCount} / {sub.testResults.totalTests}
                </span>
                <span className="ml-2 text-green-400 font-bold">({sub.testResults.percent}%)</span>
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
          <h1 className="text-[13px] sm:text-lg font-semibold truncate">
            {isMobile ? taskData.title : 'Coding Challenge'}
          </h1>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${isRunning || isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {isRunning ? '⏳' : '▶'} <span className="hidden sm:inline">Запустить</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isRunning}
              className={`px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center ${isSubmitting || isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? '⏳' : (isMobile ? '✓' : 'Отправить')}
              {!isMobile && isSubmitting && '...'}
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
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'description' && <TaskDescription />}
              {/* 👇 РЕНДЕРИМ СПИСОК РЕШЕНИЙ ЗДЕСЬ */}
              {activeTab === 'my-solutions' && <MySolutionsList />}
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
            <button onClick={() => setMobileView('description')} className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors text-center ${mobileView === 'description' ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>Описание</button>
            <button onClick={() => setMobileView('editor')} className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors text-center ${mobileView === 'editor' ? 'border-[var(--color-main)] text-[var(--color-main)]' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>Редактор</button>
          </div>

          <div className="flex-1 overflow-hidden">
            {mobileView === 'description' ? (
              <div className="h-full overflow-y-auto p-4">
                {/* На мобилке тоже показываем вкладки внутри описания для удобства */}
                <div className="flex border-b border-gray-700 mb-4">
                  <button onClick={() => setActiveTab('description')} className={`flex-1 px-2 py-1 text-sm ${activeTab === 'description' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-gray-400'}`}>Описание</button>
                  <button onClick={() => setActiveTab('my-solutions')} className={`flex-1 px-2 py-1 text-sm ${activeTab === 'my-solutions' ? 'text-[var(--color-main)] border-b-2 border-[var(--color-main)]' : 'text-gray-400'}`}>Решения</button>
                </div>
                {activeTab === 'description' && <TaskDescription />}
                {activeTab === 'my-solutions' && <MySolutionsList />}
              </div>
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