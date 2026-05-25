import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar as CalendarIcon, 
  GraduationCap, 
  Sparkles, 
  Download, 
  Upload, 
  Sun, 
  Moon, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import Calendar from './components/Calendar';
import ClassManager from './components/ClassManager';
import TemplateLibrary from './components/TemplateLibrary';

import { loadState, saveState, exportBackup, importBackup } from './utils/localStorage';
import { defaultClasses } from './utils/defaultTemplates';

export default function App() {
  // 1. Initial State Setup
  const [classes, setClasses] = useState(() => {
    return loadState('edutask_classes', defaultClasses);
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = loadState('edutask_tasks', null);
    if (savedTasks) return savedTasks;

    // Default mock tasks for first-time layout demonstration
    const today = new Date().toISOString().slice(0, 10);
    
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 3);
    const futureDate1Str = futureDate1.toISOString().slice(0, 10);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 5);
    const futureDate2Str = futureDate2.toISOString().slice(0, 10);

    return [
      {
        id: 'task_mock_1',
        title: '2026학년도 1학기 중간고사 문항 출제 및 검토',
        description: '동료 수학 교사와 공동 검토 후 보안 보관실에 지필시험 문제지를 제출합니다.',
        classId: 'cls_1',
        className: '1학년 1반 수학',
        category: 'Administrative',
        priority: 'High',
        dueDate: futureDate2Str,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: [
          { id: 'sub_mock_1', text: '이원목적분류표 작성', completed: true },
          { id: 'sub_mock_2', text: '평가 문항 20개 출제', completed: false },
          { id: 'sub_mock_3', text: '동료 교사 교차 검토 진행', completed: false }
        ],
        studentProgress: []
      },
      {
        id: 'task_mock_2',
        title: '과학 실험 보고서 채점 및 수행평가 성적 입력',
        description: '지난주 진행한 화학 반응 실험 보고서를 채점표 양식에 맞춰 검토하고 기록합니다.',
        classId: 'cls_2',
        className: '2학년 3반 과학',
        category: 'Grading',
        priority: 'High',
        dueDate: futureDate1Str,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: [
          { id: 'sub_mock_4', text: '보고서 최종 회수 확인', completed: true },
          { id: 'sub_mock_5', text: '성적 결과 대조 및 집계', completed: false }
        ],
        studentProgress: [
          { name: '박민재', completed: true },
          { name: '이하윤', completed: true },
          { name: '최서준', completed: false },
          { name: '김수아', completed: false },
          { name: '정주원', completed: false }
        ]
      },
      {
        id: 'task_mock_3',
        title: '기초 학력 부진 및 진로 관심 학생 상담 진행',
        description: '학습 태도 관찰 및 진로 검사 결과를 바탕으로 심층 개별면담을 진행합니다.',
        classId: 'cls_1',
        className: '1학년 1반 수학',
        category: 'Counseling',
        priority: 'Medium',
        dueDate: today,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: [
          { id: 'sub_mock_6', text: '상담 일지 양식 출력 및 작성', completed: false }
        ],
        studentProgress: [
          { name: '김민준', completed: false },
          { name: '이서연', completed: false }
        ]
      }
    ];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [editTask, setEditTask] = useState(null);
  
  // Theme management
  const [theme, setTheme] = useState(() => {
    return loadState('edutask_theme', 'light');
  });

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // 2. Synchronize States to LocalStorage
  useEffect(() => {
    saveState('edutask_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveState('edutask_classes', classes);
    // Update className in tasks if a class was renamed or deleted
    // For simplicity, we ensure className remains correct
  }, [classes]);

  useEffect(() => {
    saveState('edutask_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 3. Handlers
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleEditTaskClick = (task) => {
    setEditTask(task);
    setActiveTab('tasks');
    setMobileMenuOpen(false);
  };

  const handleExportBackup = () => {
    exportBackup(tasks, classes, []);
  };

  const handleImportBackupClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importBackup(file);
      if (window.confirm('기존 데이터가 백업 파일의 데이터로 대체됩니다. 계속하시겠습니까?')) {
        setTasks(data.tasks);
        setClasses(data.classes);
        alert('백업 데이터가 성공적으로 복원되었습니다.');
      }
    } catch (err) {
      alert(err.message || '데이터 복원 도중 오류가 발생했습니다.');
    }
    
    // Clear file selection
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectTab = (tabId) => {
    setActiveTab(tabId);
    setEditTask(null); // Clear editing task when switching tabs
    setMobileMenuOpen(false); // Close sidebar on mobile
  };

  // Render Component depending on Active Tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            tasks={tasks} 
            classes={classes} 
            onEditTaskClick={handleEditTaskClick} 
            setActiveTab={selectTab} 
          />
        );
      case 'tasks':
        return (
          <TaskManager 
            tasks={tasks} 
            setTasks={setTasks} 
            classes={classes} 
            editTask={editTask}
            setEditTask={setEditTask}
          />
        );
      case 'calendar':
        return (
          <Calendar 
            tasks={tasks} 
            onEditTaskClick={handleEditTaskClick} 
          />
        );
      case 'classes':
        return (
          <ClassManager 
            classes={classes} 
            setClasses={setClasses} 
          />
        );
      case 'templates':
        return (
          <TemplateLibrary 
            classes={classes} 
            onAddTask={handleAddTask} 
            setActiveTab={selectTab} 
          />
        );
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
            <BookOpen size={16} />
          </div>
          <span className="logo-text" style={{ fontSize: '1.05rem' }}>EduTask</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="logo-container">
          <div className="logo-icon">
            <BookOpen size={20} />
          </div>
          <span className="logo-text">EduTask</span>
        </div>

        <nav>
          <ul className="nav-links">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => selectTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                대시보드
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => selectTab('tasks')}
              >
                <ListTodo size={18} />
                할 일 목록
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
                onClick={() => selectTab('calendar')}
              >
                <CalendarIcon size={18} />
                일정 캘린더
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => selectTab('classes')}
              >
                <GraduationCap size={18} />
                학급/학생 관리
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
                onClick={() => selectTab('templates')}
              >
                <Sparkles size={18} />
                업무 템플릿
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? (
              <>
                <Moon size={16} />
                <span>다크 모드</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span>라이트 모드</span>
              </>
            )}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleExportBackup}
              title="데이터 백업 파일 저장"
              style={{ padding: '0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
            >
              <Download size={14} />
              백업
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleImportBackupClick}
              title="데이터 백업 파일 복원"
              style={{ padding: '0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
            >
              <Upload size={14} />
              복원
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileImport} 
            accept=".json" 
            style={{ display: 'none' }} 
          />
          
          <div style={{ 
            fontSize: '0.7rem', 
            color: 'var(--text-secondary)', 
            textAlign: 'center', 
            marginTop: '0.5rem' 
          }}>
            EduTask v1.0.0
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}
