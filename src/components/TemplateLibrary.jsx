import React, { useState } from 'react';
import { defaultTemplates } from '../utils/defaultTemplates';
import { Calendar, Plus, BookOpen, Layers, CheckSquare, Sparkles } from 'lucide-react';

export default function TemplateLibrary({ classes, onAddTask, setActiveTab }) {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [dueDates, setDueDates] = useState({}); // { templateId: dateString }

  const handleUseTemplate = (template) => {
    const dueDate = dueDates[template.id] || '';
    const classObj = classes.find(c => c.id === selectedClassId) || null;

    // Create the task object based on the template
    const newTask = {
      id: 'task_' + Date.now(),
      title: template.title,
      description: template.description,
      classId: selectedClassId,
      className: classObj ? classObj.name : '일반/기타',
      category: template.category,
      priority: template.priority,
      dueDate: dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      // Subtasks from template
      subtasks: template.subtasks.map((st, idx) => ({
        id: `sub_${Date.now()}_${idx}`,
        text: st,
        completed: false
      })),
      // Link class students as a checklist if the template is about grading/counseling and has students
      studentProgress: classObj && classObj.students.length > 0 ? 
        classObj.students.map(s => ({ name: s, completed: false })) : []
    };

    onAddTask(newTask);
    
    // Reset date input for this template
    setDueDates({
      ...dueDates,
      [template.id]: ''
    });

    alert(`'${template.title}' 할 일이 추가되었습니다!`);
    setActiveTab('tasks');
  };

  const handleDateChange = (templateId, value) => {
    setDueDates({
      ...dueDates,
      [templateId]: value
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>반복 업무 템플릿</h1>
          <p>매주 또는 학기별로 반복되는 교사 업무들을 템플릿을 통해 빠르게 생성해 보세요.</p>
        </div>
      </div>

      <div className="template-grid">
        {defaultTemplates.map((template) => (
          <div key={template.id} className="glass-card template-card">
            <div className="template-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge ${
                  template.category === 'Lesson Prep' ? 'color-primary' :
                  template.category === 'Grading' ? 'color-success' :
                  template.category === 'Counseling' ? 'color-warning' :
                  template.category === 'Administrative' ? 'color-danger' : 'color-info'
                }`}>
                  {template.category === 'Lesson Prep' ? '수업 준비' :
                   template.category === 'Grading' ? '채점 및 평가' :
                   template.category === 'Counseling' ? '학생 상담' :
                   template.category === 'Administrative' ? '행정 업무' : '행사 및 기타'}
                </span>
                <span className={`badge ${
                  template.priority === 'High' ? 'badge-priority-high' :
                  template.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
                }`}>
                  중요도: {template.priority === 'High' ? '높음' : template.priority === 'Medium' ? '보통' : '낮음'}
                </span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.description}</p>
            </div>

            {/* Subtasks Preview */}
            <div className="template-subtasks">
              <div className="template-subtasks-title">체크리스트 프리뷰</div>
              {template.subtasks.map((st, i) => (
                <div key={i} className="template-subtask-item">
                  <CheckSquare size={12} style={{ color: 'var(--primary-color)' }} />
                  <span>{st}</span>
                </div>
              ))}
            </div>

            {/* Actions form */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div className="form-row" style={{ gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>연동 학급 선택</label>
                  <select
                    className="form-control"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    style={{ padding: '0.45rem', fontSize: '0.8rem' }}
                  >
                    <option value="">학급 미지정 (일반)</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>마감 기한 설정</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDates[template.id] || ''}
                    onChange={(e) => handleDateChange(template.id, e.target.value)}
                    style={{ padding: '0.45rem', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleUseTemplate(template)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                <Sparkles size={16} />
                이 템플릿으로 추가
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
