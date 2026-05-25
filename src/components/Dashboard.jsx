import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertCircle, GraduationCap, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { teacherQuotes } from '../utils/defaultTemplates';

export default function Dashboard({ tasks, classes, onEditTaskClick, setActiveTab }) {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    // Select a quote based on the day of the month so it changes daily but stays consistent during the day
    const day = new Date().getDate();
    const index = day % teacherQuotes.length;
    setQuote(teacherQuotes[index]);
  }, []);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Urgent tasks: Due today or tomorrow, and not completed
  const getUrgentTasks = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().slice(0, 10);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    return tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      (task.dueDate === todayStr || task.dueDate === tomorrowStr)
    );
  };

  const urgentTasks = getUrgentTasks();

  // Category counts
  const categoryCounts = tasks.reduce((acc, task) => {
    if (!task.completed) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = [
    { key: 'Lesson Prep', label: '수업 준비', colorClass: 'color-primary' },
    { key: 'Grading', label: '채점 및 평가', colorClass: 'color-success' },
    { key: 'Counseling', label: '학생 상담', colorClass: 'color-warning' },
    { key: 'Administrative', label: '행정 업무', colorClass: 'color-danger' },
    { key: 'Events', label: '행사 및 기타', colorClass: 'color-info' }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>교무 수첩 대시보드</h1>
          <p>오늘의 업무 현황과 할 일들을 한눈에 확인하고 관리하세요.</p>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="glass-card quote-card">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Quote size={32} style={{ opacity: 0.3, flexShrink: 0 }} />
          <div>
            <div className="quote-text">"{quote.text}"</div>
            <div className="quote-author">- {quote.author}</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon color-primary">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>진행 중인 업무</h3>
            <div className="stat-value">{activeTasks}건</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon color-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <h3>완료된 업무</h3>
            <div className="stat-value">{completedTasks}건</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon color-danger">
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>오늘/내일 마감</h3>
            <div className="stat-value">{urgentTasks.length}건</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon color-info">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <h3>관리 학급 수</h3>
            <div className="stat-value">{classes.length}개</div>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-sections */}
      <div className="dashboard-sections">
        {/* Left Side: Urgent tasks and Category distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Urgent Tasks */}
          <div className="glass-card section-card">
            <div className="section-header">
              <h2>긴급 업무 알림</h2>
              <span className="badge badge-priority-high">{urgentTasks.length}개 마감 임박</span>
            </div>
            
            {urgentTasks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem'
              }}>
                <CheckCircle2 size={36} style={{ color: 'var(--success)', margin: '0 auto 0.75rem', display: 'block' }} />
                오늘이나 내일 마감해야 할 긴급한 할 일이 없습니다. 좋은 하루 되세요!
              </div>
            ) : (
              <div className="task-list">
                {urgentTasks.map(task => (
                  <div key={task.id} className="task-item" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div className="task-content">
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span className="badge badge-class">{task.className}</span>
                        <span className="badge badge-date overdue">{task.dueDate} 마감</span>
                      </div>
                      <div className="task-title" style={{ fontSize: '1rem' }}>{task.title}</div>
                      {task.description && <div className="task-desc" style={{ marginBottom: 0 }}>{task.description}</div>}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => onEditTaskClick(task)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      관리하기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Status */}
          <div className="glass-card section-card">
            <div className="section-header">
              <h2>카테고리별 진행 중 업무</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {categories.map(cat => {
                const count = categoryCounts[cat.key] || 0;
                const percent = activeTasks > 0 ? Math.round((count / activeTasks) * 100) : 0;
                return (
                  <div key={cat.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat.label}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{count}건 ({percent}%)</span>
                    </div>
                    <div style={{
                      height: '8px',
                      backgroundColor: 'var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div className={cat.colorClass} style={{
                        height: '100%',
                        width: `${percent}%`,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width var(--transition-normal)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Overall progress ring or breakdown card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card section-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', fontSize: '1.15rem' }}>전체 달성도</h2>
            
            {/* SVG Progress Circle */}
            <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '1.5rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="transparent"
                  stroke="var(--border-color)"
                  strokeWidth="3.5"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="transparent"
                  stroke="var(--primary-color)"
                  strokeWidth="3.5"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset var(--transition-normal)' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>{completionRate}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 600 }}>완료율</div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              총 <strong>{totalTasks}개</strong>의 할 일 중 <strong>{completedTasks}개</strong>를 완료하였습니다.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => setActiveTab('tasks')}
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              할 일 목록 보기
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
