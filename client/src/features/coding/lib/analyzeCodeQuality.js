export const analyzeCodeQuality = (userCode) => {
    let score = 100;
    const issues = [];
  
    const cleanCode = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const lineCount = cleanCode.split('\n').length;
  
    if (/\bvar\b/.test(userCode)) {
      score -= 15;
      issues.push("Используется 'var'. Используйте 'let' или 'const'.");
    }
    if (/console\.log/.test(userCode)) {
      score -= 10;
      issues.push("В коде остался 'console.log'. Уберите отладку.");
    }
    if (lineCount > 30) {
      score -= 20;
      issues.push("Код слишком длинный. Возможно, стоит разбить на функции.");
    }
    if (/\n\s{8,}\S/.test(userCode)) {
      score -= 15;
      issues.push("Слишком глубокая вложенность. Используйте early return.");
    }
  
    if (score < 0) score = 0;
    return { score, issues };
  };