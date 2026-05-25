import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Edit, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckSquare, Square, CheckCircle, HelpCircle, Users } from 'lucide-react';

export default function TaskManager({ tasks, setTasks, classes, editTask, setEditTask }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority

  // Form State for Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add or edit

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formClassId, setFormClassId] = useState('');
  const [formCategory, setFormCategory] = useState('Lesson Prep');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formSubtasks, setFormSubtasks] = useState([]); // [{id, text, completed}]
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [selectedStudentNames, setSelectedStudentNames] = useState([]); // Selected student names for checklist

  useEffect(() => {
    if (editTask) {
      openEditModal(editTask);
    }
  }, [editTask]);


  // Expandable subtasks state: { taskId: boolean }
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleExpandTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setFormTitle('');
    setFormDesc('');
    setFormClassId('');
    setFormCategory('Lesson Prep');
    setFormPriority('Medium');
    setFormDueDate('');
    setFormSubtasks([]);
    setNewSubtaskText('');
    setSelectedStudentNames([]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setModalMode('edit');
    setEditTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormClassId(task.classId);
    setFormCategory(task.category);
    setFormPriority(task.priority);
    setFormDueDate(task.dueDate || '');
    setFormSubtasks(task.subtasks || []);
    setNewSubtaskText('');
    
    // Set student list
    const classObj = classes.find(c => c.id === task.classId);
    setSelectedStudentNames(task.studentProgress ? task.studentProgress.map(s => s.name) : []);
    
    setIsModalOpen(true);
  };

  // Handle Class change in form to pre-populate student checkboxes
  const handleFormClassChange = (classId) => {
    setFormClassId(classId);
    const classObj = classes.find(c => c.id === classId);
    if (classObj && classObj.students.length > 0) {
      setSelectedStudentNames([...classObj.students]);
    } else {
      setSelectedStudentNames([]);
    }
  };

  // Toggle student selection in form
  const toggleFormStudentSelection = (name) => {
    if (selectedStudentNames.includes(name)) {
      setSelectedStudentNames(selectedStudentNames.filter(n => n !== name));
    } else {
      setSelectedStudentNames([...selectedStudentNames, name]);
    }
  };

  // Add subtask in form
  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const newSt = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      text: newSubtaskText.trim(),
      completed: false
    };
    setFormSubtasks([...formSubtasks, newSt]);
    setNewSubtaskText('');
  };

  // Remove subtask in form
  const handleRemoveSubtask = (id) => {
    setFormSubtasks(formSubtasks.filter(st => st.id !== id));
  };

  // Save Task (Add or Edit)
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('할 일 제목을 입력해 주세요.');
      return;
    }

    const classObj = classes.find(c => c.id === formClassId) || null;

    if (modalMode === 'add') {
      const newTask = {
        id: 'task_' + Date.now(),
        title: formTitle.trim(),
        description: formDesc.trim(),
        classId: formClassId,
        className: classObj ? classObj.name : '일반/기타',
        category: formCategory,
        priority: formPriority,
        dueDate: formDueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        subtasks: formSubtasks,
        studentProgress: selectedStudentNames.map(name => ({ name, completed: false }))
      };
      setTasks([newTask, ...tasks]);
    } else {
      // Edit mode
      setTasks(tasks.map(t => {
        if (t.id === editTask.id) {
          // Keep existing progress for students that are still selected
          const updatedStudentProgress = selectedStudentNames.map(name => {
            const existingProgress = t.studentProgress ? t.studentProgress.find(sp => sp.name === name) : null;
            return {
              name,
              completed: existingProgress ? existingProgress.completed : false
            };
          });

          return {
            ...t,
            title: formTitle.trim(),
            description: formDesc.trim(),
            classId: formClassId,
            className: classObj ? classObj.name : '일반/기타',
            category: formCategory,
            priority: formPriority,
            dueDate: formDueDate,
            subtasks: formSubtasks,
            studentProgress: updatedStudentProgress
          };
        }
        return t;
      }));
      setEditTask(null);
    }

    setIsModalOpen(false);
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('이 할 일을 완전히 삭제하시겠습니까?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  // Toggle complete state of a task
  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        // Auto-complete subtasks if task completed
        const updatedSubtasks = t.subtasks ? t.subtasks.map(st => ({
          ...st,
          completed: nextCompleted
        })) : [];

        // Auto-complete student progress if task completed
        const updatedStudentProgress = t.studentProgress ? t.studentProgress.map(sp => ({
          ...sp,
          completed: nextCompleted
        })) : [];

        return {
          ...t,
          completed: nextCompleted,
          subtasks: updatedSubtasks,
          studentProgress: updatedStudentProgress
        };
      }
      return t;
    }));
  };

  // Toggle subtask complete state
  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(st => {
          if (st.id === subtaskId) {
            return { ...st, completed: !st.completed };
          }
          return st;
        });

        // Check if all subtasks are complete
        const allCompleted = updatedSubtasks.every(st => st.completed);

        return {
          ...t,
          subtasks: updatedSubtasks,
          // If there are subtasks, completed matches whether they are all complete
          completed: allCompleted && (t.studentProgress ? t.studentProgress.every(s => s.completed) : true)
        };
      }
      return t;
    }));
  };

  // Toggle student checklist progress
  const handleToggleStudentProgress = (taskId, studentName) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const updatedProgress = t.studentProgress.map(sp => {
          if (sp.name === studentName) {
            return { ...sp, completed: !sp.completed };
          }
          return sp;
        });

        // Check if everything is complete
        const allStudentsDone = updatedProgress.every(sp => sp.completed);
        const allSubtasksDone = t.subtasks ? t.subtasks.every(st => st.completed) : true;

        return {
          ...t,
          studentProgress: updatedProgress,
          completed: allStudentsDone && allSubtasksDone
        };
      }
      return t;
    }));
  };

  // Apply search, filters and sort
  const getProcessedTasks = () => {
    let processed = [...tasks];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      processed = processed.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Filter by class
    if (filterClass !== 'all') {
      processed = processed.filter(t => t.classId === filterClass);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      processed = processed.filter(t => t.category === filterCategory);
    }

    // Filter by status
    if (filterStatus === 'active') {
      processed = processed.filter(t => !t.completed);
    } else if (filterStatus === 'completed') {
      processed = processed.filter(t => t.completed);
    }

    // Sorting
    processed.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

    return processed;
  };

  const processedTasks = getProcessedTasks();

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>할 일 및 교무 관리</h1>
          <p>수업 준비, 채점, 행정 업무를 관리하세요. 학생별 진척도나 세부 항목 체크리스트도 추적할 수 있습니다.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          새 할 일 등록
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              className="form-control"
              placeholder="제목 또는 설명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-options">
            <select
              className="filter-select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="all">모든 학급</option>
              <option value="">일반/행정</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">모든 카테고리</option>
              <option value="Lesson Prep">수업 준비</option>
              <option value="Grading">채점 및 평가</option>
              <option value="Counseling">학생 상담</option>
              <option value="Administrative">행정 업무</option>
              <option value="Events">행사 및 기타</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">마감일 순</option>
              <option value="priority">중요도 순</option>
            </select>

            <div className="filter-tabs">
              <button
                className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                전체
              </button>
              <button
                className={`filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                진행중
              </button>
              <button
                className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {processedTasks.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-secondary)' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 1rem', opacity: 0.5, display: 'block', color: 'var(--primary-color)' }} />
            등록되어 있는 할 일이 없거나 필터 조건에 부합하는 항목이 없습니다.
          </div>
        ) : (
          processedTasks.map(task => {
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasks = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;
            
            const hasStudents = task.studentProgress && task.studentProgress.length > 0;
            const completedStudents = hasStudents ? task.studentProgress.filter(s => s.completed).length : 0;
            
            const isExpanded = !!expandedTasks[task.id];
            
            // Check if deadline is overdue
            const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

            return (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                {/* Custom checkbox */}
                <div className="task-checkbox-container">
                  <div
                    className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    {task.completed && <CheckSquare size={16} />}
                  </div>
                </div>

                {/* Content */}
                <div className="task-content">
                  <div className="task-meta" style={{ marginBottom: '0.4rem' }}>
                    <span className="badge badge-class">{task.className}</span>
                    <span className={`badge ${
                      task.category === 'Lesson Prep' ? 'color-primary' :
                      task.category === 'Grading' ? 'color-success' :
                      task.category === 'Counseling' ? 'color-warning' :
                      task.category === 'Administrative' ? 'color-danger' : 'color-info'
                    }`}>
                      {task.category === 'Lesson Prep' ? '수업 준비' :
                       task.category === 'Grading' ? '채점 및 평가' :
                       task.category === 'Counseling' ? '학생 상담' :
                       task.category === 'Administrative' ? '행정 업무' : '행사 및 기타'}
                    </span>
                    <span className={`badge ${
                      task.priority === 'High' ? 'badge-priority-high' :
                      task.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
                    }`}>
                      {task.priority === 'High' ? '높음' : task.priority === 'Medium' ? '보통' : '낮음'}
                    </span>
                    {task.dueDate && (
                      <span className={`badge badge-date ${isOverdue ? 'overdue' : ''}`}>
                        <Calendar size={12} />
                        {task.dueDate} {isOverdue && '(기한 만료)'}
                      </span>
                    )}
                  </div>

                  <div className="task-title">{task.title}</div>
                  {task.description && <div className="task-desc">{task.description}</div>}

                  {/* Checklist indicator */}
                  {(hasSubtasks || hasStudents) && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        marginTop: '0.25rem'
                      }}
                      onClick={() => toggleExpandTask(task.id)}
                    >
                      {hasSubtasks && (
                        <span>하위 항목: {completedSubtasks}/{task.subtasks.length}</span>
                      )}
                      {hasStudents && (
                        <span>학생 현황: {completedStudents}/{task.studentProgress.length}명</span>
                      )}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  )}

                  {/* Expanded checklists */}
                  {isExpanded && (
                    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                      {/* Subtasks checklist */}
                      {hasSubtasks && (
                        <div style={{ marginTop: '0.75rem', paddingLeft: '0.5rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            상세 진행 단계
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {task.subtasks.map(st => (
                              <div
                                key={st.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  fontSize: '0.85rem',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleToggleSubtask(task.id, st.id)}
                              >
                                {st.completed ? (
                                  <CheckSquare size={15} style={{ color: 'var(--primary-color)' }} />
                                ) : (
                                  <Square size={15} style={{ color: 'var(--text-secondary)' }} />
                                )}
                                <span style={{
                                  textDecoration: st.completed ? 'line-through' : 'none',
                                  color: st.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                                }}>
                                  {st.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Student list checklist */}
                      {hasStudents && (
                        <div className="task-students-progress">
                          <div className="student-progress-title">
                            <span>학생별 완료 여부 (클릭하여 완료 표시)</span>
                            <span>{completedStudents}/{task.studentProgress.length}명 완료</span>
                          </div>
                          <div className="student-chips">
                            {task.studentProgress.map(sp => (
                              <div
                                key={sp.name}
                                className={`student-chip ${sp.completed ? 'completed' : ''}`}
                                onClick={() => handleToggleStudentProgress(task.id, sp.name)}
                              >
                                {sp.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Operations */}
                <div className="task-actions">
                  <button
                    className="action-btn btn-edit"
                    onClick={() => openEditModal(task)}
                    title="수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalMode === 'add' ? '새 할 일 등록' : '할 일 수정'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveTask}>
              <div className="modal-body">
                {/* Title */}
                <div className="form-group">
                  <label>할 일 제목 *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="업무 제목을 입력해 주세요"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>업무 설명</label>
                  <textarea
                    className="form-control"
                    placeholder="세부적인 업무 내용을 메모해 주세요"
                    rows="3"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </div>

                {/* Class & Subject */}
                <div className="form-row">
                  <div className="form-group">
                    <label>관련 학급(클래스)</label>
                    <select
                      className="form-control"
                      value={formClassId}
                      onChange={(e) => handleFormClassChange(e.target.value)}
                    >
                      <option value="">학급 미지정 (일반/행정)</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="form-group">
                    <label>카테고리</label>
                    <select
                      className="form-control"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="Lesson Prep">수업 준비</option>
                      <option value="Grading">채점 및 평가</option>
                      <option value="Counseling">학생 상담</option>
                      <option value="Administrative">행정 업무</option>
                      <option value="Events">행사 및 기타</option>
                    </select>
                  </div>
                </div>

                {/* Priority & Due Date */}
                <div className="form-row">
                  <div className="form-group">
                    <label>중요도</label>
                    <select
                      className="form-control"
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                    >
                      <option value="High">높음 (High)</option>
                      <option value="Medium">보통 (Medium)</option>
                      <option value="Low">낮음 (Low)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>마감 기한</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Subtasks (Checklist) */}
                <div className="form-group">
                  <label>세부 체크리스트 (하위 항목)</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="예: PPT 양식 구상, 복사기 출력"
                      value={newSubtaskText}
                      onChange={(e) => setNewSubtaskText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />
                    <button type="button" className="btn btn-secondary" onClick={handleAddSubtask} style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                      추가
                    </button>
                  </div>

                  {/* List of subtasks in form */}
                  {formSubtasks.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', backgroundColor: 'var(--bg-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                      {formSubtasks.map(st => (
                        <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span>{st.text}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtask(st.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Students list to link (Checkboxes) */}
                {formClassId && classes.find(c => c.id === formClassId)?.students.length > 0 && (
                  <div className="form-group">
                    <label>학생 checklist 연동</label>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      이 작업을 연동하여 개별 진행 사항을 추적할 학생들을 선택하세요.
                    </div>
                    <div className="form-student-select-list">
                      {classes.find(c => c.id === formClassId).students.map(name => (
                        <label key={name} className="form-student-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedStudentNames.includes(name)}
                            onChange={() => toggleFormStudentSelection(name)}
                          />
                          <span>{name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
