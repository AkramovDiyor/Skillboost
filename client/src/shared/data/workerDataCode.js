

      // ============================================
    // КОД WORKER'А (как строка)
    // ============================================
    export const workerCode = `
    const logs = [];
    console.log = (...args) => {
      logs.push(args.map(a => 
        typeof a === 'object' ? JSON.stringify(a) : String(a)
      ).join(' '));
    };
  
    self.onmessage = function(e) {
      const { userCode, testCases } = e.data;
      
      try {
        // Пытаемся извлечь функцию разными способами
        let userFunction;
        
        // Способ 1: function declaration — function name(...) { ... }
        const funcDeclMatch = userCode.match(/function\\s+(\\w+)\\s*\\(/);
        
        // Способ 2: var/let/const name = function(...) { ... }
        const varAssignMatch = userCode.match(/(?:var|let|const)\\s+(\\w+)\\s*=\\s*function\\s*\\(/);
        
        // Способ 3: var/let/const name = (...) => { ... }
        const arrowMatch = userCode.match(/(?:var|let|const)\\s+(\\w+)\\s*=\\s*\\(/);
        
        // Способ 4: name = function(...) без var/let/const
        const assignMatch = userCode.match(/(\\w+)\\s*=\\s*function\\s*\\(/);
        
        let funcName = null;
        
        if (funcDeclMatch) {
          funcName = funcDeclMatch[1];
        } else if (varAssignMatch) {
          funcName = varAssignMatch[1];
        } else if (arrowMatch) {
          funcName = arrowMatch[1];
        } else if (assignMatch) {
          funcName = assignMatch[1];
        }
        
        if (!funcName) {
          throw new Error(
            'Не удалось найти функцию. Используйте один из форматов:\\n' +
            '• function имяФункции(...) { ... }\\n' +
            '• var имяФункции = function(...) { ... }\\n' +
            '• const имяФункции = (...) => { ... }'
          );
        }
        
        // Выполняем код пользователя, чтобы функция стала доступна
        eval(userCode);
        
        // Получаем функцию по имени
        userFunction = eval(funcName);
        
        if (typeof userFunction !== 'function') {
          throw new Error('Переменная "' + funcName + '" найдена, но она не является функцией. Найдено: ' + typeof userFunction);
        }
        
        // Прогоняем тесты
            // ... (код до прогона тестов остается таким же)
    
    // Прогоняем тесты с замером времени
    const results = testCases.map((test, index) => {
      try {
        // 👇 ЗАМЕРЯЕМ ВРЕМЯ
        const startTime = performance.now();
        const result = userFunction(...test.input);
        const endTime = performance.now();
        const timeTaken = endTime - startTime;

        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        
        return {
          passed,
          input: test.input,
          expected: test.expected,
          got: result,
          timeMs: timeTaken // 👈 Передаем время на фронтенд
        };
      } catch (testError) {
        return {
          passed: false,
          input: test.input,
          expected: test.expected,
          got: 'Ошибка: ' + testError.message,
          error: testError.message,
          timeMs: 0
        };
      }
    });
    
    // 👇 Считаем среднее время выполнения (без учета упавших с ошибкой)
    const successfulTests = results.filter(r => r.passed);
    const avgTime = successfulTests.length > 0 
      ? successfulTests.reduce((acc, curr) => acc + curr.timeMs, 0) / successfulTests.length 
      : 0;

    self.postMessage({ 
      success: true, 
      results,
      avgExecutionTime: avgTime, // 👈 Среднее время
      logs 
    });
        
      } catch (error) {
        self.postMessage({ 
          success: false, 
          error: error.message,
          logs 
        });
      }
    };
  `;