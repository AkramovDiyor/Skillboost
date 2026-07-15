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
  submitSolution: async (taskId, code, language, status, testResults) => {
    const { data } = await api_local.post("/coding/submit", { 
      taskId, 
      code, 
      language, 
      status,
      testResults // <-- Это уйдет на сервер
    });
    return data;
  },

  getMySolutions: async (taskId) => {
    const { data } = await api_local.get(`/coding/submissions/${taskId}`);
    return data;
  },
};