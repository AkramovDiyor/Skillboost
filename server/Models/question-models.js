const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // краткое описание или заголовок вопроса
  // question: { type: String, required: true }, // текст вопроса
  answer: { type: String, required: true }, // подробный ответ
  category: { type: String }, // категория (можно расширить для разных тем)
  technologies: { type: String }, // технологии, связанные с вопросом
  frameworks: { type: String }, // фрейм
  rating: { type: String },
  direction: { type: String }, 
  level: { type: String, default: "Junior" }, // уровень сложности (Junior, Middle, Senior)
  difficulty: {
    type: String,
    // enum: ["Стажёр", "Junior", "Middle", "Senior"],
    // default: "Средняя",
  }, // уровень сложности
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);
[
  {
    category: "Frontend",
    title: "Как можно создать телефонную ссылку?",
    rating: "1",
    difficulty: "2",
    answer:
      'Для создания телефонной ссылки используется тег <a> с атрибутом href, значение которого начинается с tel:.\n\nНапример:\n\n<a href="tel:+1234567890">Позвонить</a>\n\nКогда пользователь нажимает на эту ссылку, устройство автоматически предложит совершить звонок на указанный номер. Это особенно полезно для мобильных пользователей.',
  },
];
