import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Добавили Link
import { authApi } from "../../shared/api/auth";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {

    const storedData = localStorage.getItem("data");
    if (storedData) {
      navigate("/profile"); 
    }
  }, [navigate]);

  const validateForm = () => {
    if (!email.trim()) return "Пожалуйста, введите email.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Некорректный формат email.";
    
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
      const { data } = await authApi.login({ email, password });
      
      const { token, fullName: resFullName, email: resEmail, avatarUrl, _id } = data;


      localStorage.setItem("data", JSON.stringify({
        token,
        fullName: resFullName,
        email: resEmail,
        avatarUrl,
        _id
      }));
      navigate("/profile"); 
      
    } catch (e) {

      const errorMessage = e.response?.data?.message || e.message || "Произошла ошибка при входе";
      setError(errorMessage);
      console.error("Auth error:", e); 
    } finally {
      setIsLoading(false); 
    }
  };


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
          Подготовьтесь к собеседованию <br />
          вместе с <span className="text-[#049666]">Skillboost</span>
        </h1>

        <h2 className="text-lg font-semibold text-center text-gray-600 dark:text-gray-300 mt-6 mb-4">
          Войти в аккаунт
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
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Введите пароль"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-[var(--color-text)] bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[#049666]"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 font-medium">
              {error}
            </div>
          )}

          <div className="text-right">

            <button 
              type="button" 
              className="text-sm text-blue-500 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
              Забыли пароль?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading} 
            className="w-full py-3 mt-2 rounded-xl bg-[#049666] hover:bg-[#037a53] text-white font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          Нет аккаунта?{" "}

          <Link
            to="/auth/register"
            className="text-[#049666] hover:underline font-semibold"
          >
            Зарегистрируйтесь
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;