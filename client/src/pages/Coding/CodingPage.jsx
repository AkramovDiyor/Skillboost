import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; 
import { CodingEditorPanel } from '../../widgets/Coding/CodingEditorPanel'; // поправь путь
import { Link, useParams } from 'react-router-dom';
import { codingApi } from '../../shared/api/coding';
import { useCodeWorker } from '../../features/coding/model/useCodeWorker';
import { analyzeCodeQuality } from '../../features/coding/lib/analyzeCodeQuality';
import { CodingHeader } from '../../widgets/Coding/ui/CodingHeader';
import { CodingTaskPanel } from '../../widgets/Coding/ui/CodingTaskPanel';


export const CodingPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { executeTests } = useCodeWorker();

  // --- СОСТОЯНИЯ ---
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bottomTab, setBottomTab] = useState('result');
  const [mobileView, setMobileView] = useState('description');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- ХУКИ ЗАПРОСОВ ---
  const { data: taskData, isLoading: isTaskLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => codingApi.getTaskById(id),
    enabled: !!id, 
    staleTime: 1000 * 60 * 5, 
  });

  const { data: mySolutions = [] } = useQuery({
    queryKey: ['my-solutions', taskData?.taskId],
    queryFn: () => codingApi.getMySolutions(taskData.taskId),
    enabled: !!taskData?.taskId, 
  });

  // --- ЭФФЕКТЫ ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (taskData) setCode(taskData.starterCode);
  }, [taskData]);

  // --- ОБРАБОТЧИКИ ---
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

  const handleSubmit = async () => {
    if (isSubmitting || isRunning || !taskData) return;
    setIsSubmitting(true);
    setResults(null);
    setBottomTab('result');
    if (isMobile) setMobileView('editor');

    try {
      const workerData = await executeTests(code, taskData.testCases);
      setResults(workerData);

      if (!workerData.success) {
        alert("❌ В коде есть синтаксическая ошибка! Исправьте её перед отправкой.");
        return;
      }

      const passedCount = workerData.results.filter(r => r.passed).length;
      const totalTests = workerData.results.length;

      if (passedCount !== totalTests) {
        alert(`❌ Тесты не пройдены! Успешно: ${passedCount} из ${totalTests}.`);
        return;
      }

      const avgTime = workerData.avgExecutionTime || 0;
      let perfRating = "Плохо";
      if (avgTime < 5) perfRating = "Отлично";
      else if (avgTime < 50) perfRating = "Хорошо";

      const quality = analyzeCodeQuality(code);
      const testResultsPayload = { passedCount, totalTests, percent: 100 };
      const performancePayload = { executionTimeMs: Math.round(avgTime * 100) / 100, rating: perfRating };

      await codingApi.submitSolution(
        taskData.taskId, code, taskData.languages?.[0] || "JS", "Решено", 
        testResultsPayload, performancePayload, quality             
      );

      alert(`🎉 Задача решена!\nПроизводительность: ${perfRating} (${performancePayload.executionTimeMs}мс)\nЧистота кода: ${quality.score}/100`);
      queryClient.invalidateQueries(['my-solutions', taskData.taskId]);

    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Произошла ошибка при отправке.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- РЕНДЕР ---
  if (isTaskLoading) return <div className="flex items-center justify-center h-screen text-gray-400">Загрузка задачи...</div>;
  if (!taskData) return <div className="flex items-center justify-center h-screen text-gray-400">Задача не найдена</div>;

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

      <CodingHeader
        title={taskData.title}
        isMobile={isMobile}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
        onRun={handleRun}
        onSubmit={handleSubmit}
      />

      {!isMobile && (
        <div className="flex-1 flex overflow-hidden">
          <CodingTaskPanel taskData={taskData} mySolutions={mySolutions} />
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
                {/* На мобилке просто рендерим панель целиком, она сама разобьется на вкладки */}
                <CodingTaskPanel taskData={taskData} mySolutions={mySolutions} />
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