'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from '@/components/ui/button';

export default function PlanningPage() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full h-full p-8 bg-sakura-bg dark:bg-gray-900 overflow-y-auto">
      <style>{`
        .rdp {
          --rdp-cell-size: 45px;
          --rdp-caption-font-size: 1.2rem;
          --rdp-background-color: transparent;
          --rdp-accent-color: #FF8FAB;
          --rdp-accent-color-dark: #FF8FAB;
          --rdp-foreground-color: #5B5052;
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 3px solid var(--rdp-accent-color);
          margin: 1em auto;
        }
        .dark .rdp {
           --rdp-foreground-color: #e5e7eb;
           --rdp-background-color: transparent;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
            background-color: #FFF5F7;
        }
        .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
            background-color: rgba(255, 143, 171, 0.1);
        }
      `}</style>
      <div className="max-w-2xl mx-auto text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-sakura-accent" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-sakura-text dark:text-white sm:text-5xl">
          Plan Your Success
        </h1>
        <p className="mt-6 text-lg leading-8 text-sakura-text/80 dark:text-gray-300">
          Select a day to view or add your goals. Stay organized and on top of your tasks.
        </p>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-8 flex flex-col items-center justify-center">
            <DayPicker
              mode="single"
              selected={selectedDay}
              onSelect={setSelectedDay}
              showOutsideDays
              fixedWeeks
              className="text-sakura-text dark:text-gray-200"
            />
            {selectedDay && (
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg text-sakura-accent">
                  Tasks for: {selectedDay.toLocaleDateString()}
                </p>
                <div className="mt-4 text-left p-4 bg-sakura-bg dark:bg-gray-700/50 rounded-lg w-full max-w-md">
                   {/* Placeholder for tasks */}
                   <p className="text-sm text-sakura-text/70 dark:text-gray-400">No tasks for this day yet.</p>
                   <Button size="sm" className="mt-4">Add Task</Button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
} 