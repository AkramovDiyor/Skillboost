import React, { useRef } from 'react';

const mentors = [
  {
    name: 'Кольцов Алексей',
    image: 'https://7efaf40e-9773-4d49-9fd7-20d5d05d2563.selstorage.ru/img/PzECCEKde4LkaRcM.jpg',
    description: `🙋‍♂️Опыт в IT:

• 6 лет опыта разработки на Python
• Работал в Стартапе, Ростехнадзоре, Гринатом, Admitad Mitgo, Kamaz Digital
• Руководитель разработки (8 человек)
• 150+ собеседований (от backend до CTO)
• НИЯУ МИФИ — физика

🚀 Почему Я?
🔹 Оффер с трудоустройством
🔹 Регулярные собеседования в топ РФ
🔹 Нанял 10+ сотрудников, 50+ собеседований
🔹 Стек: PostgreSQL, MongoDB, Docker и др.`,
    skills: ['Python', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Git'],
    price: 'от 7 000 ₽',
    link: '/mentors/AlexeyKoltsov'
  },
  {
    name: 'Тимур Яйкаров',
    image: 'https://7efaf40e-9773-4d49-9fd7-20d5d05d2563.selstorage.ru/img/xF44uiv14rNOgOG6.jpg',
    description: `Senior python dev, 21 год. Помощь: найти первую работу, закрыть испытательный срок, прокачать soft/hard skills. Есть менторство до оффера.`,
    skills: ['Python', 'SQL', 'PostgreSQL', 'MongoDB', 'Docker', 'Git'],
    price: 'от 7 000 ₽',
    link: '/mentors/yaykarov'
  },
  {
    name: 'Орловский Станислав',
    image: 'https://7efaf40e-9773-4d49-9fd7-20d5d05d2563.selstorage.ru/img/KRH09i0pRFqk52Fx.jpg',
    description: `Backend dev в х5 Tech, код-ревьюер в Яндекс Практикуме, выступления на конференциях, наставник на курсах. Опыт: аутсорс и аутстафф.`,
    skills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'Redis'],
    price: 'от 3 500 ₽',
    link: '/mentors/orlovskiy'
  },
  {
    name: 'Орловский Станислав',
    image: 'https://7efaf40e-9773-4d49-9fd7-20d5d05d2563.selstorage.ru/img/KRH09i0pRFqk52Fx.jpg',
    description: `Backend dev в х5 Tech, код-ревьюер в Яндекс Практикуме, выступления на конференциях, наставник на курсах. Опыт: аутсорс и аутстафф.`,
    skills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'Redis'],
    price: 'от 3 500 ₽',
    link: '/mentors/orlovskiy'
  },
  {
    name: 'Орловский Станислав',
    image: 'https://7efaf40e-9773-4d49-9fd7-20d5d05d2563.selstorage.ru/img/KRH09i0pRFqk52Fx.jpg',
    description: `Backend dev в х5 Tech, код-ревьюер в Яндекс Практикуме, выступления на конференциях, наставник на курсах. Опыт: аутсорс и аутстафф.`,
    skills: ['Python', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'Redis'],
    price: 'от 3 500 ₽',
    link: '/mentors/orlovskiy'
  }
];

const MentorCard = ({ mentor }) => (
  <section className="flex relative min-w-[240px] md:min-w-[330px] md:w-1/3 rounded-[20px] bg-[var(--bg-02)] dark:bg-st-white-T5 p-5 flex-col justify-between">
    <header className="relative">
      <img
        className="object-cover w-[288px] h-[200px] rounded-t-xl"
        alt={`Аватар ментора ${mentor.name}`}
        src={mentor.image}
      />
    </header>
    <section className="flex flex-col gap-1">
      <h2 className="font-medium text-xl">{mentor.name}</h2>
      <h3 className="text-[#87898F] text-sm dark:text-gray-400 line-clamp-3">
        {mentor.description}
      </h3>
    </section>
    <section className="flex flex-wrap gap-1 my-3 dark:gap-2">
      {mentor.skills.map((skill, i) => (
        <div
          key={i}
          className="rounded bg-white  py-1 px-2 font-medium text-sm text-st-gray-60  dark:bg-transparent dark:ring-2 d text-[var(--color-text)] break-words"
        >
          {skill}
        </div>
      ))}
    </section>
    <section className="mt-auto flex flex-col gap-3">
      <section className="flex justify-between items-center gap-2 text-base font-semibold">
        <span>Стоимость: {mentor.price}</span>
      </section>
      <p className="text-[var(--color-text)] -mt-2 mb-2">  Первое занятие бесплатно</p>
      <div className="flex mt-3 justify-center">
        <a
          href={mentor.link}
          className="click-effect px-5 py-3 rounded-xl w-full bg-st-green-90 hover:text-white bg-[#049666] text-center font-semibold text-white"
        >
          Подробнее
        </a>
      </div>
    </section>
  </section>
);

export default function MentorsSection() {

  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth; // прокрутка на ширину видимой области
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };


  return (
    <section className="flex flex-col gap-3 sm:gap-4 w-full">
      <header className="flex flex-col gap-3 md:-mb-12">
        <h2 className="font-bold text-2xl sm:text-5xl text-[var(--color-text)]">Менторы</h2>
        <h3 className="text-gray-400 text-base font-normal sm:text-xl max-w-[500px]">
          Наши менторы помогут вам подготовиться к собеседованию в топовых компаниях
        </h3>
      </header>

      {/* Кнопки навигации */}
      <article className="hidden sm:flex place-self-end gap-2">
        <button
          onClick={() => scroll("left")}
          className="click-effect flex items-center justify-center w-10 h-10 border dark:border-st-gray-60 bg-[var(--bg-03)] cursor-pointer hover:bg-[var(--bg-02)]  dark:bg-st-white-T10 dark:hover:bg-st-white-T50 rounded-lg focus-visible:ring"
          aria-label="Предыдущий слайд"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="text-[#87898F] dark:text-st-gray-20"
            width="24"
            height="24"
          >
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 6L9 12L15 18" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="click-effect flex items-center justify-center w-10 h-10 border dark:border-st-gray-60 bg-[var(--bg-03)] cursor-pointer hover:bg-[var(--bg-02)] dark:bg-st-white-T10 dark:hover:bg-st-white-T50 rounded-lg focus-visible:ring"
          aria-label="Следующий слайд"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="text-[#87898F] rotate-180"
            width="24"
            height="24"
          >
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 6L9 12L15 18" />
          </svg>
        </button>
      </article>

      <div ref={carouselRef} className="flex gap-5 pb-4 sm:pb-0 overflow-x-auto sm:overflow-x-hidden scrollbar-hide mt-2">
        {mentors.map((mentor, index) => (
          <MentorCard key={index} mentor={mentor} />
        ))}
      </div>

      <footer className="flex justify-center items-center text-st-green-90 font-semibold mt-1">
        <a href="/mentors" className="border-3 border-[var(--color-main)] px-4 py-2 rounded-xl text-[var(--color-main)] hover:text-white hover:bg-[var(--color-main)] ">
          Все менторы
        </a>
      </footer>
    </section>
  );
}
