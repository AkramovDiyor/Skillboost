import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../shared/api/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      navigate("/profile");
    }
  }, [navigate]); // 👈 Добавили navigate в зависимости

  //   Чистая функция валидации (как в Login)
  const validateForm = () => {
    if (!email.trim()) return "Пожалуйста, введите email.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Некорректный формат email.";

    if (!fullName.trim()) return "Пожалуйста, введите имя.";

    if (password.length < 6) return "Пароль должен содержать минимум 6 символов.";

    return "";
  };

  const handlePost = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await authApi.register({ email, fullName, password });

      const { token, fullName: resFullName, email: resEmail, avatarUrl, _id } = data;


      localStorage.setItem("data", JSON.stringify({
        token,
        fullName: resFullName,
        email: resEmail,
        avatarUrl,
        _id
      }));
      navigate("/profile");

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Произошла ошибка при регистрации";
      setError(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  //   Обработчики для сброса ошибок при вводе
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 py-12">
      <div className="w-full max-w-md bg-[var(--bg-02)] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-[var(--color-text)]">
          Добро пожаловать в <span className="text-[#049666]">Skillboost</span>
        </h1>

        <h2 className="text-lg font-semibold text-center text-gray-600 dark:text-gray-300 mt-6 mb-4">
          Регистрация
        </h2>

        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              name="email"
              onChange={handleEmailChange}
              placeholder="Введите ваш email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-[var(--color-text)] bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[#049666]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя
            </label>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={handleFullNameChange}
              placeholder="Введите ваше имя"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-[var(--color-text)] bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[#049666]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Придумайте пароль"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-[var(--color-text)] bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[#049666]"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-xl bg-[#049666] hover:bg-[#037a53] text-white font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Регистрируемся..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          Уже есть аккаунт?{" "}
          <Link
            to="/auth"
            className="text-[#049666] hover:underline font-semibold"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;