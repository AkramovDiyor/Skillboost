import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdBookmark } from "react-icons/io";
import { BsBookmark } from "react-icons/bs";
import { FaLock } from 'react-icons/fa';

const QuestionCard = ({ question, isBookmarked, onToggleBookmark, isPending, hasAccess }) => {
    // Состояние открытия ответа теперь живет внутри каждой карточки отдельно!
    const [showAnswer, setShowAnswer] = useState(false);

    const isPremium = question.isPremium === true;
    const isLocked = isPremium && !hasAccess;

    const getDifficultyStyles = (difficulty) => {
        switch (difficulty) {
          case 'Стажёр':
            return {
              bg: 'bg-[#132C33]',
              text: 'text-[#2CC36B]',
              dot: 'bg-[#2CC36B]',
            };
          case 'Junior':
            return {
              bg: 'bg-[#3F2B26]',
              text: 'text-[#FE8901]',
              dot: 'bg-[#FE8901]',
            };
            case 'Middle':
                return {
                    bg: 'bg-[#0D2347]',
                    text: 'text-[#0085FF]',
                    dot: 'bg-[#0085FF]'
                }
            
            
          case 'Senior':
            return {
              bg: 'bg-[#311C30]',
              text: 'text-[#F05D5B]',
              dot: 'bg-[#F05D5B]',
            };
          default:
            return {
              dot: 'bg-gray-400',
              text: 'text-gray-400',
            };
        }
      };

    const styles = getDifficultyStyles(question.difficulty);

    return (
        <section className="scroll-my-[75px] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-surface-500 w-full py-2 px-4 rounded-2xl my-4 relative">
            <section className="relative w-full">
                <section className="flex flex-col gap-3 pt-4 pb-2">
                    <section className="flex flex-col gap-2 text-sm">
                        <header className="text-xl font-medium flex gap-2 items-center">
                            <span className="min-w-[10px] min-h-[10px] inline-block rounded-full bg-gray-300"></span>
                            <section className="flex items-center gap-2 relative support-selectable">
                                <h2 className="font-normal">{question.title}</h2>
                            </section>
                            <section className="relative inline-flex ml-auto">
                                <button
                                    onClick={onToggleBookmark}
                                    disabled={isPending} // Используем пропс, а не глобальную переменную
                                    aria-label="Добавить в избранное"
                                    className="relative flex items-center justify-center disabled:opacity-50 transition-opacity"
                                >
                                    {isBookmarked ? (
                                        <IoMdBookmark className="text-[20px] cursor-pointer text-[var(--color-main)]" />
                                    ) : (
                                        <BsBookmark className="text-[20px] cursor-pointer text-[var(--color-text)]" />
                                    )}
                                </button>
                            </section>
                        </header>

                        <div className={`flex items-center gap-1.5 ${styles.bg} p-1 px-2 rounded-xl sm:rounded-2xl w-fit`}>
                            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${styles.dot}`}></span>
                            <span className={`text-[10px] sm:text-sm font-medium ${styles.text}`}>
                                {question.difficulty || 'Без уровня'}
                            </span>
                        </div>
                        <div>
                            Рейтинг вопроса: <span className="font-medium">{question.rating}</span>
                        </div>
                    </section>

                    {/* Используем локальный showAnswer, а не visibleAnswerIndex */}
                    {showAnswer ? (
                        <div className="answer-box">
                            <p><strong>Ответ:</strong> {question.answer}</p>
                            <button
                                className="flex gap-1 items-center text-slate-500 dark:text-slate-400 hover:underline hover:decoration-1 hover:decoration-slate-300 hover:underline-offset-4 mt-2"
                                onClick={() => setShowAnswer(false)}
                            >
                                Скрыть ответ
                            </button>
                        </div>
                    ) : (
                        <button
                            className="flex gap-1 items-center text-slate-500 dark:text-slate-400 hover:underline hover:decoration-1 hover:decoration-slate-300 hover:underline-offset-4"
                            onClick={() => setShowAnswer(true)}
                        >
                            Показать ответ
                        </button>
                    )}
                </section>
            </section>

            {isLocked && (
                <div className="p-0 absolute inset-0 bg-[var(--bg-03)]/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                    <div className="flex flex-col items-center gap-3 text-center px-4">
                        <FaLock className="text-3xl text-[var(--tag-red-border)]" />
                        <p className="text-lg font-medium text-[var(--tag-red-border)]">
                            Вопрос доступен <Link to={'/subscription'} className="underline">по подписке</Link>
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default QuestionCard;