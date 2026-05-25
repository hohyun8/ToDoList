import React, { useState } from 'react';
import { Plus, Trash2, Users, GraduationCap, ArrowRight } from 'lucide-react';

export default function ClassManager({ classes, setClasses }) {
  const [newClassName, setNewClassName] = useState('');
  const [newStudentNames, setNewStudentNames] = useState({}); // { classId: studentNameInput }

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass = {
      id: 'cls_' + Date.now(),
      name: newClassName.trim(),
      students: []
    };

    setClasses([...classes, newClass]);
    setNewClassName('');
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('이 클래스를 삭제하시겠습니까? 관련 학생 명부도 모두 삭제됩니다.')) {
      setClasses(classes.filter(c => c.id !== classId));
    }
  };

  const handleAddStudent = (classId) => {
    const studentName = newStudentNames[classId];
    if (!studentName || !studentName.trim()) return;

    setClasses(classes.map(c => {
      if (c.id === classId) {
        // Prevent duplicate names in the same class
        if (c.students.includes(studentName.trim())) {
          alert('이미 존재하는 학생 이름입니다.');
          return c;
        }
        return {
          ...c,
          students: [...c.students, studentName.trim()]
        };
      }
      return c;
    }));

    setNewStudentNames({
      ...newStudentNames,
      [classId]: ''
    });
  };

  const handleDeleteStudent = (classId, studentName) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          students: c.students.filter(name => name !== studentName)
        };
      }
      return c;
    }));
  };

  const handleStudentInputChange = (classId, value) => {
    setNewStudentNames({
      ...newStudentNames,
      [classId]: value
    });
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>클래스 및 학생 관리</h1>
          <p>수업을 등록하고 학급별 학생 명부를 관리하세요. 등록된 학생들은 채점이나 상담 일정에 연동됩니다.</p>
        </div>
      </div>

      {/* Class Addition Form */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleCreateClass} className="class-add-student-form">
          <input
            type="text"
            className="form-control"
            placeholder="예: 3학년 2반 과학, 방과후 독서반"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={18} />
            클래스 추가
          </button>
        </form>
      </div>

      {/* Classes Grid */}
      <div className="class-grid">
        {classes.map((cls) => (
          <div key={cls.id} className="glass-card class-card">
            <div className="class-card-header">
              <div className="class-card-title">
                <h3>{cls.name}</h3>
                <p>학생 수: {cls.students.length}명</p>
              </div>
              <button
                className="action-btn btn-delete"
                onClick={() => handleDeleteClass(cls.id)}
                title="클래스 삭제"
                style={{ padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Students List */}
            <div className="class-students-list">
              {cls.students.length === 0 ? (
                <div style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontStyle: 'italic',
                  padding: '1rem 0',
                  textAlign: 'center'
                }}>
                  등록된 학생이 없습니다.
                </div>
              ) : (
                cls.students.map((student) => (
                  <div key={student} className="student-list-item">
                    <span>{student}</span>
                    <button
                      onClick={() => handleDeleteStudent(cls.id, student)}
                      title="학생 제거"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Student Inline Form */}
            <div className="class-add-student-form">
              <input
                type="text"
                className="form-control"
                placeholder="학생 이름"
                value={newStudentNames[cls.id] || ''}
                onChange={(e) => handleStudentInputChange(cls.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStudent(cls.id);
                  }
                }}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleAddStudent(cls.id)}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              >
                추가
              </button>
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="glass-card" style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <GraduationCap size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, display: 'block', color: 'var(--primary-color)' }} />
            <p>아직 등록된 클래스가 없습니다. 상단에서 첫 클래스(학급)를 생성해 보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
