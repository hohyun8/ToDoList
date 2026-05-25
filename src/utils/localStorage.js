/**
 * LocalStorage utility helpers for EduTask
 */

export const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return defaultValue;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

/**
 * Downloads a JSON file containing all application data
 */
export const exportBackup = (tasks, classes, templates) => {
  const backupData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    tasks,
    classes,
    templates
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `edutask_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Imports application data from a JSON backup file
 */
export const importBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        
        // Simple validation
        if (!parsedData.tasks || !parsedData.classes) {
          reject(new Error("유효하지 않은 백업 파일 형식입니다."));
          return;
        }

        resolve(parsedData);
      } catch (e) {
        reject(new Error("JSON 파일 분석에 실패했습니다."));
      }
    };
    reader.onerror = () => reject(new Error("파일 읽기 오류가 발생했습니다."));
    reader.readAsText(file);
  });
};
