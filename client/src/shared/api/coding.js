import { api_local } from "./base";

export const codingApi = {
  // Получить список задач
  getTasksList: async () => {
    const { data } = await api_local.get("/coding/tasks");
    return data;
  },

  // Получить одну задачу
  getTaskById: async (id) => {
    const { data } = await api_local.get(`/coding/tasks/${id}`);
    return data;
  },

  // Отправить решение
  submitSolution: async (taskId, code, language, status) => {
    const { data } = await api_local.post("/coding/submit", { taskId, code, language, status });
    return data;
  },

  // Получить мои решения
  getMySolutions: async (taskId) => {
    const { data } = await api_local.get(`/coding/submissions/${taskId}`);
    return data;
  },
};