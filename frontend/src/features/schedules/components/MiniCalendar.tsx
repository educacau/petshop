import {useEffect, useMemo, useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import clsx from 'clsx';

import {Text} from '../../../ui/atoms/Text';

type MiniCalendarProps = {
  currentDate: Dayjs;
  onSelectDate: (date: Dayjs) => void;
};

type CalendarDay = {
  date: Dayjs;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

const weekdayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const buildCalendarDays = (visibleMonth: Dayjs, selectedDate: Dayjs): CalendarDay[] => {
  const start = visibleMonth.startOf('month').startOf('week');
  return Array.from({length: 42}, (_, index) => {
    const day = start.add(index, 'day');
    return {
      date: day,
      isCurrentMonth: day.isSame(visibleMonth, 'month'),
      isToday: day.isSame(dayjs(), 'day'),
      isSelected: day.isSame(selectedDate, 'day')
    };
  });
};

export const MiniCalendar = ({currentDate, onSelectDate}: MiniCalendarProps) => {
  const [visibleMonth, setVisibleMonth] = useState(currentDate.startOf('month'));

  useEffect(() => {
    setVisibleMonth(currentDate.startOf('month'));
  }, [currentDate]);

  const days = useMemo(() => buildCalendarDays(visibleMonth, currentDate), [visibleMonth, currentDate]);

  const handlePrevMonth = () => {
    setVisibleMonth(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setVisibleMonth(prev => prev.add(1, 'month'));
  };

  const handleSelect = (day: Dayjs) => {
    onSelectDate(day);
    setVisibleMonth(day.startOf('month'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border-muted text-content-muted transition hover:border-border"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Text size="sm" weight="medium" className="text-content-strong">
          {visibleMonth.format('MMMM YYYY')}
        </Text>
        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border-muted text-content-muted transition hover:border-border"
          aria-label="Proximo mes"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-content-muted">
        {weekdayLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map(day => (
          <button
            key={day.date.toISOString()}
            type="button"
            onClick={() => handleSelect(day.date)}
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-full transition',
              day.isSelected
                ? 'bg-primary text-primary-foreground shadow-soft'
                : day.isToday
                ? 'border border-primary text-primary'
                : day.isCurrentMonth
                ? 'text-content hover:bg-surface-muted/80'
                : 'text-content-muted hover:bg-surface-muted/60'
            )}
          >
            {day.date.date()}
          </button>
        ))}
      </div>
    </div>
  );
};
