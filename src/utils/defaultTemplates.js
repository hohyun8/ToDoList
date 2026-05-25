/**
 * Default templates designed specifically for educators in Korea.
 */

export const defaultTemplates = [
  {
    id: 'tpl_grading',
    title: '수행평가 채점 및 피드백',
    description: '수행평가 채점을 신속하게 처리하고 학생 피드백과 나이스 입력을 마치는 전체 프로세스입니다.',
    category: 'Grading',
    priority: 'High',
    subtasks: [
      '학생별 답안지/보고서 1차 채점',
      '수행평가 채점 기준표(루브릭) 대조 및 점수 확정',
      '개인별 맞춤형 피드백 코멘트 작성',
      '나이스(NEIS) 성적 시스템 입력 및 확인'
    ]
  },
  {
    id: 'tpl_new_semester',
    title: '신학기 첫 수업 준비',
    description: '새로운 학기 또는 학년이 시작될 때 첫 수업 오리엔테이션을 완벽하게 준비하는 계획입니다.',
    category: 'Lesson Prep',
    priority: 'High',
    subtasks: [
      '수업 계획서(실라버스) 작성 및 출력',
      '첫 시간 아이스브레이킹 활동 및 PPT 제작',
      '학생 명부 확보 및 교실 자리 배치 구상',
      '수업 규칙(과제 제출 기한, 행동 요령 등) 정리본 준비'
    ]
  },
  {
    id: 'tpl_exam_prep',
    title: '정기 지필평가(시험) 출제',
    description: '중간고사 및 기말고사 지필시험의 문항 출제부터 검토 및 보안 보관까지의 절차입니다.',
    category: 'Administrative',
    priority: 'High',
    subtasks: [
      '이원목적분류표 및 문항 정보표 작성',
      '과목 담당 교사 공동 문항 출제 및 난이도 조율',
      '오탈자, 문제 오류 교차 검토 (3회 이상)',
      '평가계 제출 및 시험지 인쇄 요청 (보안 철저)'
    ]
  },
  {
    id: 'tpl_parent_counseling',
    title: '학부모 상담 주간 준비',
    description: '정기 학부모 면담 또는 전화 상담을 위해 필요한 개별 학생 자료와 일정을 조율합니다.',
    category: 'Counseling',
    priority: 'Medium',
    subtasks: [
      '구글 폼 또는 안내장을 통해 상담 시간 조율 및 최종 확정',
      '학생별 행동 관찰 기록 및 수행평가 결과 수집',
      '교우관계, 수업 참여도, 성격 특성 요약 메모 작성',
      '상담 기록 일지 양식 출력 및 작성 대기'
    ]
  },
  {
    id: 'tpl_lab_prep',
    title: '실험/실습 수업 교구 준비',
    description: '과학 실험, 미술 실습, 체육 수업 등 기자재와 공간 안전을 동반하는 수업 준비 과정입니다.',
    category: 'Lesson Prep',
    priority: 'Medium',
    subtasks: [
      '실습 기구, 재료 수량 체크 및 안전 장치 준비',
      '수업 중 학생 안전 수칙 안내 및 비상 대책 확인',
      '학생용 실험 안내 유인물(매뉴얼) 출력',
      '수업 완료 후 조별 정리 및 기자재 반납 계획 수립'
    ]
  }
];

export const defaultClasses = [
  {
    id: 'cls_1',
    name: '1학년 1반 수학',
    students: ['김민준', '이서연', '박예준', '최지우', '정우진', '강다은', '조현우', '윤서현', '장도현', '임채원']
  },
  {
    id: 'cls_2',
    name: '2학년 3반 과학',
    students: ['박민재', '이하윤', '최서준', '김수아', '정주원', '강도윤', '윤지민', '조성민', '임지우', '한지아']
  },
  {
    id: 'cls_3',
    name: '일반 행정 및 업무',
    students: [] // No students linked for administrative or general tasks
  }
];

export const teacherQuotes = [
  {
    text: "교육은 세상을 바꾸기 위해 사용할 수 있는 가장 강력한 무기다.",
    author: "넬슨 만델라"
  },
  {
    text: "평범한 교사는 말을 하고, 좋은 교사는 설명을 하며, 뛰어난 교사는 몸소 보여주고, 위대한 교사는 영감을 준다.",
    author: "윌리엄 아서 워드"
  },
  {
    text: "아이들은 그들이 배운 것을 결코 잊을지라도, 당신이 그들을 어떻게 느끼게 만들었는지는 절대 잊지 않을 것이다.",
    author: "마야 안젤루"
  },
  {
    text: "가르치는 것은 배움을 두 번 반복하는 것이다.",
    author: "조셉 주베르"
  },
  {
    text: "교육의 목적은 지식을 기르는 것이 아니라 성품을 기르는 것이다.",
    author: "허버트 스펜서"
  }
];
