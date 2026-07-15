const Router = require("express").Router;
const router = Router();

const AuthController = require("../Controller/auth-controller.js");
const QuestionController = require("../Controller/question-controller.js");
const EditController = require('../Controller/edit-controller.js');
const upload = require("../Controller/middlewares/upload.js");
const checkAuth = require('../Controller/middlewares/checkAuth.js');
// const { checkSubscription } = require('../Controller/middlewares/checkAuth.js'); //   Исправлен путь
const UserController = require("../Controller/user-controller.js");
const CodingController = require("../Controller/coding-controller.js");

// Публичные роуты (или с checkAuth, если задачи только для зарегистрированных)
router.get("/coding/tasks", CodingController.getAllTasks);
router.get("/coding/tasks/:id", CodingController.getTaskById);



// Маршруты задач

router.delete("/tasks/:id", CodingController.deleteTask); 



// НОВЫЙ МАРШРУТ для удаления решения по _id (MongoDB ID)
router.delete("/submissions/:id",checkAuth,  CodingController.deleteSubmission); 

module.exports = router;



// Роуты, требующие авторизации
router.post("/coding/submit", checkAuth, CodingController.submitCode);
router.get("/coding/submissions/:taskId", checkAuth, CodingController.getUserSubmissions);
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/questionAll", QuestionController.getAllQuestions);
router.get("/questions", QuestionController.catigoryquestion);
router.get("/questionsTech", QuestionController.getQuestion);

router.get("/bookmarks", checkAuth, UserController.getBookmarks);
router.post("/bookmarks/toggle", checkAuth, UserController.toggleBookmark);

router.post("/question", QuestionController.createQuestion);
router.patch("/questions/premium/toggle", QuestionController.togglePremiumQuestions);

router.post("/subscription/purchase", checkAuth, UserController.purchaseSubscription);
router.get("/subscription", checkAuth, UserController.getSubscription);
router.get("/subscription/check-questions-access", checkAuth, UserController.checkQuestionsAccess);
router.post("/subscription/cancel", checkAuth, UserController.cancelSubscription);

router.put(
  "/profile/edit",
  checkAuth,
  upload.single("avatarUrl"),
  EditController.edit
);

module.exports = router;