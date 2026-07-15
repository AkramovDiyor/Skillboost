import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { testTaskApi } from '../shared/api/testTaskApi'; // Убедись, что путь верный

const TestTaskCard = () => {
    const { id } = useParams();

    // --- ПОЛУЧЕНИЕ ДАННЫХ С СЕРВЕРА ---
    const { data: task, isLoading, isError } = useQuery({
        queryKey: ['test-task', id],
        queryFn: () => testTaskApi.getById(id),
        enabled: !!id, // Запрос пойдет только когда id существует
    });

    // --- СОСТОЯНИЯ ЗАГРУЗКИ И ОШИБОК ---
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen text-gray-400">Загрузка задания...</div>;
    }

    if (isError || !task) {
        return <div className="flex items-center justify-center h-screen text-gray-400">Задание не найдено</div>;
    }

    return (
        <div className='text-[var(--color-text)]'>
            <Link to={"/test-tasks"} className="truncate">
                <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 cursor-pointer mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="iconify iconify--st-icons"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        style={{ fontSize: "16px" }}
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 6l-6 6l6 6"
                        ></path>
                    </svg>
                    Тестовые задания
                </button>
            </Link>
            
            <section className="flex flex-col gap-2">
                {task.description && (
                    <>
                        <h3 className="font-bold text-xl mb-2">Задача</h3>
                        <p className="text-gray-400 mb-4">{task.company}</p>
                        <section className="overflow-auto">
                            <div className="text-base lg:text-xl leading-relaxed">
                                {task.description.split('\n').map((line, idx) => (
                                    // Уменьшил mb-10 до mb-4, чтобы текст не был слишком растянут
                                    <p key={idx} className="mb-4">
                                        {line || <br />}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </section>
        </div>
    );
}

export default TestTaskCard;