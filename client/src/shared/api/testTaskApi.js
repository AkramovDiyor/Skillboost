import { api_local, api } from "./base";

export const testTaskApi = {
  getAll: async (specialty) => {
    const url = specialty && specialty !== 'all' 
      ? `/test-tasks?specialty=${encodeURIComponent(specialty)}` 
      : "/test-tasks";
    const { data } = await api.get(url);
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/test-tasks/${id}`);
    return data;
  },
};