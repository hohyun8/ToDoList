import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar({ tasks, onEditTaskClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month Names (Korean)
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Helper: Get number of days in the month
  const getDaysInMonth = (y, m) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Helper: Get first day of the week for the month (0 = Sun, 6 = Sat)
  const getFirstDayOfMonth = (y, m) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  // Build Calendar Cells
  const calendarCells = [];

  // 1. Previous month overlapping cells
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const cellDate = new Date(year, month - 1, day);
    calendarCells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: false,
      dateString: cellDate.toISOString().slice(0, 10)
    });
  }

  // 2. Current month cells
  const todayString = new Date().toISOString().slice(0, 10);
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const cellDate = new Date(year, month, day);
    calendarCells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: cellDate.toISOString().slice(0, 10) === todayString,
      dateString: cellDate.toISOString().slice(0, 10)
    });
  }

  // 3. Next month overlapping cells (fill grid to multiple of 7, maximum 42 cells)
  const totalCells = calendarCells.length;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remainingCells; day++) {
    const cellDate = new Date(year, month + 1, day);
    calendarCells.push({
      date: cellDate,
      dayNumber: day,
      isCurrentMonth: false,
      dateString: cellDate.toISOString().slice(0, 10)
    });
  }

  // Filter tasks with valid due dates
  const getTasksForDate = (dateString) => {
    return tasks.filter(task => task.dueDate === dateString);
  };

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="calendar-wrapper">
      <div className="page-header">
        <div className="page-title">
          <h1>학사 일정 및 마감 캘린더</h1>
          <p>마감일이 지정된 할 일들이 달력에 표시됩니다. 일정을 한눈에 파악하세요.</p>
        </div>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="calendar-header">
          <div className="calendar-title">
            <CalendarIcon size={22} className="color-primary" />
            <span>{year}년 {monthNames[month]}</span>
          </div>
          <div className="calendar-nav-btns">
            <button className="btn btn-secondary" onClick={handleGoToday} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              오늘
            </button>
            <button className="action-btn" onClick={handlePrevMonth} title="이전 달">
              <ChevronLeft size={20} />
            </button>
            <button className="action-btn" onClick={handleNextMonth} title="다음 달">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Weekday labels */}
          {weekdays.map((day, i) => (
            <div key={day} className="calendar-day-label" style={{
              color: i === 0 ? 'var(--danger)' : i === 6 ? 'var(--info)' : 'var(--text-secondary)'
            }}>
              {day}
            </div>
          ))}

          {/* Date cells */}
          {calendarCells.map((cell, index) => {
            const dayTasks = getTasksForDate(cell.dateString);
            const isSunday = cell.date.getDay() === 0;
            const isSaturday = cell.date.getDay() === 6;

            return (
              <div
                key={index}
                className={`calendar-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today' : ''}`}
              >
                <span
                  className="calendar-date-number"
                  style={{
                    color: cell.isToday ? 'white' : isSunday ? 'var(--danger)' : isSaturday ? 'var(--info)' : 'var(--text-primary)'
                  }}
                >
                  {cell.dayNumber}
                </span>

                {/* Event badges */}
                <div className="calendar-events">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`calendar-event-pill ${
                        task.completed ? 'color-success' :
                        task.priority === 'High' ? 'color-danger' :
                        task.priority === 'Medium' ? 'color-warning' : 'color-primary'
                      }`}
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1
                      }}
                      onClick={() => onEditTaskClick(task)}
                      title={`[${task.className}] ${task.title}`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
