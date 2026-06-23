import React from 'react'

export const SkeletonCard = () => {
  return (
    <section className="scroll-my-[75px] shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none dark:border dark:border-surface-500 w-full py-2 px-4 rounded-2xl my-4">
    <section className="relative w-full">
      <section className="flex flex-col gap-3 pt-4 pb-2">
        <section className="flex flex-col gap-2 text-sm">
          <header className="text-xl font-medium flex gap-2 items-center">
            <span className="min-w-[10px] min-h-[10px] inline-block rounded-full bg-gray-300 animate-pulse" />
            <section className="flex-1">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            </section>
            <section className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
          </header>

          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </section>

        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </section>
    </section>
  </section>
  )
}

