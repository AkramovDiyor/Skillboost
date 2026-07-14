// server/seedTasks.js
import mongoose from "mongoose";
import Task from "./Models/task-models.js";


const URL = "mongodb+srv://akramovakramov32:5G8bBpKYGlvAl4I7@cluster1.u1mby92.mongodb.net/?appName=Cluster1";


// Вставь сюда свой массив tasksData (я сократил его для примера, вставь свой полный массив)
export const rawTasksData = [
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 1,
      title: "Поиск ближайшего товара",
      companies: ["Авито"],
      extraCompanies: 0,
      solvedPercent: 100,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Средняя",
      status: "Не решено",
      acceptance: "100%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "На Авито размещено множество товаров, каждый из которых представлен числом.",
        "У каждого покупателя есть потребность в товаре, также выраженная числом.",
        "Если точного товара нет, покупатель выбирает ближайший по значению товар, что вызывает неудовлетворённость, равную разнице между потребностью и купленным товаром.",
        "Количество каждого товара неограничено, и один товар могут купить несколько покупателей.",
        "Рассчитайте суммарную неудовлетворённость всех покупателей.",
      ],
      requirements: [
        "Напишите функцию, которая принимает два массива:",
        "• `goods` — массив чисел (товары);",
        "• `buyerNeeds` — массив чисел (потребности покупателей).",
        "Функция должна вернуть сумму неудовлетворённостей всех покупателей.",
      ],
      examples: [
        {
          input: `goods = [8, 3, 5];\nbuyerNeeds = [5, 6];`,
          output: "1",
          explanation: [
            "// Первый покупатель: |5 - 5| = 0",
            "// Второй покупатель: |6 - 5| = 1",
            "// Итого: 0 + 1 = 1",
          ],
        },
      ],
      starterCode: `/**
   * @param {number[]} goods
   * @param {number[]} buyerNeeds
   * @return {number}
   */
  var totalDissatisfaction = function(goods, buyerNeeds) {
      // Ваш код здесь
      
  };`,
      testCases: [
        { input: [[8, 3, 5], [5, 6]], expected: 1 },
        { input: [[1, 2, 3], [2, 3, 4]], expected: 1 },
        { input: [[10, 20, 30], [15, 25]], expected: 10 },
        { input: [[100], [1, 2, 3]], expected: 294 },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 2,
      title: "Декодирование строки",
      companies: ["Т-Банк"],
      extraCompanies: 1,
      solvedPercent: 47,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Средняя",
      status: "Попытка",
      acceptance: "47%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "Дана закодированная строка вида `k[encoded_string]`, где `encoded_string` повторяется ровно `k` раз.",
        "`k` — положительное целое число. Гарантируется, что строка корректна: нет лишних пробелов, скобки правильно расставлены.",
        "Исходная строка не содержит цифр, кроме тех, что используются для повторений.",
      ],
      requirements: [
        "Реализуйте функцию, которая декодирует строку и возвращает результат.",
        "Поддерживайте вложенные конструкции: например, `3[a2[c]]` → `accaccacc`.",
      ],
      examples: [
        {
          input: `s = "3[a]2[bc]"`,
          output: '"aaabcbc"',
          explanation: ['// 3[a] → aaa, 2[bc] → bcbc, результат: aaabcbc'],
        },
        {
          input: `s = "3[a2[c]]"`,
          output: '"accaccacc"',
          explanation: ['// 2[c] → cc, затем 3[acc] → accaccacc'],
        },
      ],
      starterCode: `/**
   * @param {string} s
   * @return {string}
   */
  var decodeString = function(s) {
      // Ваш код здесь
      
  };`,
      testCases: [
        { input: ["3[a]2[bc]"], expected: "aaabcbc" },
        { input: ["3[a2[c]]"], expected: "accaccacc" },
        { input: ["2[abc]3[cd]ef"], expected: "abcabccdcdcdef" },
        { input: ["10[a]"], expected: "aaaaaaaaaa" },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 3,
      title: "Доступно по подписке",
      companies: ["Т-Банк"],
      extraCompanies: 1,
      solvedPercent: 59,
      languages: ["JS"],
      isPremium: true,
      difficulty: "Средняя",
      status: "Не решено",
      acceptance: "59%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "В системе есть пользователи с подписками разных типов: `free`, `pro`, `premium`.",
        "Каждая подписка имеет дату начала и дату окончания.",
        "Необходимо определить, доступна ли функция пользователю в заданный момент времени.",
        "Функция доступна, если у пользователя есть активная подписка уровня `pro` или `premium` на указанную дату.",
      ],
      requirements: [
        "Функция принимает: массив подписок пользователя, дату проверки (строка в формате `YYYY-MM-DD`), минимальный требуемый уровень подписки.",
        "Вернуть `true`, если функция доступна, иначе `false`.",
        "Учитывать, что подписки могут пересекаться — брать максимальный уровень.",
      ],
      examples: [
        {
          input: `subscriptions = [
    { level: "pro", start: "2024-01-01", end: "2024-06-30" },
    { level: "free", start: "2024-07-01", end: "2024-12-31" }
  ];
  checkDate = "2024-03-15";
  requiredLevel = "pro";`,
          output: "true",
          explanation: ["// На дату 2024-03-15 активна подписка pro"],
        },
      ],
      starterCode: `/**
   * @param {Array} subscriptions
   * @param {string} checkDate
   * @param {string} requiredLevel
   * @return {boolean}
   */
  var isFeatureAvailable = function(subscriptions, checkDate, requiredLevel) {
      // Ваш код здесь
      
  };`,
      testCases: [
        {
          input: [
            [{ level: "pro", start: "2024-01-01", end: "2024-06-30" }, { level: "free", start: "2024-07-01", end: "2024-12-31" }],
            "2024-03-15",
            "pro"
          ],
          expected: true
        },
        {
          input: [
            [{ level: "free", start: "2024-01-01", end: "2024-12-31" }],
            "2024-06-01",
            "pro"
          ],
          expected: false
        },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 4,
      title: "Поиск последних известных значений",
      companies: ["Самокат"],
      extraCompanies: 0,
      solvedPercent: 41,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Средняя",
      status: "Решено",
      acceptance: "41%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "В массиве хранятся измерения параметров с временными метками.",
        "Некоторые значения могут отсутствовать (`null`).",
        "Необходимо для каждой записи подставить последнее известное (не `null`) значение параметра, встреченное ранее по времени.",
        "Это классическая задача «forward fill» или «last known value».",
      ],
      requirements: [
        "Напишите функцию, которая принимает массив объектов `{ timestamp: string, value: number | null }`.",
        "Верните новый массив, где все `null` заменены на последнее не-`null` значение.",
        "Если в начале массива идут `null` — оставить их как есть.",
      ],
      examples: [
        {
          input: `measurements = [
    { timestamp: "2024-01-01 10:00:00", value: 100 },
    { timestamp: "2024-01-01 11:00:00", value: null },
    { timestamp: "2024-01-01 12:00:00", value: null },
    { timestamp: "2024-01-01 13:00:00", value: 200 },
    { timestamp: "2024-01-01 14:00:00", value: null }
  ];`,
          output: `[
    { timestamp: "2024-01-01 10:00:00", value: 100 },
    { timestamp: "2024-01-01 11:00:00", value: 100 },
    { timestamp: "2024-01-01 12:00:00", value: 100 },
    { timestamp: "2024-01-01 13:00:00", value: 200 },
    { timestamp: "2024-01-01 14:00:00", value: 200 }
  ]`,
          explanation: ["// Значение 100 распространяется вперёд до появления 200"],
        },
      ],
      starterCode: `/**
   * @param {Array<{timestamp: string, value: number | null}>} measurements
   * @return {Array<{timestamp: string, value: number | null}>}
   */
  var forwardFill = function(measurements) {
      // Ваш код здесь
      
  };`,
      testCases: [
        {
          input: [[
            { timestamp: "10:00", value: 100 },
            { timestamp: "11:00", value: null },
            { timestamp: "12:00", value: 200 },
            { timestamp: "13:00", value: null }
          ]],
          expected: [
            { timestamp: "10:00", value: 100 },
            { timestamp: "11:00", value: 100 },
            { timestamp: "12:00", value: 200 },
            { timestamp: "13:00", value: 200 }
          ]
        },
        {
          input: [[
            { timestamp: "10:00", value: null },
            { timestamp: "11:00", value: 50 }
          ]],
          expected: [
            { timestamp: "10:00", value: null },
            { timestamp: "11:00", value: 50 }
          ]
        },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 5,
      title: "Поиск рублей",
      companies: ["Т-Банк"],
      extraCompanies: 0,
      solvedPercent: 62,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Легкая",
      status: "Не решено",
      acceptance: "62%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "В текстовом поле хранятся описания транзакций в свободной форме.",
        "Необходимо найти все строки, где упоминается сумма в рублях.",
        "Сумма может быть записана как: `100 руб.`, `1 500 рублей`, `₽2500`, `3000р`.",
        "Извлеките числовое значение суммы и верните его.",
      ],
      requirements: [
        "Напишите функцию, которая принимает строку и извлекает первую найденную сумму в рублях.",
        "Поддерживайте форматы: цифры + пробел(ы) + `руб`/`руб.`/`рублей`/`р`/`₽`.",
        "Если сумма не найдена — вернуть `null`.",
        "Удаляйте пробелы внутри числа (например, `1 500` → `1500`).",
      ],
      examples: [
        {
          input: `text = "Перевод на сумму 1 500 рублей за услуги"`,
          output: "1500",
          explanation: ["// Извлечено число 1500 (пробелы в числе игнорируются)"],
        },
        {
          input: `text = "Оплата: ₽2500, комиссия 50р"`,
          output: "2500",
          explanation: ["// Возвращаем первую найденную сумму: 2500"],
        },
      ],
      starterCode: `/**
   * @param {string} text
   * @return {number|null}
   */
  var extractRubles = function(text) {
      // Ваш код здесь
      
  };`,
      testCases: [
        { input: ["Перевод 100 руб."], expected: 100 },
        { input: ["Оплата: ₽2500, комиссия 50р"], expected: 2500 },
        { input: ["Сумма: 1 500 рублей"], expected: 1500 },
        { input: ["Нет суммы здесь"], expected: null },
        { input: ["Заказ на 3000р."], expected: 3000 },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 6,
      title: "Самый популярный промокод",
      companies: ["Т-Банк"],
      extraCompanies: 1,
      solvedPercent: 57,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Средняя",
      status: "Не решено",
      acceptance: "57%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "В массиве хранятся заказы с применёнными промокодами.",
        "Необходимо найти промокод, который был использован наибольшее количество раз за указанный период.",
        "Если таких несколько — вернуть все в алфавитном порядке.",
      ],
      requirements: [
        "Функция принимает: массив заказов, дату начала и дату окончания периода.",
        "Каждый заказ: `{ promoCode: string | null, status: string, createdAt: string }`.",
        "Учитывать только заказы со статусом `'completed'` и в указанном периоде.",
        "Вернуть массив самых популярных промокодов (может быть один или несколько).",
      ],
      examples: [
        {
          input: `orders = [
    { promoCode: "SALE20", status: "completed", createdAt: "2024-01-15" },
    { promoCode: "SALE20", status: "completed", createdAt: "2024-01-16" },
    { promoCode: "WELCOME", status: "completed", createdAt: "2024-01-17" },
    { promoCode: "SALE20", status: "cancelled", createdAt: "2024-01-18" }
  ];
  startDate = "2024-01-01";
  endDate = "2024-01-31";`,
          output: '["SALE20"]',
          explanation: ["// SALE20 использован 2 раза в завершённых заказах"],
        },
      ],
      starterCode: `/**
   * @param {Array} orders
   * @param {string} startDate
   * @param {string} endDate
   * @return {string[]}
   */
  var getTopPromoCodes = function(orders, startDate, endDate) {
      // Ваш код здесь
      
  };`,
      testCases: [
        {
          input: [
            [
              { promoCode: "SALE20", status: "completed", createdAt: "2024-01-15" },
              { promoCode: "SALE20", status: "completed", createdAt: "2024-01-16" },
              { promoCode: "WELCOME", status: "completed", createdAt: "2024-01-17" },
            ],
            "2024-01-01",
            "2024-01-31"
          ],
          expected: ["SALE20"]
        },
        {
          input: [
            [
              { promoCode: "A", status: "completed", createdAt: "2024-01-15" },
              { promoCode: "B", status: "completed", createdAt: "2024-01-16" },
            ],
            "2024-01-01",
            "2024-01-31"
          ],
          expected: ["A", "B"]
        },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 7,
      title: "Опытные пилоты на пассажирских рейсах",
      companies: ["Т-Банк"],
      extraCompanies: 0,
      solvedPercent: 58,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Средняя",
      status: "Не решено",
      acceptance: "58%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "В авиакомпании нужно найти пилотов, которые имеют опыт работы на пассажирских рейсах не менее 5 лет.",
        "Данные хранятся в двух массивах: `pilots` (пилоты) и `flights` (рейсы).",
        "Необходимо вернуть список пилотов с указанием общего стажа на пассажирских рейсах в годах.",
      ],
      requirements: [
        "Функция принимает два массива: `pilots` и `flights`.",
        "`pilots`: `{ id: number, name: string }`",
        "`flights`: `{ pilotId: number, type: string, date: string }`",
        "Учитывать только рейсы с `type = 'passenger'`.",
        "Стаж считать как разницу между датами первого и последнего пассажирского рейса в годах (целое число).",
        "Вернуть массив пилотов со стажем >= 5 лет: `{ id, name, totalPassengerYears }`.",
      ],
      examples: [
        {
          input: `pilots = [
    { id: 1, name: "Иванов" },
    { id: 2, name: "Петров" }
  ];
  flights = [
    { pilotId: 1, type: "passenger", date: "2018-01-15" },
    { pilotId: 1, type: "passenger", date: "2024-01-15" },
    { pilotId: 2, type: "cargo", date: "2020-01-01" },
    { pilotId: 2, type: "passenger", date: "2023-06-01" }
  ];`,
          output: `[
    { id: 1, name: "Иванов", totalPassengerYears: 6 }
  ]`,
          explanation: ["// У Иванова пассажирские рейсы с 2018 по 2024 = 6 лет"],
        },
      ],
      starterCode: `/**
   * @param {Array<{id: number, name: string}>} pilots
   * @param {Array<{pilotId: number, type: string, date: string}>} flights
   * @return {Array<{id: number, name: string, totalPassengerYears: number}>}
   */
  var getExperiencedPilots = function(pilots, flights) {
      // Ваш код здесь
      
  };`,
      testCases: [
        {
          input: [
            [{ id: 1, name: "Иванов" }, { id: 2, name: "Петров" }],
            [
              { pilotId: 1, type: "passenger", date: "2018-01-15" },
              { pilotId: 1, type: "passenger", date: "2024-01-15" },
              { pilotId: 2, type: "cargo", date: "2020-01-01" },
            ]
          ],
          expected: [{ id: 1, name: "Иванов", totalPassengerYears: 6 }]
        },
        {
          input: [
            [{ id: 1, name: "Сидоров" }],
            [
              { pilotId: 1, type: "passenger", date: "2022-01-01" },
              { pilotId: 1, type: "passenger", date: "2023-01-01" },
            ]
          ],
          expected: []
        },
      ],
    },
  
    {
      // ═══════════ ПОЛЯ ДЛЯ СПИСКА ═══════════
      id: 8,
      title: "Генератор событий на JavaScript",
      companies: ["Яндекс"],
      extraCompanies: 0,
      solvedPercent: 72,
      languages: ["JS"],
      isPremium: false,
      difficulty: "Сложная",
      status: "Не решено",
      acceptance: "72%",
  
      // ═══════════ ПОЛЯ ДЛЯ ДЕТАЛЬНОЙ СТРАНИЦЫ ═══════════
      description: [
        "Реализуйте класс `EventEmitter`, который поддерживает подписку на события и их генерацию.",
        "Поддерживайте методы: `on(event, callback)`, `off(event, callback)`, `emit(event, ...args)`, `once(event, callback)`.",
        "Метод `once` должен выполнить колбэк только один раз, после чего автоматически отписаться.",
      ],
      requirements: [
        "`on(event, callback)` — подписывает колбэк на событие, возвращает функцию для отписки.",
        "`off(event, callback)` — отписывает конкретный колбэк от события.",
        "`emit(event, ...args)` — вызывает все колбэки события с переданными аргументами.",
        "`once(event, callback)` — подписывает колбэк, который выполнится один раз и отпишется.",
      ],
      examples: [
        {
          input: `const emitter = new EventEmitter();
  const log = (data) => console.log('logged:', data);
  
  emitter.on('data', log);
  emitter.emit('data', { id: 1 });
  // logged: { id: 1 }
  
  emitter.off('data', log);
  emitter.emit('data', { id: 2 });
  // ничего не выведено`,
          output: "logged: { id: 1 }",
          explanation: ["// Колбэк выполнен один раз, затем отписан"],
        },
      ],
      starterCode: `class EventEmitter {
    constructor() {
      // Ваш код здесь
    }
    
    on(event, callback) {
      // Ваш код здесь
    }
    
    off(event, callback) {
      // Ваш код здесь
    }
    
    emit(event, ...args) {
      // Ваш код здесь
    }
    
    once(event, callback) {
      // Ваш код здесь
    }
  }`,
      testCases: [],
    },
  ];

  const tasksData = rawTasksData.map(task => ({
    ...task,
    taskId: task.id, 
    id: undefined    
  }));
  
  const seedDatabase = async () => {
    try {
      console.log("🔄 Подключение к MongoDB Atlas...");
      await mongoose.connect(URL); 
      console.log("✅ База данных подключена!");
  
      // 👇 ЭТА СТРОКА СПАСЕТ ПОЛОЖЕНИЕ:
      // Она удалит все индексы, которых нет в текущей схеме (включая старый id_1), 
      // и создаст новые (taskId_1)
      console.log("🧹 Синхронизирую индексы базы данных (удаляю старые)...");
      await Task.syncIndexes();
  
      console.log("🗑️ Очищаю коллекцию 'tasks' от старых данных...");
      await Task.deleteMany({});
      
      console.log("💾 Загружаю новые задачи...");
      await Task.insertMany(tasksData);
      
      console.log("🎉 ГОТОВО! Все задачи успешно сохранены.");
      process.exit(0);
    } catch (error) {
      console.error("❌ Произошла ошибка:", error);
      process.exit(1);
    }
  };
  
  seedDatabase();