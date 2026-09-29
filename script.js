// Student Study Planner - JavaScript
// Manages study tasks, subjects, exams and academic progress

// Data storage
const plannerData = {
  tasks: [],
  subjects: [],
  exams: [],
  progress: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadDataFromLocalStorage();
  renderAllViews();
  setupEventListeners();
});

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Task Management
  document.getElementById('addTaskBtn')?.addEventListener('click', addTask);
  document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Subject Management
  document.getElementById('addSubjectBtn')?.addEventListener('click', addSubject);
  document.getElementById('subjectInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSubject();
  });

  // Exam Management
  document.getElementById('addExamBtn')?.addEventListener('click', addExam);

  // Tab Navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchTab(e.target.dataset.tab);
    });
  });
}

// ==================== TASK MANAGEMENT ====================
function addTask() {
  const input = document.getElementById('taskInput');
  const subjectSelect = document.getElementById('taskSubject');
  const prioritySelect = document.getElementById('taskPriority');
  const dueDateInput = document.getElementById('taskDueDate');

  if (input.value.trim() === '') {
    alert('Please enter a task');
    return;
  }

  const task = {
    id: Date.now(),
    title: input.value.trim(),
    subject: subjectSelect.value || 'General',
    priority: prioritySelect.value || 'medium',
    dueDate: dueDateInput.value || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  plannerData.tasks.push(task);
  saveDataToLocalStorage();
  renderTasks();
  input.value = '';
  dueDateInput.value = '';
}

function deleteTask(taskId) {
  plannerData.tasks = plannerData.tasks.filter(task => task.id !== taskId);
  saveDataToLocalStorage();
  renderTasks();
}

function toggleTaskComplete(taskId) {
  const task = plannerData.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveDataToLocalStorage();
    renderTasks();
  }
}

function renderTasks() {
  const container = document.getElementById('tasksList');
  if (!container) return;

  if (plannerData.tasks.length === 0) {
    container.innerHTML = '<p class="empty-message">No tasks yet. Add one to get started!</p>';
    return;
  }

  // Sort tasks by priority and due date
  const sortedTasks = [...plannerData.tasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  container.innerHTML = sortedTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
      <div class="task-header">
        <input 
          type="checkbox" 
          ${task.completed ? 'checked' : ''} 
          onchange="toggleTaskComplete(${task.id})"
          class="task-checkbox"
        >
        <div class="task-info">
          <h4 class="task-title">${task.title}</h4>
          <span class="task-subject">${task.subject}</span>
          ${task.dueDate ? `<span class="task-due-date">Due: ${formatDate(task.dueDate)}</span>` : ''}
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `).join('');
}

// ==================== SUBJECT MANAGEMENT ====================
function addSubject() {
  const input = document.getElementById('subjectInput');
  const teacherInput = document.getElementById('subjectTeacher');
  const creditsInput = document.getElementById('subjectCredits');

  if (input.value.trim() === '') {
    alert('Please enter a subject name');
    return;
  }

  const subject = {
    id: Date.now(),
    name: input.value.trim(),
    teacher: teacherInput.value.trim() || 'Not specified',
    credits: creditsInput.value || '1',
    createdAt: new Date().toISOString()
  };

  plannerData.subjects.push(subject);
  saveDataToLocalStorage();
  renderSubjects();
  input.value = '';
  teacherInput.value = '';
  creditsInput.value = '';
  updateTaskSubjectOptions();
}

function deleteSubject(subjectId) {
  plannerData.subjects = plannerData.subjects.filter(s => s.id !== subjectId);
  plannerData.tasks = plannerData.tasks.filter(t => t.subject !== subjectId);
  saveDataToLocalStorage();
  renderSubjects();
  updateTaskSubjectOptions();
}

function renderSubjects() {
  const container = document.getElementById('subjectsList');
  if (!container) return;

  if (plannerData.subjects.length === 0) {
    container.innerHTML = '<p class="empty-message">No subjects added yet.</p>';
    return;
  }

  container.innerHTML = plannerData.subjects.map(subject => `
    <div class="subject-card">
      <h3>${subject.name}</h3>
      <p><strong>Teacher:</strong> ${subject.teacher}</p>
      <p><strong>Credits:</strong> ${subject.credits}</p>
      <button class="delete-btn" onclick="deleteSubject(${subject.id})">Remove</button>
    </div>
  `).join('');
}

function updateTaskSubjectOptions() {
  const select = document.getElementById('taskSubject');
  if (!select) return;

  select.innerHTML = '<option value="">Select Subject</option>' + 
    plannerData.subjects.map(subject => 
      `<option value="${subject.name}">${subject.name}</option>`
    ).join('');
}

// ==================== EXAM MANAGEMENT ====================
function addExam() {
  const nameInput = document.getElementById('examName');
  const subjectInput = document.getElementById('examSubject');
  const dateInput = document.getElementById('examDate');
  const timeInput = document.getElementById('examTime');

  if (!nameInput.value.trim() || !dateInput.value) {
    alert('Please fill in exam name and date');
    return;
  }

  const exam = {
    id: Date.now(),
    name: nameInput.value.trim(),
    subject: subjectInput.value || 'General',
    date: dateInput.value,
    time: timeInput.value || '09:00',
    createdAt: new Date().toISOString()
  };

  plannerData.exams.push(exam);
  saveDataToLocalStorage();
  renderExams();
  nameInput.value = '';
  subjectInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
}

function deleteExam(examId) {
  plannerData.exams = plannerData.exams.filter(e => e.id !== examId);
  saveDataToLocalStorage();
  renderExams();
}

function renderExams() {
  const container = document.getElementById('examsList');
  if (!container) return;

  if (plannerData.exams.length === 0) {
    container.innerHTML = '<p class="empty-message">No exams scheduled yet.</p>';
    return;
  }

  const sortedExams = [...plannerData.exams].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  container.innerHTML = sortedExams.map(exam => `
    <div class="exam-card">
      <h3>${exam.name}</h3>
      <p><strong>Subject:</strong> ${exam.subject}</p>
      <p><strong>Date:</strong> ${formatDate(exam.date)}</p>
      <p><strong>Time:</strong> ${exam.time}</p>
      <button class="delete-btn" onclick="deleteExam(${exam.id})">Remove</button>
    </div>
  `).join('');
}

// ==================== PROGRESS TRACKING ====================
function renderProgress() {
  const container = document.getElementById('progressContainer');
  if (!container) return;

  const totalTasks = plannerData.tasks.length;
  const completedTasks = plannerData.tasks.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const upcomingExams = plannerData.exams.filter(e => 
    new Date(e.date) > new Date()
  ).length;

  container.innerHTML = `
    <div class="progress-stats">
      <div class="stat-card">
        <h4>Task Completion</h4>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${completionRate}%"></div>
        </div>
        <p>${completedTasks} of ${totalTasks} completed (${completionRate}%)</p>
      </div>
      <div class="stat-card">
        <h4>Total Subjects</h4>
        <p class="big-number">${plannerData.subjects.length}</p>
      </div>
      <div class="stat-card">
        <h4>Upcoming Exams</h4>
        <p class="big-number">${upcomingExams}</p>
      </div>
    </div>
  `;
}

// ==================== TAB NAVIGATION ====================
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove active class from all buttons
  document.querySelectorAll*`
