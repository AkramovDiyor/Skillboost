
import { api } from "./base";

export const bookmarksApi = {
  // Получить список закладок
  async getAll() {
    const { data } = await api.get("/bookmarks");
    return data;
  },

  // Добавить/убрать из закладок
  async toggle(questionId) {
    const { data } = await api.post("/bookmarks/toggle", { questionId });
    return data;
  },
};