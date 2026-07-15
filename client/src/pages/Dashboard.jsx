import React from "react";
import PopularQuestionsCarousel from "../shared/ui/PopularQuestionsCarousel";
import TechnologyTopicsSection from "../shared/ui/TechnologyTopicsSection";
import MentorsSection from "../widgets/MentorsSection";
import Footer from "../widgets/Footer";
import FeaturesSection from "../widgets/FeaturesSection";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // <-- Импортируем motion

const Dashboard = () => {
  const storedData = JSON.parse(localStorage.getItem("data")) || {};
  const username = storedData.fullName || "Гость";

  // Настройки анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Задержка между появлением элементов (в секундах)
        delayChildren: 0.3,   // Задержка перед стартом первой анимации
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 }, // Начальное состояние: сдвинут вниз на 30px, прозрачный
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6, // Длительность анимации
        ease: "easeOut", // Плавное замедление
      },
    },
  };

  return (
    <>
      {/* Оборачиваем Hero-секцию в motion.div с настройками контейнера */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col pt-10 sm:pt-20 justify-center items-center w-full h-[350px] sm:h-[540px] rounded-xl text-white bg-[linear-gradient(0deg,rgba(135,236,166,1)_0%,rgba(44,167,139,1)_100%)] overflow-hidden"
      >
        {/* Заголовок H1 */}
        <motion.h1
          variants={itemVariants}
          className="h1 text-4xl sm:text-[100px] sm:leading-[72px] leading-8 mb-4 md:mb-8 text-center font-drukwide"
        >
          Тренажёр <br /> для подготовки
        </motion.h1>

        {/* Подзаголовок H2 */}
        <motion.h2
          variants={itemVariants}
          className="text-[20px] sm:text-3xl lg:text-5xl text-center text-[#9747FF] bg-white px-5 py-3 rounded-[8px] sm:rounded-[20px] font-bold mb-6 sm:mb-12 -rotate-[3.53deg] z-20"
        >
          к техническим собеседованиям
        </motion.h2>

        {/* Кнопка (Link). 
            Важно: motion лучше применять к div вокруг Link, 
            чтобы не ломать маршрутизацию react-router-dom */}
        <motion.div variants={itemVariants} className="z-20">
          <Link
            to={"/startInterview"}
            className="inline-block rounded-full text-xl sm:text-2xl bg-[#9747FF] hover:bg-[#6a32b5] text-white px-5 sm:px-8 py-3 font-semibold"
          >
            Подготовиться <span className="hidden sm:inline">к собеседованию</span>
          </Link>
        </motion.div>
      </motion.div>

      <section className="relative w-full flex flex-col gap-4 md:gap-7 mt-10">
        <FeaturesSection />
        <PopularQuestionsCarousel />
        <TechnologyTopicsSection />
        {/* <MentorsSection /> */}

        <section className="w-full flex flex-col md:flex-row justify-between bg-[#B352FF] rounded-[20px] md:px-7 md:pt-7 md:pb-0 pb-4 pt-4 px-4 gap-4 md:gap-3">
          <header className="w-full md:w-5/12 flex flex-col items-start gap-5 md:pb-7">
            <header className="flex flex-col gap-3 text-white">
              <h1 className="font-bold text-2xl md:text-3xl">Оформите подписку</h1>
              <p className="text-sm">
                Чтобы получить полный доступ ко всему функционалу для подготовки к собеседованию
              </p>
            </header>
            <article className="hidden md:flex justify-center">
              <Link
                to={"/subscription"}
                className="px-5 py-3 rounded-xl w-full bg-st-green-9 bg-[#049666] text-center font-semibold text-white"
              >
                Оформить подписку
              </Link>
            </article>
          </header>

          <article className="flex flex-col justify-end gap-2 sm:gap-3">
            <img
              src="/img/tehnalogi/mainpage-languages.Cz59Uxeo.webp"
              className="w-full"
              alt="coding languages"
              loading="lazy"
            />
            <article className="md:hidden flex justify-center">
              <Link
                to={"/subscription"}
                className=" px-5 py-3 rounded-xl w-full bg-st-green-90 bg-[#049666] text-center font-semibold text-white"
              >
                Оформить подписку
              </Link>
            </article>
          </article>
        </section>

        {/* <Footer /> */}
      </section>
    </>
  );
};

export default Dashboard;