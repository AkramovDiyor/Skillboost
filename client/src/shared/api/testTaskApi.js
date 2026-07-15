import { api_local } from "./base";

export const testTaskApi = {
  getAll: async (specialty) => {
    const url = specialty && specialty !== 'all' 
      ? `/test-tasks?specialty=${encodeURIComponent(specialty)}` 
      : "/test-tasks";
    const { data } = await api_local.get(url);
    return data;
  },

  getById: async (id) => {
    const { data } = await api_local.get(`/test-tasks/${id}`);
    return data;
  },
};