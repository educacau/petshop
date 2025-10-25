import {useMemo} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import clsx from 'clsx';

import type {Schedule} from '../../../types';
import {Badge} from '../../../ui/atoms/Badge';
import {Text} from '../../../ui/atoms/Text';

type ScheduleCalendarProps = {
  schedules: Schedule[];
  currentDate: Dayjs;
  viewMode: 'week' | 'day';
};

const START_HOUR = 6;
const END_HOUR = 21;
const HOUR_HEIGHT = 64; // px
const SLOT_HEIGHT = HOUR_HEIGHT / 2; // 30 min slots
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2;
const DEFAULT_DURATION_MINUTES = 60;

const statusBadgeTone: Record<Schedule['status'], React.ComponentProps<typeof Badge>['tone']> = {
  SCHEDULED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger'
};

const statusLabel: Record<Schedule['status'], string> = {
  SCHEDULED: 'Agendado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado'
};

type CalendarEvent = {
  schedule: Schedule;
  top: number;
  height: number;
};

const buildDays = (date: Dayjs, viewMode: 'week' | 'day') => {
  if (viewMode === 'day') {
    return [date.startOf('day')];
  }

  const startOfWeek = date.startOf('week');
  return Array.from({length: 7}, (_, idx) => startOfWeek.add(idx, 'day'));
};

export const ScheduleCalendar = ({schedules, currentDate, viewMode}: ScheduleCalendarProps) => {
  const days = useMemo(() => buildDays(currentDate, viewMode), [currentDate, viewMode]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    days.forEach(day => map.set(day.format('YYYY-MM-DD'), []));

    const dayStart = (day: Dayjs) => day.startOf('day').add(START_HOUR, 'hour');
    const dayEnd = (day: Dayjs) => day.startOf('day').add(END_HOUR, 'hour');

    schedules.forEach(schedule => {
      const start = dayjs(schedule.scheduledAt);
      const dayKey = start.format('YYYY-MM-DD');
      const slots = map.get(dayKey);

      if (!slots) {
        return;
      }

      const slotStart = dayStart(dayjs(dayKey));
      const slotEnd = dayEnd(dayjs(dayKey));

      if (start.isAfter(slotEnd)) {
        return;
      }

      const minutesFromStart = Math.max(0, start.diff(slotStart, 'minute'));
      const heightMinutes = DEFAULT_DURATION_MINUTES;
      const height = Math.max((heightMinutes / 60) * HOUR_HEIGHT, 36);

      slots.push({
        schedule,
        top: (minutesFromStart / 60) * HOUR_HEIGHT,
        height
      });
    });

    return map;
  }, [days, schedules]);

  const now = dayjs();
  const gridTemplateColumns = `72px repeat(${days.length}, minmax(0, 1fr))`;

  return (
    <div className="overflow-auto rounded-2xl border border-border bg-surface-elevated shadow-soft">
      <div
        className="sticky top-0 z-30 grid border-b border-border bg-surface-muted/80 backdrop-blur"
        style={{gridTemplateColumns}}
      >
        <div className="h-full px-4 py-3 text-xs font-semibold uppercase tracking-wide text-content-muted">
        </div>
        {days.map(day => {
          const isToday = day.isSame(now, 'day');
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'flex h-full flex-col gap-1 px-4 py-3 text-sm font-medium uppercase tracking-wide',
                isToday ? 'text-primary' : 'text-content-muted'
              )}
            >
              <span>{day.format('ddd')}</span>
              <span className="text-xs normal-case text-content">{day.format('DD/MM')}</span>
            </div>
          );
        })}
      </div>

      <div className="grid" style={{gridTemplateColumns}}>
        <div className="relative border-r border-border" style={{height: TOTAL_SLOTS * SLOT_HEIGHT}}>
          <div className="absolute inset-0">
            {Array.from({length: TOTAL_SLOTS}).map((_, index) => {
              const isHour = index % 2 === 0;
              const hourLabel =
                isHour && `${String(START_HOUR + index / 2).padStart(2, '0')}:00`;

              return (
                <div
                  key={index}
                  className={clsx(
                'relative border-t border-border/70',
                    index % 4 === 0 ? 'bg-surface' : 'bg-surface-muted/40'
                  )}
                  style={{height: SLOT_HEIGHT}}
                >
                  {hourLabel && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-content-muted">
                      {hourLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {days.map(day => {
          const dayKey = day.format('YYYY-MM-DD');
          const events = eventsByDay.get(dayKey) ?? [];
          const isToday = day.isSame(now, 'day');
          const slotStart = day.startOf('day').add(START_HOUR, 'hour');
          const minutesNow = now.diff(slotStart, 'minute');
          const showNowLine = isToday && minutesNow >= 0 && minutesNow <= (END_HOUR - START_HOUR) * 60;
          const nowTop = (minutesNow / 60) * HOUR_HEIGHT;

          return (
            <div
              key={dayKey}
              className="relative border-l border-border"
              style={{height: TOTAL_SLOTS * SLOT_HEIGHT}}
            >
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({length: TOTAL_SLOTS}).map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                    'border-t border-border/60',
                      index % 4 === 0 ? 'bg-surface' : 'bg-surface-muted/40',
                      isToday && 'bg-primary-soft/10'
                    )}
                    style={{height: SLOT_HEIGHT}}
                  />
                ))}
              </div>

              {showNowLine && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-30 flex items-center"
                  style={{top: nowTop}}
                >
                  <div className="h-2 w-2 rounded-full border-2 border-background bg-primary shadow-soft" />
                  <div className="h-px flex-1 bg-primary" />
                </div>
              )}

              {events.map(({schedule, top, height}) => (
                <div
                  key={schedule.id}
                  className={clsx(
                    'absolute left-1 right-1 z-20 space-y-1 rounded-xl border border-primary-soft bg-primary-soft/80 p-2 shadow-soft transition hover:z-30 hover:shadow-lg',
                    schedule.status === 'CANCELLED' && 'border-danger/60 bg-danger/15',
                    schedule.status === 'COMPLETED' && 'border-success/60 bg-success/15'
                  )}
                  style={{top, height}}
                >
                  <Text size="sm" weight="medium" className="truncate text-content-strong">
                    {schedule.pet?.name ?? 'Pet nao informado'}
                  </Text>
                  <Text size="sm" tone="muted" className="text-xs">
                    {dayjs(schedule.scheduledAt).format('HH:mm')} • {schedule.serviceType.replace('_', ' ')}
                  </Text>
                  <Badge tone={statusBadgeTone[schedule.status]}>{statusLabel[schedule.status]}</Badge>
                  {schedule.customer?.name && (
                    <Text size="sm" tone="muted" className="truncate text-xs">
                      {schedule.customer.name}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
