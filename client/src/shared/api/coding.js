import { api_local } from "./base";

export const codingApi = {
  getTasksList: async () => {
    const { data } = await api_local.get("/coding/tasks");
    return data;
  },

  getTaskById: async (id) => {
    const { data } = await api_local.get(`/coding/tasks/${id}`);
    return data;
  },

  // 👇 ДОБАВЛЕН АРГУМЕНТ testResults
  // 👇 ДОБАВЛЕНЫ АРГУМЕНТЫ performance и quality
  submitSolution: async (taskId, code, language, status, testResults, performance, quality) => {
    const { data } = await api_local.post("/coding/submit", { 
      taskId, 
      code, 
      language, 
      status,
      testResults,
      performance, // 👈 Передаем на сервер
      codeQuality: quality // 👈 Передаем на сервер (на бекенде ожидается codeQuality)
    });
    return data;
  },

  getMySolutions: async (taskId) => {
    const { data } = await api_local.get(`/coding/submissions/${taskId}`);
    return data;
  },
};