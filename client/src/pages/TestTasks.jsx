import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { specialties } from '../shared/data/testTaskData'; 
import { testTaskApi } from '../shared/api/testTaskApi'; 
import { Link } from "react-router-dom";

const TestTasks = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [maxHeight, setMaxHeight] = useState('60px');
  const contentRef = useRef(null);

 
  const { data: testTasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['test-tasks'],
    queryFn: () => testTaskApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });


  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setMaxHeight(expanded ? `${scrollHeight}px` : '60px');
    }
  }, [expanded, testTasks]);

  const hendlSpecialty = (name) => {
    setSelectedSpecialty(name);
  };


  const countSpecialts = useMemo(() => {
    return specialties.map((spec) => ({
      ...spec,
      count: testTasks.filter(task => task.specialty === spec.name).length
    }));
  }, [testTasks]);


  const filteredTasks = useMemo(() => {
    return selectedSpecialty && selectedSpecialty !== 'all'
      ? testTasks.filter(task => task.specialty === selectedSpecialty)
      : testTasks;
  }, [testTasks, selectedSpecialty]);

  const totalCount = testTasks.length;


  if (isTasksLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-400">Загрузка тестовых заданий...</div>;
  }

  return (
    <div className='text-[var(--color-text)]'>
      <h1 className="lg:text-3xl text-2xl font-bold">Тестовые задания</h1>
      <div className="flex flex-col  rounded-2xl  pt-4 pb-2 w-full bg-[var(--bg-02]">
        <header className="flex justify-between">
          <h3 className="font-semibold text-xl">Выберите специальность</h3>
          <div className="flex flex-wrap">
            <button
              onClick={() => hendlSpecialty("all")}
              className={`${selectedSpecialty === 'all' ? 'bg-[var(--bg-04)] text-[var(--bg-02)]' : ''} py-[5px] flex items-center rounded-full px-2 text-center border hover:shadow transition-all`}
            >
              Все
              <span className="text-xs text-gray-500 ml-3 px-1.5 py-[1px] bg-gray-100 rounded-full transition-colors">
                {totalCount}
              </span>
            </button>
          </div>
        </header>

        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ maxHeight: maxHeight }}
        >
          <div ref={contentRef} className="flex gap-2 flex-wrap py-2 px-1">
            {countSpecialts.map((spec) => (
              <button
                key={spec.name}
                onClick={() => hendlSpecialty(spec.name)}
                className={`${spec.name == selectedSpecialty ? 'bg-[var(--bg-04)] text-[var(--bg-02)]' : ''} py-[5px] flex items-center rounded-full px-2 text-center border hover:shadow transition-all`}
              >
                {spec.icon && (
                  <span className="flex mr-1 bg-gray-100 rounded-full p-1 min-w-6 min-h-6 items-center justify-around">
                    <img src={spec.icon} alt={spec.name} width="16" height="16" />
                  </span>
                )}
                {spec.name}
                <span className="text-xs text-gray-500 ml-3 px-1.5 py-[1px] bg-gray-100 rounded-full transition-colors">
                  {spec.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-3 mt-2 w-fit mx-auto hover:scale-105 transition-transform duration-300"
        >
          {expanded ? "Свернуть" : "Развернуть"}
          <svg
            width="14"
            height="15.08"
            viewBox="0 0 13 14"
            className="transition-transform duration-300"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <g fill="none">
              <path
                d="M6.5 14.0016L0.5 8.00156L1.9 6.60156L6.5 11.1766L11.1 6.60156L12.5 8.00156L6.5 14.0016ZM6.5 8.00156L0.5 2.00156L1.9 0.601562L6.5 5.17656L11.1 0.601562L12.5 2.00156L6.5 8.00156Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
      </div>

      <div className='mt-4'>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <section
              key={task.id || task._id}
              className="relative w-full flex flex-col p-4 my-4 gap-4 rounded-2xl cursor-pointer border border-gray-700 shadow transition-colors"
            >
              <header className="flex flex-col gap-1">
                <section className="flex justify-between text-sm">
                  <p>
                    <span className="font-medium">{task.company}</span>
                  </p>
                </section>
                <Link to={`/test-tasks/${task.id || task._id}`}>
                  <h2 className="font-semibold hover:text-[var(--color-main)] transition-colors">
                    {task.title}
                  </h2>
                </Link>
              </header>
              <section className="flex justify-between items-center">
                <section className="flex items-end gap-1">
                  <span className="text-xs text-gray-500">{task.difficulty}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{task.tech}</span>
                </section>
                <p className="text-xs">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Дата не указана'}
                </p>
              </section>
            </section>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">Ничего не найдено</p>
            <p className="text-sm mt-2">Попробуйте выбрать другую специальность</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestTasks;