import { useRef, useEffect } from 'react';
import { workerCode } from '../../../shared/data/workerDataCode'; // Укажи правильный путь

export const useCodeWorker = () => {
  const workerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

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

  return { executeTests };
};