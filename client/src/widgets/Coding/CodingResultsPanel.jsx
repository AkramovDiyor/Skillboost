export const ResultsPanel = ({ results, isRunning }) => {
    if (isRunning) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p>Выполнение кода...</p>
          </div>
        </div>
      );
    }
  
    if (!results) {
      return (
        <div className="mt-5 flex items-center justify-center text-gray-400">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[var(--color-text)] font-medium">Здесь появится результат выполнения кода</p>
            <p className="text-sm text-gray-500">Чтобы получить результат,<br />запустите свой код</p>
          </div>
        </div>
      );
    }
  
    // Если ошибка
    if (!results.success) {
      return (
        <div className="p-4 text-red-400">
          <p className="font-semibold mb-2">Ошибка выполнения:</p>
          <pre className="bg-red-900/20 p-3 rounded whitespace-pre-wrap text-sm">{results.error}</pre>
        </div>
      );
    }
  
    // Если тесты пройдены
    const passedCount = results.results.filter(r => r.passed).length;
    const totalCount = results.results.length;
    const allPassed = passedCount === totalCount;

    console.log(results);
    
  
    return (
      <div className="p-4 space-y-3">
        <div className={`text-lg font-semibold ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
          {allPassed ? '✅ Все тесты пройдены!' : `❌ Пройдено ${passedCount}/${totalCount} тестов`}
        </div>
        
        {results.results.map((test, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-3 ${
              test.passed 
                ? 'border-green-700 bg-green-900/20' 
                : 'border-red-700 bg-red-900/20'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span>{test.passed ? '✅' : '❌'}</span>
              <span className="font-medium ">Тест {idx + 1}</span>
            </div>
            <div className="text-sm space-y-1 ">
              <div>Входные данные: <code className="text-gray-400">[{test.input.map(JSON.stringify).join(', ')}]</code></div>
              <div>Ожидалось: <code className="text-yellow-400">{JSON.stringify(test.expected)}</code></div>
              <div>Получено: <code className={test.passed ? 'text-green-400' : 'text-red-400'}>{JSON.stringify(test.got)}</code></div>
            </div>
          </div>
        ))}
  
        {/* Вывод console.log */}
        {results.logs && results.logs.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-400 text-sm mb-2">Вывод консоли:</p>
            <div className="bg-[var(--bg-03)] rounded-lg p-3 font-mono text-sm ">
              {results.logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };