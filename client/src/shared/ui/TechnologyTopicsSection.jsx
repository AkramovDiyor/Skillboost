import React from 'react';
import { technologies } from '../data/technologies';
import { Link } from 'react-router-dom';



const TechnologyTopicsSection = () => {
  return (
    <section className=" sm:w-full mb-[50px] rounded-xl px-7 pt-10 pb-7 leading-10 bg-[linear-gradient(0deg,rgba(135,236,166,1)_0%,rgba(44,167,139,1)_100%)]">
      <h2 className="text-white font-bold text-2xl sm:text-[40px] mb-[52px]">
        Изучайте технологии в нашей базе вопросов
      </h2>
      <section className="flex gap-3 flex-wrap" aria-label="Список технологий">
        {technologies.map((tech, i) => (
          <Link
            key={i}
            to={tech.href}
            className="click-effect hover:bg-gray-200 h-9 bg-white rounded-full text-sm px-2 pl-2 pr-3 flex items-center justify-between gap-3"
            aria-labelledby={`topic-title-${i}`}
          >
            <div className="bg-st-green-90 w-7 h-7 flex justify-center items-center rounded-full">
              <img src={tech.img} alt="" />
              <span className="text-white text-xs font-bold">{tech.name[0]}</span>
            </div>
            <span id={`topic-title-${i}`} className="text-black">
              {tech.name}
            </span>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default TechnologyTopicsSection;