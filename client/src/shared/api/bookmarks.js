
import { api_local } from "./base";

export const bookmarksApi = {
  // Получить список закладок
  async getAll() {
    const { data } = await api_local.get("/bookmarks");
    return data;
  },

  // Добавить/убрать из закладок
  async toggle(questionId) {
    const { data } = await api_local.post("/bookmarks/toggle", { questionId });
    return data;
  },
};