import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionsApi } from "../../shared/api/questions";
import { bookmarksApi } from "../../shared/api/bookmarks";
import { SkeletonCard } from "../../shared/ui/Skeleton/SkeletonCard";
import { useSubscription } from "../../shared/hooks/useSubscription";
import QuestionCard from "../../entities/QuestionCard";

const LIMIT = 10;

function QuestionsPage() {
  const { tech } = useParams(); 
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [difficulty, setDifficulty] = useState(params.get("difficulty") || null);
  
  const [pendingQuestionId, setPendingQuestionId] = useState(null);
  
  const queryClient = useQueryClient(); 
  const { subscription } = useSubscription();
  const hasAccess = subscription?.isActive;

  const difficultyLevels = ["Стажёр", "Junior", "Middle", "Senior"];

  const { 
    data, 
    isLoading: isQuestionsLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['questions', tech, difficulty],
    queryFn: async ({ pageParam = 0 }) => {
      const query = new URLSearchParams({ tech, limit: LIMIT, skip: pageParam });
      if (difficulty) query.set("difficulty", difficulty);
      const { data } = await questionsApi.getByTech(query);
      return data; 
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore !== undefined) {
        return lastPage.hasMore ? allPages.length * LIMIT : undefined;
      }
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length * LIMIT;
    },
    staleTime: 1000 * 60 * 5, 
  });

  const questions = data?.pages.flatMap(page => 
    Array.isArray(page) ? page : (page.questions || [])
  ) || [];

  const { data: bookmarks = [], isLoading: isBookmarksLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const data = await bookmarksApi.getAll();
      return data.map(q => q._id); 
    },
    staleTime: 1000 * 60 * 5,
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: bookmarksApi.toggle,
    onMutate: async (newQuestionId) => {
      setPendingQuestionId(newQuestionId);
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });
      const previousBookmarks = queryClient.getQueryData(['bookmarks']) || [];
      
      if (previousBookmarks.includes(newQuestionId)) {
        queryClient.setQueryData(['bookmarks'], previousBookmarks.filter(id => id !== newQuestionId));
      } else {
        queryClient.setQueryData(['bookmarks'], [...previousBookmarks, newQuestionId]);
      }
      return { previousBookmarks };
    },
    onError: (err, newQuestionId, context) => {
      queryClient.setQueryData(['bookmarks'], context.previousBookmarks);
      alert("Не удалось обновить закладку. Попробуйте ещё раз.");
    },
    onSettled: () => {
      setPendingQuestionId(null);
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });

  // 👇 ОБНОВЛЕННАЯ ЛОГИКА: Переключение фильтра (вкл/выкл)
  const handleDifficultyClick = (level) => {
    const newParams = new URLSearchParams(search);
    
    if (difficulty === level) {
      // Если кликнули по уже активному уровню, сбрасываем фильтр
      setDifficulty(null);
      newParams.delete('difficulty');
    } else {
      // Иначе устанавливаем выбранный уровень
      setDifficulty(level);
      newParams.set('difficulty', level);
    }
    
    // Обновляем URL (replace: true, чтобы не засорять историю браузера лишними записями)
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const isBookmarked = (questionId) => bookmarks.includes(questionId);
  const isLoading = isQuestionsLoading || isBookmarksLoading;

  return (
    <div className="text-[var(--color-text)]">
      <Link to={"/baza_voprosov"} className="truncate">
        <button className="flex items-center gap-1 text-sm text-st-gray-60 cursor-pointer mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="iconify iconify--st-icons" width="1em" height="1em" viewBox="0 0 24 24" style={{ fontSize: "16px" }}>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 6l-6 6l6 6"></path>
          </svg>
          Вернуться к базе вопросов
        </button>
      </Link>

      <div>
        <h1 className="lg:text-5xl text-3xl font-bold mb-4">ТОП вопросов по {tech}</h1>
        <div className="text-xl">Подборка самых частых вопросов на собеседованиях {tech} разработчикам</div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <p className="text-md font-medium">Выберите грейд</p>
        <div className="flex items-center gap-2 flex-wrap">
          {difficultyLevels.map((level) => (
            <div 
              key={level}
              onClick={() => handleDifficultyClick(level)} 
              className={`rounded-2xl p-1 px-3 text-md cursor-pointer flex gap-1 items-center transition-colors ${
                difficulty === level ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--bg-03)] hover:bg-[var(--bg-02)]'
              }`}
            >
              <span>{level}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="relative w-full my-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-2 left-2 iconify iconify--ic" width="1em" height="1em" viewBox="0 0 24 24" style={{ fontSize: "32px" }}>
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"></path>
        </svg>
        <input
          type="text"
          className="p-inputtext p-component !px-10 w-full border border-[var(--color-border)] rounded-lg bg-[var(--bg-03)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          placeholder="Введите название или содержание вопроса"
        />
      </section>

      <div>
        <h2 className="text-2xl font-bold mb-4">Вопросы</h2>
         
        {isLoading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!isLoading && questions.length === 0 && (
          <p>Вопросов по выбранным фильтрам не найдено</p>
        )}

        {!isLoading && questions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
            isBookmarked={isBookmarked(question._id)}
            onToggleBookmark={() => toggleBookmarkMutation.mutate(question._id)}
            isPending={pendingQuestionId === question._id}
            hasAccess={hasAccess}
          />
        ))}

        <div className="flex justify-center mt-8 mb-12">
          {hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-8 py-3 bg-[var(--color-main)] text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Загрузка...
                </>
              ) : (
                "Показать еще"
              )}
            </button>
          ) : (
            questions.length > 0 && (
              <p className="text-gray-500 text-sm">Вы просмотрели все вопросы по этой теме 🎉</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;