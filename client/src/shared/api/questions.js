import { api } from "./base";


/**
 * Получение вопросов по технологии
 */
export const questionsApi = {
    getByTech: (queryParams) => api.get('/questionsTech', { params: queryParams })
}
/**
 * Получение вопросов по фильтрам
 */
export const getQuestions = async ({ category, technologies, frameworks, level, count = 15 }) => {
    const response = await api.get("/questions", {
      params: { category, technologies, frameworks, level, count },
    });
    return response.data;
  };

/**
 * Извлечение вопросов из ответа (универсальный парсер)
 */
export const extractQuestions = (response) => {
    const data = response.data || response;
    
    if (Array.isArray(data)) return data;
    if (data?.questions && Array.isArray(data.questions)) return data.questions;
    if (data?.data && Array.isArray(data.data)) return data.data;
    
    return [];
  };