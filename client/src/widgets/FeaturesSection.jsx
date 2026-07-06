import React from "react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
    return (
        <>
            <header className="flex flex-col gap-3">
                <h2 className="font-bold text-2xl sm:text-5xl text-[var(--color-text)]">
                    Возможности
                </h2>
                <h3 className="text-gray-400 text-base font-normal sm:text-xl max-w-[570px]">
                    Всё, что нужно для быстрой подготовки к собеседованию
                </h3>
            </header>

            <section className="sm:flex justify-between gap-10">
                <section className="flex flex-col gap-6 ">
                    <section className="w-full  gap-5 md:gap-6 md:grid-cols-3">
                        {/* Карточка “База вопросов” */}
                        <section className="flex flex-col gap-1 col-span-1">
                            <section className="group/feature relative flex flex-col p-7 bg-[var(--bg-03)]  rounded-[20px] overflow-hidden border-[1px] border-[#4444]">
                                <header className="flex flex-col gap-2.5">
                                    <h2 className="text-xl text-[var(--color-text)]  font-bold">
                                        База вопросов
                                    </h2>
                                    <h3 className="text-sm text-[var(--color-text)] max-w-[300px]">
                                        Изучай нужные тебе технологии. Отвечай на вопросы в уроках
                                        и отслеживай свой прогресс
                                    </h3>
                                </header>

                                <section className="relative pt-44">
                                    {/* Python */}
                                    <section className="flex items-center max-w-96 gap-3 border border-transparent bg-[var(--bg-02)] dark:bg-st-white-T10 dark:border-st-gray-90 p-2 rounded-xl shadow-lg absolute top-6 left-0 rotate-2">
                                        <div className="w-12 h-12 min-w-12 rounded-lg bg-st-black-10 dark:bg-gray-900 p-1 flex items-center justify-around">
                                            <img src="/img/tehnalogi/python.svg" alt="Python" />
                                        </div>
                                        <section className="flex flex-col gap-0.5">
                                            <h3 className="text-xs font-bold text-[var(--color-text)] ">
                                                Python
                                            </h3>
                                            <h4 className="text-[9px] text-[var(--color-text)] ">
                                                Широко используется для веб-разработки, анализа
                                                данных, автоматизации, ИИ и др.
                                            </h4>
                                        </section>
                                        <section className="relative">
                                            <div className="relative size-10">
                                                <svg
                                                    className="rotate-[-90deg] size-full"
                                                    viewBox="0 0 36 36"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-[var(--color-text)] dark:text-neutral-700"
                                                        strokeWidth="2"
                                                        strokeDasharray="100 100"
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-green-500 dark:text-green-500"
                                                        strokeWidth="3"
                                                        strokeDasharray="100 100"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute top-1/2 -mt-0.5 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-500">
                                                        100
                                                    </span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>

                                    {/* JavaScript */}
                                    <section className="flex items-center max-w-96 gap-3 border border-transparent bg-[var(--bg-02)] dark:bg-st-white-T10 dark:border-st-gray-90 p-2 rounded-xl shadow-lg absolute top-16 -right-4 left-4 rotate-3">
                                        <div className="w-12 h-12 min-w-12 rounded-lg bg-st-black-10 dark:bg-gray-900 p-1 flex items-center justify-around">
                                            <img
                                                src="/img/tehnalogi/javascript.webp"
                                                alt="JavaScript"
                                            />
                                        </div>
                                        <section className="flex flex-col gap-0.5">
                                            <h3 className="text-xs font-bold text-[var(--color-text)] ">
                                                JavaScript
                                            </h3>
                                            <h4 className="text-[9px] text-[var(--color-text)] ">
                                                Язык для создания интерактивных веб-страниц
                                            </h4>
                                        </section>
                                        <section className="relative">
                                            <div className="relative size-10">
                                                <svg
                                                    className="rotate-[-90deg] size-full"
                                                    viewBox="0 0 36 36"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-gray-200 dark:text-neutral-700"
                                                        strokeWidth="2"
                                                        strokeDasharray="100 100"
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-green-500 dark:text-green-500"
                                                        strokeWidth="3"
                                                        strokeDasharray="75 100"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute top-1/2 -mt-0.5 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-500">
                                                        75
                                                    </span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>
                                    {/* C:\Users\Admin\Desktop\Новая папка\Skillboost\client\public\img\tehnalogi\csharp.svg */}
                                    {/* C# */}
                                    <section className="flex items-center max-w-96 gap-3 border border-transparent bg-[var(--bg-02)] dark:bg-st-white-T10 dark:border-st-gray-90 p-2 rounded-xl shadow-lg absolute top-[108px] left-0">
                                        <div className="w-12 h-12 min-w-12 rounded-lg bg-st-black-10 dark:bg-gray-900 p-1 flex items-center justify-around">
                                            <img src="/img/tehnalogi/csharp.svg" alt="C#" />
                                        </div>
                                        <section className="flex flex-col gap-0.5">
                                            <h3 className="text-xs font-bold text-[var(--color-text)] ">
                                                C#
                                            </h3>
                                            <h4 className="text-[9px] text-[var(--color-text)] ">
                                                Мощный и гибкий язык программирования
                                            </h4>
                                        </section>
                                        <section className="relative">
                                            <div className="relative size-10">
                                                <svg
                                                    className="rotate-[-90deg] size-full"
                                                    viewBox="0 0 36 36"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-gray-200 dark:text-neutral-700"
                                                        strokeWidth="2"
                                                        strokeDasharray="100 100"
                                                        strokeLinecap="round"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        className="stroke-current text-green-500 dark:text-green-500"
                                                        strokeWidth="3"
                                                        strokeDasharray="54 100"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute top-1/2 -mt-0.5 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-500">
                                                        54
                                                    </span>
                                                </div>
                                            </div>
                                        </section>
                                    </section>
                                </section>

                                {/* Кнопка “Подробнее” */}
                                <div className=" hidden sm:flex absolute justify-center w-full bottom-5 translate-y-20 group-hover/feature:translate-y-0 place-self-center transition-transform duration-[250ms] z-40">
                                    <Link
                                        to={"/baza_voprosov"}
                                        className="click-effect px-10 py-2.5 rounded-xl shadow-xl bg-st-green-90 text-white bg-[#049666] text-center font-semibold  text-sm"
                                        aria-label="Перейти к /baza_voprosov"
                                    >
                                        Подробнее
                                    </Link>
                                </div>
                            </section>

                            {/* Кнопка “Подробнее” на мобилке */}
                            <div className="flex sm:hidden justify-center w-full">
                                <Link
                                    to={"/baza_voprosov"}
                                    className="click-effect w-full py-2.5 rounded-xl shadow-xl bg-st-green-90 my-3 bg-[#049666] text-center font-semibold text-white text-sm"
                                    aria-label="Перейти к /baza_voprosov"
                                >
                                    Подробнее
                                </Link>
                            </div>
                        </section>
                    </section>
                </section>
                <section className=" flex flex-col gap-6 ">
                    <section className="flex flex-col gap-1 col-span-1">
                        <section className="group/feature relative flex flex-col p-7 bg-[var(--bg-03)] rounded-[20px] overflow-hidden border-[1px] border-[#4444]">
                            <header className="flex flex-col gap-2.5">
                                <h2 className="text-xl text-[var(--color-text)]  font-bold">
                                    Роадмапы
                                </h2>
                                <h3 className="text-sm text-[var(--color-text)] max-w-[300px]">
                                    Прокачивайте свои знания в роадмапах постепенно,
                                    отслеживайте свой прогресс
                                </h3>
                            </header>

                            <section className="mt-3">
                                <img src="/img/roadmaps-feature.svg" alt="" />
                            </section>

                            {/* Кнопка “Подробнее” */}
                            <div className=" hidden sm:flex absolute justify-center w-full bottom-5 translate-y-20 group-hover/feature:translate-y-0 place-self-center transition-transform duration-[250ms] z-40">
                                <Link
                                    to={"/roadmaps"}
                                    className="click-effect px-10 py-2.5 rounded-xl shadow-xl bg-st-green-90 text-white bg-[#049666] text-center font-semibold  text-sm"
                                    aria-label="Перейти к /roadmaps"
                                >
                                    Подробнее
                                </Link>
                            </div>
                        </section>

                        {/* Кнопка “Подробнее” на мобилке */}
                        <div className="flex sm:hidden justify-center w-full">
                        <Link
                                    to={"/roadmaps"}
                                className="click-effect w-full py-2.5 rounded-xl shadow-xl bg-st-green-90 my-3 bg-[#049666] text-center font-semibold text-white text-sm"
                                aria-label="Перейти к /roadmaps"
                            >
                                Подробнее
                            </Link>
                        </div>
                    </section>
                </section>
            </section>

            <section className="sm:flex gap-20">
                <section className="group/feature  w-full relative flex flex-col p-7 bg-[var(--bg-03)]  rounded-[20px] overflow-hidden border-[1px] border-[#4444]">
                    <header className="flex flex-col gap-2.5">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">
                            Задачи на код
                        </h2>
                        <h3 className="text-sm max-w-[300px] text-[var(--color-text)]">
                            Решайте задачи на код в нашей песочнице и проверяйте свои навыки
                            в программировании
                        </h3>
                    </header>

                    <section className="relative pt-52">
                        {/* Первая карточка */}
                        <section className="w-2/3 scale-90 flex flex-col gap-2 bg-[var(--bg-02)] shadow-md border p-4 rounded-2xl cursor-pointer dark:bg-st-white-T10 dark:border-st-gray-90 absolute top-9 left-0 md:top-9 md:left-14">
                            <section className="flex justify-between items-center">
                                <section className="flex items-center gap-2 text-[var(--color-text)]">
                                    12. Объединение интервалов
                                </section>
                            </section>
                            <section className="flex gap-2">
                                <span className="py-[1px] px-2 text-sm rounded-full flex items-center w-fit cursor-default bg-st-error-T250 text-st-error-50 dark:bg-st-error-T300">
                                    <div className="bg-[#EF4643] rounded-full w-1.5 h-1.5 mr-[7px]"></div>
                                    <span className="text-[var(--color-text)]">Сложная</span>
                                </span>
                                <div className="tooltip">
                                    <section className="flex flex-wrap border-none  rounded-3xl">
                                        <button
                                            className="!text-sm text-[var(--color-text)] cursor-default dark:!bg-st-white-T10 dark:!text-st-gray-20 !pr-0.5 py-[5px] flex items-center rounded-full px-2 text-center border bg-[var(--bg-02)] hover:shadow dark:border-transparent dark:bg-surface-900 transition-all"
                                            disabled
                                        >
                                            Яндекс
                                            <span className="text-xs text-gray-500 dark:text-st-gray-20 ml-3 px-1.5 py-[1px] bg-st-gray-5 dark:bg-st-white-T10 rounded-full">
                                                +2
                                            </span>
                                        </button>
                                    </section>
                                </div>
                                <div className="tooltip">
                                    <div className="rounded-full bg-st-gray text-[#87898F] py-[1px] px-3 text-sm dark:bg-st-white-T10 dark:text-st-gray-20">
                                        70%
                                    </div>
                                </div>
                            </section>
                        </section>

                        {/* Вторая карточка */}
                        <section className="w-2/3 scale-90 flex flex-col gap-2 bg-[var(--bg-02)] shadow-md border p-4 rounded-2xl cursor-pointer dark:bg-st-white-T10 dark:border-st-gray-90 absolute top-[120px] -left-5 md:top-24 -rotate-3">
                            <section className="flex justify-between items-center">
                                <section className="flex items-center gap-2 text-[var(--color-text)]">
                                    78. Сумма двух
                                </section>
                            </section>
                            <section className="flex gap-2">
                                <span className="py-[1px] px-2 text-sm rounded-full flex items-center w-fit cursor-default bg-st-green-T250 text-st-green-150 dark:bg-st-green-T300">
                                    <div className="bg-[#27AE60] rounded-full w-1.5 h-1.5 mr-[7px]"></div>
                                    <span className="text-[var(--color-text)]">Легкая</span>
                                </span>
                                <div className="tooltip">
                                    <section className="flex flex-wrap border-none  rounded-3xl">
                                        <button
                                            className="!text-sm text-[var(--color-text)] cursor-default dark:!bg-st-white-T10 dark:!text-st-gray-20 py-[5px] flex items-center rounded-full px-2 text-center border bg-[var(--bg-02)] hover:shadow dark:border-transparent dark:bg-surface-900  transition-all"
                                            disabled
                                        >
                                            Яндекс
                                        </button>
                                    </section>
                                </div>
                                <div className="tooltip">
                                    <div className="rounded-full bg-st-gray text-[#87898F] py-[1px] px-3 text-sm dark:bg-st-white-T10 dark:text-st-gray-20">
                                        89%
                                    </div>
                                </div>
                            </section>
                        </section>

                        {/* Блок с кодом */}
                        <section className="w-96 shadow-md absolute top-2 -right-48 md:-top-5 md:-right-14 z-10">
                            <header className="flex gap-1.5 p-3.5 rounded-t-2xl bg-st-green-90 dark:bg-[#049666]">
                                <div className="p-[6px] bg-white rounded-full"></div>
                                <div className="p-[6px] bg-white rounded-full"></div>
                                <div className="p-[6px] bg-white rounded-full"></div>
                            </header>
                            <section className="p-3 border border-transparent dark:border-l-st-gray-90 bg-[var(--bg-02)] dark:bg-st-white-T10">
                                {[...Array(10)].map((_, i) => (
                                    <div className="group w-full flex items-stretch" key={i}>
                                        <div className="px-2 py-0.5 text-xs group-hover:bg-[#eaebec] dark:group-hover:bg-[#2d343d]">
                                            {i + 1}
                                        </div>
                                        <div className="w-full py-0.5 text-xs text-st-black text-[var(--color-text)] group-hover:bg-[#f6f6f7] dark:group-hover:bg-[#2d343d]">
                                            <pre>{getCodeLine(i)}</pre>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        </section>
                    </section>

                    {/* Кнопка "Подробнее" */}
                    <div className="hidden sm:flex absolute justify-center w-full bottom-5 translate-y-20 group-hover/feature:translate-y-0 place-self-center transition-transform duration-[250ms] z-40">
                        <Link
                            to={"/coding"}
                            className="click-effect px-10 py-2.5 rounded-xl shadow-xl bg-st-green-90 text-white bg-[#049666] text-center font-semibold  text-sm"
                        >
                            Подробнее
                        </Link>
                    </div>
                </section>
                <div className="flex sm:hidden justify-center w-full">
                    <Link
                        to={"/coding"}
                        className="click-effect w-full py-2.5 rounded-xl shadow-xl bg-st-green-90 my-3 bg-[#049666] text-center font-semibold text-white text-sm"
                        aria-label="Перейти к /coding"
                    >
                        Подробнее
                    </Link>
                </div>
                <section className="group/feature sm:w-[45%] relative flex flex-col p-7 bg-[var(--bg-03)]  rounded-[20px] overflow-hidden border-[1px] border-[#4444]">
                    <header className="flex flex-col gap-2.5">
                        <h2 className="text-xl font-bold text-[var(--color-text)]">
                            Тренажер собеседований
                        </h2>
                        <h3 className="text-sm max-w-[300px] text-[var(--color-text)]">
                            Отвечай на вопросы и получи аналитику по собеседованию. Найди
                            свои слабые и сильные места
                        </h3>
                    </header>

                    <section className="w-full relative gap-1 pt-52">
                        {/* Собеседование #12 */}
                        <section className="px-2 py-3 flex flex-col gap-2.5 bg-[var(--bg-03)] dark:bg-st-white-T10 border-[1px] border-st-gray-5 dark:border-st-gray-90 rounded-xl w-[190px] shadow-xl absolute top-6 right-10">
                            <header className="flex flex-col gap-0.5">
                                <h3 className="font-bold text-xs text-[var(--color-text)]">
                                    Собеседование #12
                                </h3>
                                <h4 className="text-[9px] text-[var(--color-text)]">
                                    Frontend
                                </h4>
                            </header>

                            <section className="flex flex-col gap-2">
                                <header className="flex gap-1 items-center">
                                    <img
                                        src="/img/tehnalogi/javascript.webp"
                                        alt="JavaScript"
                                        width="12"
                                        height="12"
                                    />
                                    <h4 className="text-[8px] text-[var(--color-text)]">
                                        JavaScript
                                    </h4>
                                </header>
                                <section className="flex flex-col gap-1">
                                    <p className="text-[10px] text-[var(--color-text)]">
                                        Отвечено 7/14 вопросов
                                    </p>
                                    <div className="w-full flex h-1 bg-gray-300 rounded-full overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full"
                                            style={{ width: "50%" }}
                                        />
                                        <div
                                            className="bg-red-500 h-full"
                                            style={{ width: "14.285714285714285%" }}
                                        />
                                    </div>
                                </section>
                            </section>

                            <div className="w-fit place-self-end rounded-xl bg-st-green-90 text-[var(--color-text)] text-[8px] py-2 px-3">
                                Пройти собеседование
                            </div>
                        </section>

                        {/* Собеседование #7 */}
                        <section className="px-2 py-3 flex flex-col gap-2.5 bg-[var(--bg-03)] dark:bg-st-white-T10 border-[1px] border-st-gray-5 dark:border-st-gray-90 rounded-xl w-[190px] shadow-xl absolute top-[70px] -right-3">
                            <header className="flex flex-col gap-0.5">
                                <h3 className="font-bold text-xs text-[var(--color-text)]">
                                    Собеседование #7
                                </h3>
                                <h4 className="text-[9px] text-[var(--color-text)]">
                                    Backend
                                </h4>
                            </header>

                            <section className="flex flex-col gap-2">
                                <header className="flex gap-1 items-center">
                                    <img
                                        src="/img/tehnalogi/python.svg"
                                        alt="Python"
                                        width="12"
                                        height="12"
                                    />
                                    <h4 className="text-[8px] text-[var(--color-text)]">
                                        Python
                                    </h4>
                                </header>
                                <section className="flex flex-col gap-1">
                                    <p className="text-[10px] text-[var(--color-text)]">
                                        Отвечено 7/14 вопросов
                                    </p>
                                    <div className="w-full flex h-1 bg-gray-300 rounded-full overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full"
                                            style={{ width: "50%" }}
                                        />
                                        <div
                                            className="bg-red-500 h-full"
                                            style={{ width: "14.285714285714285%" }}
                                        />
                                    </div>
                                </section>
                            </section>

                            <div className="w-fit place-self-end rounded-xl bg-st-green-90 text-[var(--color-text)] text-[8px] py-2 px-3">
                                Пройти собеседование
                            </div>
                        </section>
                    </section>

                    {/* Кнопка "Подробнее" */}
                    <div className="hidden sm:flex absolute justify-center w-full bottom-5 translate-y-20 group-hover/feature:translate-y-0 place-self-center transition-transform duration-[250ms] z-40">
                        <Link
                            to={"/startInterview"}
                            className="click-effect px-10 py-2.5 rounded-xl shadow-xl bg-st-green-90 text-white bg-[#049666] text-center font-semibold  text-sm"
                            aria-label="Перейти к /startInterview"
                        >
                            Подробнее
                        </Link>
                    </div>
                </section>
                <div className="flex sm:hidden justify-center w-full">
                    <Link
                        to={"/startInterview"}
                        className="click-effect w-full py-2.5 rounded-xl shadow-xl bg-st-green-90 my-3 bg-[#049666] text-center font-semibold text-white text-sm"
                        aria-label="Перейти к /startInterview"
                    >
                        Подробнее
                    </Link>
                </div>
            </section>
        </>
    )
}

function getCodeLine(i) {
    const codeLines = [
        "int* arr = (int*) malloc(len * sizeof(int));",
        "for (int i = 0; i < len; i++) {",
        "\t arr[i] = 0;",
        "}",
        "for (int i = 0; i < len; i++) {",
        "\t arr[i] += 1;",
        "}",
        "",
        "",
        "",
    ];
    return codeLines[i] || "";
}


export default FeaturesSection