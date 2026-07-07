const Question = require("../Models/question-models");
/**
 * Возвращает массив допустимых уровней для выбранного уровня
 * Логика: уровень ± 1 ступень (с учётом иерархии)
 */
function getAllowedLevels(selectedLevel) {
  // Нормализация написания
  const normalized = selectedLevel.replace("ё", "е").toLowerCase();
  
  // Иерархия уровней
  const hierarchy = ["стажер", "junior", "middle", "senior"];
  
  // Оригинальные названия для БД (с "ё" где нужно)
  const originalNames = {
    "стажер": "Стажер",
    "junior": "Junior",
    "middle": "Middle",
    "senior": "Senior",
  };
  
  const index = hierarchy.indexOf(normalized);
  if (index === -1) return [selectedLevel]; // неизвестный уровень — строгий фильтр
  
  let allowed = [];
  
  switch (normalized) {
    case "стажер":
      // Стажёр получает вопросы своего уровня + Junior
      allowed = ["стажер", "junior"];
      break;
    case "junior":
      // Junior: Стажер + Junior + Middle
      allowed = ["стажер", "junior", "middle"];
      break;
    case "middle":
      // Middle: Junior + Middle + Senior
      allowed = ["junior", "middle", "senior"];
      break;
    case "senior":
      // Senior: Middle + Senior (без стажёрских)
      allowed = ["middle", "senior"];
      break;
    default:
      allowed = [normalized];
  }
  
  return allowed.map(l => originalNames[l]);
}

/**
 * Умное перемешивание с приоритетом основного уровня
 * 60% вопросов — основной уровень, 40% — соседние
 */
function prioritizeByLevel(questions, selectedLevel) {
  if (!selectedLevel || selectedLevel === "all") {
    // Если уровень не выбран — просто перемешиваем
    return shuffleArray(questions);
  }
  
  const allowedLevels = getAllowedLevels(selectedLevel);
  const mainLevel = selectedLevel;
  
  // Разделяем вопросы на основной уровень и соседние
  const mainLevelQuestions = questions.filter(q => 
    q.difficulty === mainLevel || q.level === mainLevel
  );
  const otherLevelQuestions = questions.filter(q => 
    !mainLevelQuestions.includes(q)
  );
  
  // Перемешиваем обе группы
  shuffleArray(mainLevelQuestions);
  shuffleArray(otherLevelQuestions);
  
  // Чередование: 3 вопроса основного уровня → 2 соседнего → и т.д.
  const result = [];
  let mainIdx = 0;
  let otherIdx = 0;
  
  while (result.length < questions.length) {
    // 3 из основного
    for (let i = 0; i < 3 && mainIdx < mainLevelQuestions.length; i++) {
      result.push(mainLevelQuestions[mainIdx++]);
    }
    // 2 из соседних
    for (let i = 0; i < 2 && otherIdx < otherLevelQuestions.length; i++) {
      result.push(otherLevelQuestions[otherIdx++]);
    }
    // Если одна группа закончилась — докидываем оставшиеся
    if (mainIdx >= mainLevelQuestions.length && otherIdx >= otherLevelQuestions.length) {
      break;
    }
  }
  
  return result;
}

/**
 * Fisher-Yates shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




class QuestionController {
  async getAllQuestions(req, res) {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения вопросов", error });
    }
  }

  async createQuestion(req, res) {
    try {
      const questions = req.body;
  
      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: "Должен быть массив вопросов" });
      }
  
      const difficultyMap = {
        "0": "Стажер",
        "1": "Junior",
        "2": "Junior",
        "3": "Middle",
        "4": "Senior",
      };
  
      // Маппинг технологий → направление
      const directionMap = {
        // Frontend
        "JavaScript": "Frontend",
        "TypeScript": "Frontend",
        "React": "Frontend",
        "Vue.js": "Frontend",
        "Angular": "Frontend",
        "jQuery": "Frontend",
        "Next.js": "Frontend",
        "Svelte": "Frontend",
        "Frontend": "Frontend",
        
        // Backend
        "Node.js": "Backend",
        "Python": "Backend",
        "Go": "Backend",
        "Golang": "Backend",
        "Java": "Backend",
        "Express": "Backend",
        "NestJS": "Backend",
        "Koa": "Backend",
        "Fastify": "Backend",
        "Django": "Backend",
        "FastAPI": "Backend",
        "Flask": "Backend",
        "Pyramid": "Backend",
        "Gin": "Backend",
        "Echo": "Backend",
        "Fiber": "Backend",
        "Chi": "Backend",
        "Spring": "Backend",
        "Hibernate": "Backend",
        "Micronaut": "Backend",
        "Quarkus": "Backend",
        "Backend": "Backend",
        
        // Fullstack
        "MERN": "Fullstack",
        "MEVN": "Fullstack",
        "tRPC": "Fullstack",
        "SvelteKit": "Fullstack",
        "Nuxt.js": "Fullstack",
        "Remix": "Fullstack",
        "Fullstack": "Fullstack",
      };
  
      const formattedQuestions = questions.map((q) => {
        // Определяем direction автоматически
        let direction = q.direction;
        if (!direction) {
          direction =
            directionMap[q.technologies] ||
            directionMap[q.frameworks] ||
            directionMap[q.category] ||
            "Frontend";
        }
  
        return {
          ...q,
          direction,
          difficulty: difficultyMap[q.rating] || q.difficulty || "Junior",
        };
      });
  
      const savedQuestions = await Question.insertMany(formattedQuestions);
  
      res.status(201).json({
        message: `✅ Добавлено ${savedQuestions.length} вопросов`,
        data: savedQuestions,
      });
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
      res.status(500).json({ message: "Ошибка при добавлении", error });
    }
  }

  async togglePremiumQuestions(req, res) {
    try {
      const { ids, value = true } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ 
          message: "Необходимо передать массив ids" 
        });
      }

      const result = await Question.updateMany(
        { _id: { $in: ids } },
        { $set: { isPremium: !!value } }
      );

      res.status(200).json({
        message: `✅ Обновлено ${result.modifiedCount} вопросов (isPremium: ${value})`,
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("❌ Ошибка toggle premium:", error);
      res.status(500).json({ 
        message: "Ошибка при обновлении", 
        error: error.message 
      });
    }
  }

  async catigoryquestion(req, res) {
    try {
      const { 
        count = 15, 
        category,
        technologies,
        frameworks,
        level
      } = req.query;
  
      console.log("🔍 Параметры с фронта:", { category, technologies, frameworks, level });
  
      const filter = {};
      const andConditions = [];
  
      // 1. Фильтр по направлению
      if (category && category !== "all") {
        andConditions.push({ direction: category });
      }
  
      // 2. Фильтр по технологии
      if (technologies && technologies !== "all") {
        andConditions.push({
          $or: [
            { technologies: { $regex: technologies, $options: "i" } },
            { category: { $regex: technologies, $options: "i" } },
          ],
        });
      }
  
      // 3. Фильтр по фреймворку
      if (frameworks && frameworks !== "all") {
        andConditions.push({
          $or: [
            { frameworks: { $regex: frameworks, $options: "i" } },
            { category: { $regex: frameworks, $options: "i" } },
          ],
        });
      }
  
      // 4. 🟢 УМНЫЙ фильтр по уровню
      if (level && level !== "all") {
        // Определяем допустимые уровни на основе выбранного
        const allowedLevels = getAllowedLevels(level);
        
        console.log(`🎯 Выбран уровень: "${level}" → допустимые: [${allowedLevels.join(", ")}]`);
  
        andConditions.push({
          $or: [
            { difficulty: { $in: allowedLevels } },
            { level: { $in: allowedLevels } },
          ],
        });
      }
  
      // Собираем финальный фильтр
      if (andConditions.length === 1) {
        Object.assign(filter, andConditions[0]);
      } else if (andConditions.length > 1) {
        filter.$and = andConditions;
      }
  
      console.log("📊 Итоговый фильтр:", JSON.stringify(filter, null, 2));
  
      const questionCount = Math.min(Number(count), 50);
      const allQuestions = await Question.find(filter).lean();
  
      // 🟢 УМНОЕ ПЕРЕМЕШИВАНИЕ с приоритетом основного уровня
      const prioritized = prioritizeByLevel(allQuestions, level);
  
      const questions = prioritized.slice(0, questionCount);
  
      console.log(`✅ Найдено: ${questions.length} вопросов`);
  
      if (questions.length === 0) {
        return res.json({
          questions: [],
          message: "Нет вопросов по заданным фильтрам",
        });
      }
  
      res.json(questions);
    } catch (error) {
      console.error("❌ Ошибка:", error);
      res.status(500).json({ message: "Ошибка", error: error.message });
    }
  }

  async getQuestion(req, res) {
    try {
      const { tech, difficulty } = req.query;
      const filter = {};
      
      if (tech) filter.category = new RegExp(`^${tech}$`, 'i');
      if (difficulty) filter.difficulty = difficulty;

      const questions = await Question.find(filter);
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: "Ошибка получения вопроса", error });
    }
  }
}

module.exports = new QuestionController();