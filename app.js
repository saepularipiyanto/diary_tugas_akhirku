// --- STATE ENGINE & STORAGE ---
const STATE_KEY = 'diary_tugas_akhir_state';

// Indonesian Mock Data for First-Time Setup
const mockData = {
  profile: {
    name: "Saepul Bahri",
    nim: "1122025100008",
    major: "Teknik Informatika",
    thesisTitle: "Implementasi Progressive Web App (PWA) Sebagai Diary Kendali Bimbingan Tugas Akhir Mahasiswa UIN Jakarta",
    defenseDate: "2026-07-20",
    approvedChapters: ["chap-1", "chap-2"]
  },
  meetingTarget: {
    date: "2026-05-28T09:30",
    agenda: "Asistensi Hasil Pengujian Aplikasi & Penulisan Bab 4"
  },
  advisors: [
    {
      id: "adv-1",
      name: "Dr. Muhammad Shidiq, M.T.",
      role: "Pembimbing I (Utama)",
      nip: "197805122005011003",
      phone: "6281234567890",
      email: "m.shidiq@uinjkt.ac.id",
      room: "Gd. Saintek Lt. 3 Ruang 308",
      notes: "Sangat memperhatikan metodologi penelitian, alur pemecahan masalah, dan kebaruan jurnal pustaka. Hari bimbingan: Senin & Rabu."
    },
    {
      id: "adv-2",
      name: "Farihin, M.Cs.",
      role: "Pembimbing II (Pendamping)",
      nip: "198509142010121004",
      phone: "628987654321",
      email: "farihin@uinjkt.ac.id",
      room: "Lab RPL Gd. Saintek Lt. 4",
      notes: "Fokus pada arsitektur pemrograman, normalisasi database (ERD), dan kepraktisan antarmuka (UI/UX). Hari bimbingan: Selasa & Kamis."
    }
  ],
  logs: [
    {
      id: "log-1",
      date: "2026-04-06",
      type: "Tatap Muka (Offline)",
      advisorId: "adv-1",
      topic: "Pengajuan Outline & Rumusan Masalah",
      details: "Outline disetujui. Diberikan catatan untuk mempersempit ruang lingkup fokus pengujian dan memantapkan urgensi penelitian di Latar Belakang. Lanjutkan menyusun Bab 1.",
      status: "Approved",
      revisions: []
    },
    {
      id: "log-2",
      date: "2026-04-20",
      type: "Tatap Muka (Offline)",
      advisorId: "adv-1",
      topic: "Asistensi Draft Bab I & Bab II",
      details: "Latar belakang masalah dinilai sudah kuat. Namun, tinjauan pustaka (Bab 2) harus ditambah dengan membandingkan minimal 5 jurnal terindeks Scopus/Sinta 2 terbaru agar membedakan penelitian ini dari penelitian terdahulu.",
      status: "Needs Revision",
      revisions: ["rev-1", "rev-2"]
    },
    {
      id: "log-3",
      date: "2026-05-05",
      type: "Online / Video Call",
      advisorId: "adv-2",
      topic: "Desain Sistem & Skema Database",
      details: "Perlu dilakukan normalisasi tabel bimbingan karena masih terdeteksi redundansi parsial. Tunjukkan relasi ERD hingga level 3NF. Perbaiki juga diagram alur proses ekspor-impor data.",
      status: "Needs Revision",
      revisions: ["rev-3", "rev-4"]
    },
    {
      id: "log-4",
      date: "2026-05-18",
      type: "Via Chat / Email",
      advisorId: "adv-2",
      topic: "Review Normalisasi Database & ERD",
      details: "Skema ERD baru sudah dinilai baik dan memenuhi standar 3NF. Flowchart sistem juga sudah logis. Bab 3 (Metodologi) dinyatakan ACC dan silakan langsung dilanjutkan ke tahap implementasi kode program utama.",
      status: "Approved",
      revisions: []
    }
  ],
  revisions: [
    {
      id: "rev-1",
      description: "Tambahkan perbandingan minimal 5 jurnal referensi terbaru (maksimal 3 tahun terakhir) pada tabel penelitian terdahulu Bab 2.",
      advisorId: "adv-1",
      status: "done",
      logId: "log-2",
      dateAdded: "2026-04-20"
    },
    {
      id: "rev-2",
      description: "Perjelas batasan masalah mengenai spesifikasi file JSON untuk impor data di Bab 1.",
      advisorId: "adv-1",
      status: "done",
      logId: "log-2",
      dateAdded: "2026-04-20"
    },
    {
      id: "rev-3",
      description: "Lakukan normalisasi ERD skema database hingga bentuk normal ke-3 (3NF).",
      advisorId: "adv-2",
      status: "done",
      logId: "log-3",
      dateAdded: "2026-05-05"
    },
    {
      id: "rev-4",
      description: "Perbaiki alur flowchart aplikasi untuk menunjukkan proses enkripsi file ekspor bimbingan.",
      advisorId: "adv-2",
      status: "progress",
      logId: "log-3",
      dateAdded: "2026-05-05",
      gdriveLink: "https://drive.google.com/drive/folders/1abc123xyz"
    }
  ],
  workTarget: {
    dailyTargetHours: 4,
    weeklyTargetHours: 20,
    dailyLoggedMinutes: 150,
    weeklyLoggedMinutes: 720,
    lastLoggedDate: "2026-05-24"
  }
};

// Main State Holder
let appState = null;

// Initialize State
const USERS_KEY = 'diary_tugas_akhir_users';
const SESSION_USER_KEY = 'active_diary_username';

const MASTER_ADVISORS_KEY = 'diary_tugas_akhir_master_advisors';
const MASTER_CHAPTERS_KEY = 'diary_tugas_akhir_master_chapters';

const defaultChapters = [
  { id: "chap-1", title: "BAB I: Pendahuluan" },
  { id: "chap-2", title: "BAB II: Tinjauan Pustaka" },
  { id: "chap-3", title: "BAB III: Metodologi Penelitian" },
  { id: "chap-4", title: "BAB IV: Analisis & Pembahasan" },
  { id: "chap-5", title: "BAB V: Kesimpulan & Saran" }
];

function initMasterAdvisors() {
  let advisors = localStorage.getItem(MASTER_ADVISORS_KEY);
  if (!advisors) {
    // Seed using standard default advisors
    localStorage.setItem(MASTER_ADVISORS_KEY, JSON.stringify(mockData.advisors));
  }
}

function getMasterAdvisors() {
  initMasterAdvisors();
  return JSON.parse(localStorage.getItem(MASTER_ADVISORS_KEY) || '[]');
}

function initMasterChapters() {
  let chapters = localStorage.getItem(MASTER_CHAPTERS_KEY);
  if (!chapters) {
    localStorage.setItem(MASTER_CHAPTERS_KEY, JSON.stringify(defaultChapters));
  }
}

function getMasterChapters() {
  initMasterChapters();
  return JSON.parse(localStorage.getItem(MASTER_CHAPTERS_KEY) || '[]');
}

function initUsersDatabase() {
  let users = localStorage.getItem(USERS_KEY);
  let usersArray = [];
  if (users) {
    try {
      usersArray = JSON.parse(users);
    } catch(e) {
      usersArray = [];
    }
  }

  // Ensure saepul exists if completely empty
  const hasSaepul = usersArray.some(u => u.username === 'saepul');
  if (!hasSaepul && usersArray.length === 0) {
    const defaultUser = {
      username: "saepul",
      password: "password123",
      name: "Saepul Bahri",
      nim: "1122025100008",
      major: "Teknik Informatika",
      role: "student"
    };
    usersArray.push(defaultUser);
    
    // Seed saepul's user state
    const savedState = localStorage.getItem(STATE_KEY);
    if (savedState) {
      localStorage.setItem(`diary_tugas_akhir_state_saepul`, savedState);
    } else {
      localStorage.setItem(`diary_tugas_akhir_state_saepul`, JSON.stringify(mockData));
    }
  }

  // Ensure admin exists
  const hasAdmin = usersArray.some(u => u.username === 'admin');
  if (!hasAdmin) {
    const defaultAdmin = {
      username: "admin",
      password: "admin123",
      name: "Administrator Utama",
      nim: "0000000000",
      major: "Pusat Kendali Akademik",
      role: "admin"
    };
    usersArray.push(defaultAdmin);
  }

  // Ensure all accounts have a role
  usersArray.forEach(u => {
    if (!u.role) {
      u.role = (u.username === 'admin') ? 'admin' : 'student';
    }
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(usersArray));
}

function getActiveUser() {
  return sessionStorage.getItem(SESSION_USER_KEY);
}

// Initialize State
function initAppState() {
  initUsersDatabase();
  initMasterAdvisors();
  initMasterChapters();
  
  const username = getActiveUser();
  const authContainer = document.getElementById('auth-container');
  const appContainer = document.querySelector('.app-container');
  const adminContainer = document.getElementById('admin-container');

  if (!username) {
    // No logged-in user, show auth screen
    if (authContainer) authContainer.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
    if (adminContainer) adminContainer.style.display = 'none';
    appState = null;
    return;
  }

  // Determine user role
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userMeta = users.find(u => u.username === username);
  const isAdmin = userMeta && userMeta.role === 'admin';

  if (isAdmin) {
    if (authContainer) authContainer.style.display = 'none';
    if (appContainer) appContainer.style.display = 'none';
    if (adminContainer) adminContainer.style.display = 'flex';
    
    // Set minimal placeholder state for admin session
    appState = { role: 'admin', username: 'admin' };
    return;
  }

  // Regular Student View Router
  if (authContainer) authContainer.style.display = 'none';
  if (appContainer) appContainer.style.display = 'flex';
  if (adminContainer) adminContainer.style.display = 'none';

  const userStateKey = `diary_tugas_akhir_state_${username}`;
  const savedState = localStorage.getItem(userStateKey);
  
  if (savedState) {
    try {
      appState = JSON.parse(savedState);
      
      // Dynamic upgrade for existing states
      if (!appState.workTarget) {
        appState.workTarget = {
          dailyTargetHours: 4,
          weeklyTargetHours: 20,
          dailyLoggedMinutes: 0,
          weeklyLoggedMinutes: 0,
          lastLoggedDate: new Date().toISOString().split('T')[0]
        };
      }
    } catch (e) {
      console.error("Gagal mengurai status bimbingan, memuat data default.", e);
      appState = JSON.parse(JSON.stringify(mockData));
    }
  } else {
    // If newly registered, load empty template seeded with registered info
    appState = {
      profile: {
        name: userMeta ? userMeta.name : "Mahasiswa UIN",
        nim: userMeta ? userMeta.nim : "",
        major: userMeta ? userMeta.major : "Teknik Informatika",
        thesisTitle: "",
        defenseDate: "",
        approvedChapters: []
      },
      meetingTarget: {
        date: "",
        agenda: ""
      },
      advisors: [],
      logs: [],
      revisions: [],
      workTarget: {
        dailyTargetHours: 4,
        weeklyTargetHours: 20,
        dailyLoggedMinutes: 0,
        weeklyLoggedMinutes: 0,
        lastLoggedDate: new Date().toISOString().split('T')[0]
      }
    };
    saveAppState();
  }

  // Chapters Array Migration (Safe for Saepul's dynamic checks)
  if (appState && appState.profile && !appState.profile.approvedChapters) {
    appState.profile.approvedChapters = [];
    if (appState.profile.bab1) appState.profile.approvedChapters.push("chap-1");
    if (appState.profile.bab2) appState.profile.approvedChapters.push("chap-2");
    if (appState.profile.bab3) appState.profile.approvedChapters.push("chap-3");
    if (appState.profile.bab4) appState.profile.approvedChapters.push("chap-4");
    if (appState.profile.bab5) appState.profile.approvedChapters.push("chap-5");
    
    delete appState.profile.bab1;
    delete appState.profile.bab2;
    delete appState.profile.bab3;
    delete appState.profile.bab4;
    delete appState.profile.bab5;
    saveAppState();
  }

  // Advisor Master Migration Logic
  if (appState.advisors && appState.advisors.length > 0) {
    let masterAdvisors = getMasterAdvisors();
    appState.advisors.forEach(adv => {
      const exists = masterAdvisors.some(ma => ma.name.toLowerCase().trim() === adv.name.toLowerCase().trim());
      if (!exists) {
        masterAdvisors.push(adv);
      }
    });
    localStorage.setItem(MASTER_ADVISORS_KEY, JSON.stringify(masterAdvisors));
    appState.advisors = []; // clear to rely purely on global master list
    saveAppState();
  }
  
  // Date check for daily target reset
  checkAndResetWorkProgress();
}

function saveAppState() {
  const username = getActiveUser();
  if (username && username !== 'admin') {
    localStorage.setItem(`diary_tugas_akhir_state_${username}`, JSON.stringify(appState));
  }
}

// --- DOM ELEMENTS CACHE ---
const dom = {
  // Navigation Tabs
  navItems: document.querySelectorAll('.nav-item'),
  tabViews: document.querySelectorAll('.tab-view'),
  viewTitle: document.getElementById('view-title'),
  viewSubtitle: document.getElementById('view-subtitle'),
  
  // Theme Switching
  themeToggleBtn: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  themeText: document.getElementById('theme-text'),
  sidebarAvatar: document.getElementById('sidebar-avatar'),
  sidebarUserName: document.getElementById('sidebar-user-name'),
  sidebarUserTitle: document.getElementById('sidebar-user-title'),
  
  // Modals
  modalLog: document.getElementById('modal-log'),
  modalAdvisor: document.getElementById('modal-advisor'),
  modalRevision: document.getElementById('modal-revision'),
  
  // Dashboard KPI
  kpiMeetings: document.getElementById('kpi-total-meetings'),
  kpiRevisions: document.getElementById('kpi-pending-revisions'),
  kpiAdvisors: document.getElementById('kpi-advisor-count'),
  kpiElapsed: document.getElementById('kpi-elapsed-days'),
  
  // Progress & Checklist Elements
  progressRing: document.getElementById('dashboard-progress-ring'),
  progressPctText: document.getElementById('dashboard-progress-pct'),
  
  // Recent Logs Container
  recentLogsContainer: document.getElementById('recent-logs-container'),
  
  // Logs View Elements
  logsTableBody: document.getElementById('logs-table-body'),
  searchLogInput: document.getElementById('search-log-input'),
  filterAdvisorSelect: document.getElementById('filter-advisor-select'),
  filterStatusSelect: document.getElementById('filter-status-select'),
  btnClearFilters: document.getElementById('btn-clear-filters'),
  
  // Revisions Kanban Elements
  listTodo: document.getElementById('list-todo'),
  listProgress: document.getElementById('list-progress'),
  listDone: document.getElementById('list-done'),
  countTodo: document.getElementById('count-todo'),
  countProgress: document.getElementById('count-progress'),
  countDone: document.getElementById('count-done'),
  
  // Advisors grid
  advisorsContainer: document.getElementById('advisors-container'),
  
  // Settings Form Elements
  settingsProfileForm: document.getElementById('settings-profile-form'),
  settingsTargetsForm: document.getElementById('settings-targets-form'),
  
  // Profile Inputs
  inputStudentName: document.getElementById('student-name-input'),
  inputStudentNim: document.getElementById('student-nim-input'),
  inputStudentMajor: document.getElementById('student-major-input'),
  inputThesisTitle: document.getElementById('thesis-title-input'),
  
  // Targets Inputs
  inputDefenseDate: document.getElementById('target-defense-date'),
  inputMeetingDate: document.getElementById('target-meeting-date'),
  inputMeetingAgenda: document.getElementById('target-meeting-agenda'),
  
  // Quick action buttons
  btnAddLogAction: document.getElementById('btn-add-log-action'),
  btnPrintAction: document.getElementById('btn-print-action'),
  
  // File Export/Import
  btnExportData: document.getElementById('btn-export-data'),
  fileImportData: document.getElementById('file-import-data'),
  btnLoadMockData: document.getElementById('btn-load-mock-data'),
  btnClearAllData: document.getElementById('btn-clear-all-data')
};

// Temp array for nested revisions under current advising log modal
let nestedRevisionsTemp = [];

// --- INITIAL APP LAUNCH ---
document.addEventListener('DOMContentLoaded', () => {
  initAppState();
  setupEventListeners();
  loadThemePreference();
  setupAuthListeners();
  
  const username = getActiveUser();
  if (username) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userMeta = users.find(u => u.username === username);
    if (userMeta && userMeta.role === 'admin') {
      setupAdminEventListeners();
      renderAdminComponents();
    } else {
      renderAppComponents();
    }
  }
});

function renderAppComponents() {
  renderDashboard();
  renderLogsTable();
  renderKanbanBoard();
  renderAdvisors();
  populateDropdowns();
  syncSettingsForms();
  startCountdownTimer();
}

// Load dark/light mode preference
function loadThemePreference() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeUI(currentTheme);
  if (typeof updateAdminThemeUI === 'function') {
    updateAdminThemeUI(currentTheme);
  }
}

function updateThemeUI(theme) {
  if (theme === 'light') {
    dom.themeIcon.innerHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;
    dom.themeText.innerText = "Dark Mode";
  } else {
    dom.themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    dom.themeText.innerText = "Light Mode";
  }
}

// --- EVENT LISTENERS REGISTRATION ---
function setupEventListeners() {
  // Sidebar tab-based routing
  dom.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedTab = item.getAttribute('data-tab');
      switchTab(selectedTab);
      // Close mobile menu if open
      document.getElementById('sidebar').classList.remove('mobile-open');
    });
  });

  // Mobile menu actions
  document.getElementById('mobile-open-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('mobile-open');
  });
  document.getElementById('mobile-close-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('mobile-open');
  });

  // Dark/Light Theme Switching Click
  dom.themeToggleBtn.addEventListener('click', () => {
    let activeTheme = document.documentElement.getAttribute('data-theme');
    let nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeUI(nextTheme);
  });

  // Dashboard Button Redirects
  document.getElementById('dashboard-view-all-logs-btn').addEventListener('click', () => {
    switchTab('logs');
  });

  // Add Log Quick Action
  dom.btnAddLogAction.addEventListener('click', () => {
    openLogModal();
  });

  // Log Modal Close triggers
  document.getElementById('modal-log-close').addEventListener('click', closeLogModal);
  document.getElementById('modal-log-cancel').addEventListener('click', closeLogModal);
  
  // Submit Log bimbingan form
  document.getElementById('form-log').addEventListener('submit', handleLogSubmit);

  // Add Sub-revision inside Session Modal
  document.getElementById('btn-add-nested-revision').addEventListener('click', addNestedRevisionRow);
  document.getElementById('nested-revision-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNestedRevisionRow();
    }
  });

  // Add Dosen Pembimbing Action
  document.getElementById('btn-add-advisor-action').addEventListener('click', () => {
    openAdvisorModal();
  });
  document.getElementById('modal-advisor-close').addEventListener('click', closeAdvisorModal);
  document.getElementById('modal-advisor-cancel').addEventListener('click', closeAdvisorModal);
  document.getElementById('form-advisor').addEventListener('submit', handleAdvisorSubmit);

  // Revisions Modal Actions
  document.getElementById('btn-add-revision-direct').addEventListener('click', () => {
    openRevisionModal();
  });
  document.getElementById('modal-revision-close').addEventListener('click', closeRevisionModal);
  document.getElementById('modal-revision-cancel').addEventListener('click', closeRevisionModal);
  document.getElementById('form-revision').addEventListener('submit', handleRevisionSubmit);

  // Filters Event listeners
  dom.searchLogInput.addEventListener('input', renderLogsTable);
  dom.filterAdvisorSelect.addEventListener('change', renderLogsTable);
  dom.filterStatusSelect.addEventListener('change', renderLogsTable);
  dom.btnClearFilters.addEventListener('click', () => {
    dom.searchLogInput.value = '';
    dom.filterAdvisorSelect.value = 'all';
    dom.filterStatusSelect.value = 'all';
    dom.btnClearFilters.style.display = 'none';
    renderLogsTable();
  });

  // Profile Settings Form
  dom.settingsProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.profile.name = dom.inputStudentName.value.trim();
    appState.profile.nim = dom.inputStudentNim.value.trim();
    appState.profile.major = dom.inputStudentMajor.value.trim();
    appState.profile.thesisTitle = dom.inputThesisTitle.value.trim();
    saveAppState();
    
    // Sync UI elements instantly
    dom.sidebarUserName.innerText = appState.profile.name;
    dom.sidebarUserTitle.innerText = appState.profile.major;
    dom.sidebarAvatar.innerText = appState.profile.name.charAt(0).toUpperCase();
    
    alert("Profil mahasiswa berhasil diperbarui!");
    renderDashboard();
  });

  // Targets Settings Form
  dom.settingsTargetsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appState.profile.defenseDate = dom.inputDefenseDate.value;
    appState.meetingTarget.date = dom.inputMeetingDate.value;
    appState.meetingTarget.agenda = dom.inputMeetingAgenda.value.trim();
    
    // Save Work Hour targets
    if (!appState.workTarget) appState.workTarget = {};
    appState.workTarget.dailyTargetHours = parseFloat(document.getElementById('target-daily-hours').value) || 4;
    appState.workTarget.weeklyTargetHours = parseFloat(document.getElementById('target-weekly-hours').value) || 20;

    // Read and save Bab Checklist progress
    const checkboxes = document.querySelectorAll('.bab-approval-checkbox');
    appState.profile.approvedChapters = [];
    checkboxes.forEach(chk => {
      if (chk.checked) {
        appState.profile.approvedChapters.push(chk.dataset.chapterId);
      }
    });
    
    saveAppState();
    alert("Target waktu, target jam kerja, dan kemajuan bab berhasil disimpan!");
    renderDashboard();
  });

  // Dashboard shortcut button to open Hour Tracker menu
  document.getElementById('btn-go-to-hours').addEventListener('click', () => {
    switchTab('hours');
  });

  // Backup and Restore Controls
  dom.btnExportData.addEventListener('click', exportDataToJSON);
  dom.fileImportData.addEventListener('change', importDataFromJSON);
  dom.btnLoadMockData.addEventListener('click', () => {
    if (confirm("Ingin memuat ulang data contoh? Seluruh data kustom Anda saat ini akan ditimpa.")) {
      appState = JSON.parse(JSON.stringify(mockData));
      saveAppState();
      location.reload();
    }
  });
  dom.btnClearAllData.addEventListener('click', () => {
    if (confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data bimbingan ini? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem(STATE_KEY);
      location.reload();
    }
  });

  // Print controls
  dom.btnPrintAction.addEventListener('click', triggerPrintController);

  // Hour Tracker Buttons (Dedicated menu)
  document.getElementById('btn-add-time-30-main').addEventListener('click', () => logWorkMinutes(30));
  document.getElementById('btn-add-time-60-main').addEventListener('click', () => logWorkMinutes(60));
  document.getElementById('btn-add-time-120-main').addEventListener('click', () => logWorkMinutes(120));
  document.getElementById('btn-custom-time-main').addEventListener('click', logCustomWorkMinutes);
  document.getElementById('btn-reset-time-main').addEventListener('click', resetDailyTime);

  // Bind Logout Button
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', handleLogout);
  }
}

// --- SWITCH TAB CONTROLLER ---
function switchTab(tabId) {
  dom.navItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  dom.tabViews.forEach(view => {
    if (view.id === `${tabId}-view`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Adjust Quick Action buttons depending on tab
  if (tabId === 'logs') {
    dom.btnPrintAction.style.display = 'inline-flex';
    dom.btnAddLogAction.style.display = 'inline-flex';
  } else if (tabId === 'revisions' || tabId === 'advisors' || tabId === 'hours') {
    dom.btnPrintAction.style.display = 'none';
    dom.btnAddLogAction.style.display = 'none';
  } else {
    dom.btnPrintAction.style.display = 'inline-flex';
    dom.btnAddLogAction.style.display = 'inline-flex';
  }

  // Update Top titles
  const titles = {
    dashboard: { title: "Dashboard", subtitle: "Ringkasan kemajuan tugas akhir Anda saat ini." },
    logs: { title: "Log Buku Bimbingan", subtitle: "Jurnal kronologi asistensi dan catatan dosen pembimbing." },
    revisions: { title: "Progress Revisi", subtitle: "Kanban kendali koreksi tugas akhir mahasiswa." },
    advisors: { title: "Dosen Pembimbing", subtitle: "Kontak informasi pendamping bimbingan skripsi." },
    hours: { title: "Target Jam Kerja", subtitle: "Kelola pencatatan jam kerja dan pengaturan target pengerjaan tugas akhir." },
    settings: { title: "Pengaturan Profil & Target", subtitle: "Kelola data mahasiswa, target wisuda, dan integrasi data." }
  };

  dom.viewTitle.innerText = titles[tabId].title;
  dom.viewSubtitle.innerText = titles[tabId].subtitle;
}

// --- POPULATE SELECT DROPDOWNS ---
function populateDropdowns() {
  if (!appState) return;
  // Clear other than 'all'
  if (dom.filterAdvisorSelect) {
    dom.filterAdvisorSelect.innerHTML = '<option value="all">Semua Pembimbing</option>';
  }
  
  const logAdvisorInput = document.getElementById('log-advisor');
  if (logAdvisorInput) logAdvisorInput.innerHTML = '';
  
  const revisionAdvisorSelect = document.getElementById('revision-advisor');
  if (revisionAdvisorSelect) revisionAdvisorSelect.innerHTML = '';

  const masterAdvisors = getMasterAdvisors();
  
  // Filter student advisors if assigned
  let studentAdvisors = masterAdvisors;
  if (appState.profile && (appState.profile.advisor1Id || appState.profile.advisor2Id)) {
    studentAdvisors = masterAdvisors.filter(adv => adv.id === appState.profile.advisor1Id || adv.id === appState.profile.advisor2Id);
  }

  studentAdvisors.forEach(adv => {
    // Filter in logs list
    if (dom.filterAdvisorSelect) {
      dom.filterAdvisorSelect.innerHTML += `<option value="${adv.id}">${adv.name}</option>`;
    }
  });

  studentAdvisors.forEach(adv => {
    // Modal Advising form select list
    if (logAdvisorInput) {
      logAdvisorInput.innerHTML += `<option value="${adv.id}">${adv.name} (${adv.role.split(' ')[0]})</option>`;
    }
    // Modal Revision form select list
    if (revisionAdvisorSelect) {
      revisionAdvisorSelect.innerHTML += `<option value="${adv.id}">${adv.name}</option>`;
    }
  });

  // Source advising sessions dropdown in Revision form
  const revSourceLog = document.getElementById('revision-source-log');
  if (revSourceLog && appState && appState.logs) {
    revSourceLog.innerHTML = '<option value="">-- Tidak dikaitkan dengan sesi tertentu (Revisi Mandiri) --</option>';
    appState.logs.forEach(log => {
      const advName = getAdvisorName(log.advisorId);
      revSourceLog.innerHTML += `<option value="${log.id}">${log.date} - ${log.topic} (${advName})</option>`;
    });
  }
}

function getAdvisorName(advisorId) {
  const masterAdvisors = getMasterAdvisors();
  const advisor = masterAdvisors.find(a => a.id === advisorId);
  return advisor ? advisor.name : "Dosen Tidak Dikenal";
}

// Sync Form controls on Settings Page
function syncSettingsForms() {
  dom.sidebarUserName.innerText = appState.profile.name;
  dom.sidebarUserTitle.innerText = appState.profile.major;
  dom.sidebarAvatar.innerText = appState.profile.name.charAt(0).toUpperCase();

  dom.inputStudentName.value = appState.profile.name;
  dom.inputStudentNim.value = appState.profile.nim;
  dom.inputStudentMajor.value = appState.profile.major;
  dom.inputThesisTitle.value = appState.profile.thesisTitle;

  dom.inputDefenseDate.value = appState.profile.defenseDate || '';
  dom.inputMeetingDate.value = appState.meetingTarget.date || '';
  dom.inputMeetingAgenda.value = appState.meetingTarget.agenda || '';

  const checklistContainer = document.getElementById('settings-chapters-checklist-container');
  if (checklistContainer) {
    checklistContainer.innerHTML = '';
    const masterChapters = getMasterChapters();
    masterChapters.forEach(chap => {
      const isApproved = (appState.profile.approvedChapters || []).includes(chap.id);
      checklistContainer.innerHTML += `
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-weight: normal;">
          <input type="checkbox" class="bab-approval-checkbox" data-chapter-id="${chap.id}" ${isApproved ? 'checked' : ''}>
          <span>${chap.title}</span>
        </label>
      `;
    });
  }
  // Hour target inputs
  if (appState.workTarget) {
    const dailyInput = document.getElementById('target-daily-hours');
    const weeklyInput = document.getElementById('target-weekly-hours');
    if (dailyInput) dailyInput.value = appState.workTarget.dailyTargetHours || 4;
    if (weeklyInput) weeklyInput.value = appState.workTarget.weeklyTargetHours || 20;
  }
}

// --- WORK HOUR TRACKER ENGINE ---
function checkAndResetWorkProgress() {
  if (!appState || !appState.workTarget) return;
  const todayStr = new Date().toISOString().split('T')[0];
  if (appState.workTarget.lastLoggedDate !== todayStr) {
    const lastDate = new Date(appState.workTarget.lastLoggedDate || todayStr);
    const todayDate = new Date(todayStr);
    
    // Reset daily
    appState.workTarget.dailyLoggedMinutes = 0;
    
    // Reset weekly if today is Monday (day 1) or if 7+ days elapsed since last log
    if (todayDate.getDay() === 1 || (todayDate - lastDate) >= 7 * 24 * 60 * 60 * 1000) {
      appState.workTarget.weeklyLoggedMinutes = 0;
    }
    
    appState.workTarget.lastLoggedDate = todayStr;
    saveAppState();
  }
}

function logWorkMinutes(minutes) {
  checkAndResetWorkProgress();
  appState.workTarget.dailyLoggedMinutes += minutes;
  appState.workTarget.weeklyLoggedMinutes += minutes;
  saveAppState();
  renderDashboard();
}

function resetDailyTime() {
  if (confirm("Reset seluruh jam kerja yang dicatat hari ini?")) {
    appState.workTarget.weeklyLoggedMinutes = Math.max(0, appState.workTarget.weeklyLoggedMinutes - appState.workTarget.dailyLoggedMinutes);
    appState.workTarget.dailyLoggedMinutes = 0;
    saveAppState();
    renderDashboard();
  }
}

function logCustomWorkMinutes() {
  const input = prompt("Masukkan waktu pengerjaan tugas akhir Anda (contoh: '45' atau '45m' untuk 45 menit, '2j' atau '2' untuk 2 jam):");
  if (!input) return;
  
  let minutes = 0;
  const cleanInput = input.trim().toLowerCase();
  
  if (cleanInput.endsWith('m') || cleanInput.endsWith('menit')) {
    const val = cleanInput.replace(/[a-z]/g, '');
    minutes = parseInt(val);
  } else if (cleanInput.endsWith('j') || cleanInput.endsWith('jam')) {
    const val = cleanInput.replace(/[a-z]/g, '');
    minutes = parseFloat(val) * 60;
  } else {
    const val = parseFloat(cleanInput);
    if (isNaN(val)) {
      alert("Masukkan angka yang valid!");
      return;
    }
    if (val <= 24) {
      minutes = val * 60;
    } else {
      minutes = val;
    }
  }
  
  if (isNaN(minutes) || minutes <= 0) {
    alert("Masukkan format waktu yang valid! Contoh: 45m, 2j, atau 1.5");
    return;
  }
  
  logWorkMinutes(Math.round(minutes));
}

function renderWorkTracker() {
  if (!appState || !appState.workTarget) return;
  checkAndResetWorkProgress();
  
  const dailyHours = (appState.workTarget.dailyLoggedMinutes / 60).toFixed(1).replace(/\.0$/, '');
  const weeklyHours = (appState.workTarget.weeklyLoggedMinutes / 60).toFixed(1).replace(/\.0$/, '');
  
  const dailyTarget = appState.workTarget.dailyTargetHours || 4;
  const weeklyTarget = appState.workTarget.weeklyTargetHours || 20;
  
  const dailyTextEl = document.getElementById('tracker-daily-text');
  const weeklyTextEl = document.getElementById('tracker-weekly-text');
  if (dailyTextEl) dailyTextEl.innerText = `${dailyHours} / ${dailyTarget} Jam`;
  if (weeklyTextEl) weeklyTextEl.innerText = `${weeklyHours} / ${weeklyTarget} Jam`;
  
  const dailyPct = Math.min((appState.workTarget.dailyLoggedMinutes / (dailyTarget * 60)) * 100, 100);
  const weeklyPct = Math.min((appState.workTarget.weeklyLoggedMinutes / (weeklyTarget * 60)) * 100, 100);
  
  const dailyFillEl = document.getElementById('tracker-daily-fill');
  const weeklyFillEl = document.getElementById('tracker-weekly-fill');
  if (dailyFillEl) dailyFillEl.style.width = `${dailyPct}%`;
  if (weeklyFillEl) weeklyFillEl.style.width = `${weeklyPct}%`;

  // Update Dashboard simplified completed hours indicators & progress bars & percentages
  const dbDailyOnly = document.getElementById('db-daily-hours-only');
  const dbWeeklyOnly = document.getElementById('db-weekly-hours-only');
  if (dbDailyOnly) dbDailyOnly.innerText = `${dailyHours} / ${dailyTarget} Jam`;
  if (dbWeeklyOnly) dbWeeklyOnly.innerText = `${weeklyHours} / ${weeklyTarget} Jam`;

  const dbDailyPctEl = document.getElementById('db-daily-hours-pct');
  const dbWeeklyPctEl = document.getElementById('db-weekly-hours-pct');
  if (dbDailyPctEl) dbDailyPctEl.innerText = `(${Math.round(dailyPct)}%)`;
  if (dbWeeklyPctEl) dbWeeklyPctEl.innerText = `(${Math.round(weeklyPct)}%)`;

  const dbDailyFill = document.getElementById('db-daily-hours-fill');
  const dbWeeklyFill = document.getElementById('db-weekly-hours-fill');
  if (dbDailyFill) dbDailyFill.style.width = `${dailyPct}%`;
  if (dbWeeklyFill) dbWeeklyFill.style.width = `${weeklyPct}%`;
}

// --- DASHBOARD RENDERER & LOGIC ---
function renderDashboard() {
  // Render work tracker hour progress
  renderWorkTracker();
  // 1. KPI Counts
  dom.kpiMeetings.innerText = appState.logs.length;
  
  // Pending revisions (Todo + Progress)
  const pendingRevisions = appState.revisions.filter(r => r.status === 'todo' || r.status === 'progress').length;
  dom.kpiRevisions.innerText = pendingRevisions;
  
  let assignedCount = 0;
  if (appState.profile && appState.profile.advisor1Id) assignedCount++;
  if (appState.profile && appState.profile.advisor2Id) assignedCount++;
  dom.kpiAdvisors.innerText = assignedCount;

  // Days left to Defense
  if (appState.profile.defenseDate) {
    const defense = new Date(appState.profile.defenseDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = defense.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      dom.kpiElapsed.innerText = diffDays;
      dom.kpiElapsed.parentElement.querySelector('.stat-label').innerText = "Hari Menuju Sidang";
      dom.kpiElapsed.parentElement.parentElement.querySelector('.stat-icon').className = "stat-icon warning";
    } else if (diffDays === 0) {
      dom.kpiElapsed.innerText = "Hari Ini";
      dom.kpiElapsed.parentElement.querySelector('.stat-label').innerText = "Sidang Tugas Akhir!";
      dom.kpiElapsed.parentElement.parentElement.querySelector('.stat-icon').className = "stat-icon success";
    } else {
      dom.kpiElapsed.innerText = Math.abs(diffDays);
      dom.kpiElapsed.parentElement.querySelector('.stat-label').innerText = "Hari Berlalu Sejak Sidang";
      dom.kpiElapsed.parentElement.parentElement.querySelector('.stat-icon').className = "stat-icon primary";
    }
  } else {
    dom.kpiElapsed.innerText = "-";
    dom.kpiElapsed.parentElement.querySelector('.stat-label').innerText = "Atur Tanggal Sidang";
  }

  // 2. Circular Progress & Sub-progress bar Calculations
  let totalPercent = 0;

  const masterChapters = getMasterChapters();
  const approvedCount = (appState.profile.approvedChapters || []).filter(id => masterChapters.some(c => c.id === id)).length;
  const babPercentage = masterChapters.length > 0 ? Math.round((approvedCount / masterChapters.length) * 75) : 0;
  
  // Revision resolution rate weight: 15% of total
  let revisionPercentage = 0;
  if (appState.revisions.length > 0) {
    const doneRevisions = appState.revisions.filter(r => r.status === 'done').length;
    revisionPercentage = Math.round((doneRevisions / appState.revisions.length) * 15);
  }

  // Advising log session frequency: 10% total (2% per session, capped at 5 sessions)
  const meetingsPercentage = Math.min(appState.logs.length * 2, 10);

  totalPercent = babPercentage + revisionPercentage + meetingsPercentage;

  // Sync Progress text and circular stroke-dashoffset
  dom.progressPctText.innerText = `${totalPercent}%`;
  
  const circumference = 377; // 2 * Math.PI * 60
  const offset = circumference - (circumference * totalPercent) / 100;
  dom.progressRing.style.strokeDashoffset = offset;

  // Fill in the sub-progress bars dynamically
  const detailsList = document.querySelector('.progress-details-list');
  if (detailsList) {
    detailsList.innerHTML = '';
    masterChapters.forEach(chap => {
      const isApproved = (appState.profile.approvedChapters || []).includes(chap.id);
      const pctText = isApproved ? '100% (ACC)' : '0%';
      const fillWidth = isApproved ? '100%' : '0%';
      
      detailsList.innerHTML += `
        <div class="progress-detail-item">
          <div class="progress-detail-meta">
            <span>${chap.title}</span>
            <span>${pctText}</span>
          </div>
          <div class="progress-detail-bar">
            <div class="progress-detail-fill" style="width: ${fillWidth};"></div>
          </div>
        </div>
      `;
    });
  }

  // 3. Render 3 Recent Advising Sessions on Dashboard
  dom.recentLogsContainer.innerHTML = '';
  
  if (appState.logs.length === 0) {
    dom.recentLogsContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Belum ada catatan bimbingan terdaftar.</div>';
    return;
  }

  // Sort logs by date descending and slice the top 3
  const sortedLogs = [...appState.logs].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,3);

  sortedLogs.forEach(log => {
    const advisor = getAdvisorName(log.advisorId);
    
    // Parse nice date tags
    const logDate = new Date(log.date);
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const day = String(logDate.getDate()).padStart(2, '0');
    const month = monthsShort[logDate.getMonth()];
    
    let statusClass = "badge-pending";
    if (log.status === "Approved") statusClass = "badge-approved";
    if (log.status === "Needs Revision") statusClass = "badge-revision";

    dom.recentLogsContainer.innerHTML += `
      <div class="recent-log-item">
        <div class="log-meta-left">
          <div class="log-date-tag">
            <span>${day}</span>
            ${month}
          </div>
          <div class="log-info-text">
            <span class="log-title">${log.topic}</span>
            <span class="log-advisor-sub">${advisor} • ${log.type}</span>
          </div>
        </div>
        <div class="log-meta-right" style="display: flex; align-items: center; gap: 1rem;">
          <span class="badge ${statusClass}">${log.status}</span>
          <button class="btn btn-secondary btn-icon-only btn-sm" onclick="quickViewLog('${log.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
    `;
  });
}

// Quick Redirect to detailed log preview from recent list
window.quickViewLog = function(logId) {
  switchTab('logs');
  dom.searchLogInput.value = '';
  renderLogsTable();
  openLogModal(logId);
};

// --- COUNTDOWN TIMER MODULE ---
let countdownInterval = null;

function startCountdownTimer() {
  if (countdownInterval) clearInterval(countdownInterval);

  const countdownText = document.getElementById('next-meeting-info');
  
  function updateCountdown() {
    if (!appState.meetingTarget || !appState.meetingTarget.date) {
      countdownText.innerHTML = "Belum ada jadwal terdekat bimbingan.";
      document.getElementById('cd-days').innerText = "00";
      document.getElementById('cd-hours').innerText = "00";
      document.getElementById('cd-mins').innerText = "00";
      return;
    }

    const target = new Date(appState.meetingTarget.date);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      countdownText.innerHTML = `<strong style="color: var(--warning);">Sesi Bimbingan Lewat/Berlangsung</strong><br>${appState.meetingTarget.agenda || 'Tanpa Agenda'}`;
      document.getElementById('cd-days').innerText = "00";
      document.getElementById('cd-hours').innerText = "00";
      document.getElementById('cd-mins').innerText = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');

    // Human readable meeting details formatting
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateFormatted = target.toLocaleDateString('id-ID', options);
    
    countdownText.innerHTML = `<strong>${dateFormatted} WIB</strong><br><span style="font-size:0.75rem; color: var(--text-secondary);">${appState.meetingTarget.agenda || 'Tanpa Agenda'}</span>`;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 60000); // refresh every minute
}

// --- LOG BIMBINGAN CRUD MODULE ---
function renderLogsTable() {
  const query = dom.searchLogInput.value.toLowerCase().trim();
  const filterAdvisor = dom.filterAdvisorSelect.value;
  const filterStatus = dom.filterStatusSelect.value;

  // Toggle visual filter reset button
  if (query || filterAdvisor !== 'all' || filterStatus !== 'all') {
    dom.btnClearFilters.style.display = 'block';
  } else {
    dom.btnClearFilters.style.display = 'none';
  }

  dom.logsTableBody.innerHTML = '';

  let filteredLogs = [...appState.logs];

  // Apply filters
  if (filterAdvisor !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.advisorId === filterAdvisor);
  }
  if (filterStatus !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.status === filterStatus);
  }
  if (query) {
    filteredLogs = filteredLogs.filter(log => 
      log.topic.toLowerCase().includes(query) || 
      log.details.toLowerCase().includes(query) ||
      log.date.includes(query)
    );
  }

  // Sort logs by date descending (Newest first)
  filteredLogs.sort((a,b) => new Date(b.date) - new Date(a.date));

  if (filteredLogs.length === 0) {
    dom.logsTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          Tidak ada data bimbingan yang cocok dengan pencarian Anda.
        </td>
      </tr>
    `;
    return;
  }

  filteredLogs.forEach((log, index) => {
    const advisor = getAdvisorName(log.advisorId);
    
    let statusClass = "badge-pending";
    if (log.status === "Approved") statusClass = "badge-approved";
    if (log.status === "Needs Revision") statusClass = "badge-revision";

    // Format Indonesian Date
    const logDate = new Date(log.date);
    const dateFormatted = logDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Show inline sub-revisions badge inside table column if present
    let revisionIndicator = '';
    const logRevisions = appState.revisions.filter(r => r.logId === log.id);
    if (logRevisions.length > 0) {
      const doneCount = logRevisions.filter(r => r.status === 'done').length;
      revisionIndicator = `
        <div style="display: flex; gap:0.25rem; font-size:0.7rem; color:var(--text-muted); margin-top:0.4rem; background:rgba(0,0,0,0.15); padding:0.2rem 0.5rem; border-radius:var(--radius-sm); width:fit-content;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          Revisi: ${doneCount}/${logRevisions.length} Selesai
        </div>
      `;
    }

    dom.logsTableBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td style="font-weight: 500;">${dateFormatted}</td>
        <td>
          <div style="font-weight:600; font-size:0.9rem;">${advisor}</div>
          <span style="font-size:0.75rem; color:var(--text-muted);">${getAdvisorRole(log.advisorId)}</span>
        </td>
        <td>
          <div style="font-weight:600; font-size:0.95rem; margin-bottom:0.25rem; color:var(--text-primary);">${log.topic}</div>
          <p style="font-size:0.8rem; color:var(--text-secondary); max-width:550px; white-space:pre-wrap;">${log.details || 'Tanpa catatan detail.'}</p>
          ${revisionIndicator}
        </td>
        <td>
          <span style="font-size:0.8rem; font-weight:500;">${log.type}</span>
        </td>
        <td>
          <span class="badge ${statusClass}">${log.status}</span>
        </td>
        <td class="action-column">
          <div class="action-btns">
            <button class="btn btn-secondary btn-icon-only btn-sm" onclick="openLogModal('${log.id}')" title="Edit Log">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-sm" onclick="deleteLog('${log.id}')" title="Hapus Log" style="color:var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

function getAdvisorRole(advisorId) {
  const masterAdvisors = getMasterAdvisors();
  const advisor = masterAdvisors.find(a => a.id === advisorId);
  return advisor ? advisor.role : "";
}

// --- LOG MODAL MANAGEMENTS ---
function openLogModal(logId = null) {
  // Clear previous nested builder state
  nestedRevisionsTemp = [];
  document.getElementById('nested-revisions-list-container').innerHTML = '';
  document.getElementById('nested-revision-input').value = '';

  const modalTitle = document.getElementById('modal-log-title');
  const modalSaveBtn = document.getElementById('modal-log-save-btn');
  const revisionSection = document.getElementById('revision-builder-section');

  // Populate Supervisors dropdown inside Modal just in case
  populateDropdowns();

  if (logId) {
    // Edit existing log mode
    const log = appState.logs.find(l => l.id === logId);
    if (!log) return;

    modalTitle.innerText = "Edit Sesi Bimbingan";
    modalSaveBtn.innerText = "Simpan Perubahan";
    revisionSection.style.display = "none"; // Hide new sub-revisions builder to avoid duplication, edits should go to Kanban/Revision direct modal

    document.getElementById('log-id-input').value = log.id;
    document.getElementById('log-date').value = log.date;
    document.getElementById('log-type').value = log.type;
    document.getElementById('log-advisor').value = log.advisorId;
    document.getElementById('log-status').value = log.status;
    document.getElementById('log-topic').value = log.topic;
    document.getElementById('log-details').value = log.details;
  } else {
    // Create new log mode
    modalTitle.innerText = "Catat Sesi Bimbingan Baru";
    modalSaveBtn.innerText = "Simpan Log";
    revisionSection.style.display = "block";

    document.getElementById('log-id-input').value = '';
    
    // Set default values
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('log-date').value = today;
    document.getElementById('log-type').value = "Tatap Muka (Offline)";
    document.getElementById('log-status').value = "Pending";
    document.getElementById('log-topic').value = '';
    document.getElementById('log-details').value = '';
  }

  dom.modalLog.classList.add('active');
}

function closeLogModal() {
  dom.modalLog.classList.remove('active');
}

// Nested revision builder items inside Session log Modal
function addNestedRevisionRow() {
  const input = document.getElementById('nested-revision-input');
  const text = input.value.trim();
  if (!text) return;

  nestedRevisionsTemp.push(text);
  input.value = '';
  renderNestedRevisionsList();
}

function renderNestedRevisionsList() {
  const container = document.getElementById('nested-revisions-list-container');
  container.innerHTML = '';

  nestedRevisionsTemp.forEach((item, index) => {
    container.innerHTML += `
      <div class="nested-revision-item">
        <span>${index + 1}. ${item}</span>
        <button type="button" class="close-btn" style="font-size: 1rem; color: var(--danger);" onclick="removeNestedRevision(${index})">&times;</button>
      </div>
    `;
  });
}

window.removeNestedRevision = function(index) {
  nestedRevisionsTemp.splice(index, 1);
  renderNestedRevisionsList();
};

function handleLogSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('log-id-input').value;
  const date = document.getElementById('log-date').value;
  const type = document.getElementById('log-type').value;
  const advisorId = document.getElementById('log-advisor').value;
  const status = document.getElementById('log-status').value;
  const topic = document.getElementById('log-topic').value.trim();
  const details = document.getElementById('log-details').value.trim();

  if (!id) {
    // Generate new log
    const newLogId = `log-${Date.now()}`;
    const newLog = {
      id: newLogId,
      date,
      type,
      advisorId,
      topic,
      details,
      status,
      revisions: []
    };

    // Assign nested revisions if added during log creation
    nestedRevisionsTemp.forEach((revText, index) => {
      const newRevId = `rev-${Date.now()}-${index}`;
      const newRev = {
        id: newRevId,
        description: revText,
        advisorId,
        status: "todo",
        logId: newLogId,
        dateAdded: date
      };
      appState.revisions.push(newRev);
      newLog.revisions.push(newRevId);
    });

    appState.logs.push(newLog);
  } else {
    // Update existing log
    const logIndex = appState.logs.findIndex(l => l.id === id);
    if (logIndex !== -1) {
      appState.logs[logIndex].date = date;
      appState.logs[logIndex].type = type;
      appState.logs[logIndex].advisorId = advisorId;
      appState.logs[logIndex].status = status;
      appState.logs[logIndex].topic = topic;
      appState.logs[logIndex].details = details;
    }
  }

  saveAppState();
  closeLogModal();
  renderDashboard();
  renderLogsTable();
  renderKanbanBoard();
  populateDropdowns();
}

window.deleteLog = function(id) {
  if (confirm("Ingin menghapus catatan bimbingan ini? Poin revisi terkait skripsi ini akan tetap dipertahankan.")) {
    appState.logs = appState.logs.filter(l => l.id !== id);
    
    // Sever connection in revisions, but don't delete revisions themselves (they are still valid core corrections)
    appState.revisions.forEach((rev, idx) => {
      if (rev.logId === id) {
        appState.revisions[idx].logId = "";
      }
    });

    saveAppState();
    renderDashboard();
    renderLogsTable();
    renderKanbanBoard();
    populateDropdowns();
  }
};

// --- REVISION KANBAN MODULE (DRAG & DROP + ACTIONS) ---
function renderKanbanBoard() {
  dom.listTodo.innerHTML = '';
  dom.listProgress.innerHTML = '';
  dom.listDone.innerHTML = '';

  const todoItems = appState.revisions.filter(r => r.status === 'todo');
  const progressItems = appState.revisions.filter(r => r.status === 'progress');
  const doneItems = appState.revisions.filter(r => r.status === 'done');

  // Set counts
  dom.countTodo.innerText = todoItems.length;
  dom.countProgress.innerText = progressItems.length;
  dom.countDone.innerText = doneItems.length;

  const renderCard = (rev) => {
    const adv = getAdvisorName(rev.advisorId);
    const sourceLog = appState.logs.find(l => l.id === rev.logId);
    const sourceStr = sourceLog ? `${sourceLog.date} (Log)` : "Mandiri";

    // Quick movement controllers (Left/Right arrow selectors)
    let leftBtn = '';
    let rightBtn = '';

    if (rev.status === 'progress') {
      leftBtn = `<button class="btn btn-secondary btn-icon-only btn-sm" onclick="moveRevision('${rev.id}', 'todo')" title="Pindahkan ke Belum Dikerjakan" style="padding:0; width:24px; height:24px;">←</button>`;
      rightBtn = `<button class="btn btn-secondary btn-icon-only btn-sm" onclick="moveRevision('${rev.id}', 'done')" title="Pindahkan ke Selesai" style="padding:0; width:24px; height:24px;">→</button>`;
    } else if (rev.status === 'todo') {
      rightBtn = `<button class="btn btn-secondary btn-icon-only btn-sm" onclick="moveRevision('${rev.id}', 'progress')" title="Pindahkan ke Sedang Dikerjakan" style="padding:0; width:24px; height:24px;">→</button>`;
    } else if (rev.status === 'done') {
      leftBtn = `<button class="btn btn-secondary btn-icon-only btn-sm" onclick="moveRevision('${rev.id}', 'progress')" title="Pindahkan ke Sedang Dikerjakan" style="padding:0; width:24px; height:24px;">←</button>`;
    }

    const gdriveBanner = rev.gdriveLink ? `
      <div class="gdrive-attachment-banner">
        <a href="${rev.gdriveLink}" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Google Drive Hasil Revisi
        </a>
      </div>
    ` : '';

    return `
      <div class="kanban-card" draggable="true" ondragstart="drag(event, '${rev.id}')" id="card-${rev.id}">
        <div class="revision-desc">${rev.description}</div>
        ${gdriveBanner}
        <div class="revision-meta">
          <div style="display:flex; flex-direction:column; gap:0.15rem;">
            <span class="revision-source" title="${adv}">${adv}</span>
            <span style="font-size:0.65rem; color:var(--text-muted);">Sumber: ${sourceStr}</span>
          </div>
          <div class="revision-actions" style="display: flex; gap:0.25rem; align-items:center;">
            ${leftBtn}
            ${rightBtn}
            <button class="btn btn-secondary btn-icon-only btn-sm" onclick="openRevisionModal('${rev.id}')" title="Edit" style="padding:0; width:24px; height:24px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-sm" onclick="deleteRevision('${rev.id}')" title="Hapus" style="padding:0; width:24px; height:24px; color:var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  };

  todoItems.forEach(item => dom.listTodo.innerHTML += renderCard(item));
  progressItems.forEach(item => dom.listProgress.innerHTML += renderCard(item));
  doneItems.forEach(item => dom.listDone.innerHTML += renderCard(item));
}

// Drag Drop Core Window Bindings
window.allowDrop = function(ev) {
  ev.preventDefault();
};

window.drag = function(ev, id) {
  ev.dataTransfer.setData("text", id);
};

window.handleDrop = function(ev, targetStatus) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  moveRevision(id, targetStatus);
};

window.moveRevision = function(revId, targetStatus) {
  const revIdx = appState.revisions.findIndex(r => r.id === revId);
  if (revIdx !== -1) {
    const rev = appState.revisions[revIdx];
    
    // Prompt for Google Drive link if marking as 'done' and there is no link yet
    if (targetStatus === 'done' && !rev.gdriveLink) {
      const gdrivePrompt = prompt(`🎉 Hebat! Revisi "${rev.description}" telah selesai.\n\nApakah Anda ingin menyimpan/menyematkan link Google Drive hasil perbaikan revisi ini? (Opsional, tempel link di bawah ini):`);
      if (gdrivePrompt !== null) {
        const link = gdrivePrompt.trim();
        if (link) {
          appState.revisions[revIdx].gdriveLink = link;
        }
      }
    }
    
    appState.revisions[revIdx].status = targetStatus;
    saveAppState();
    renderDashboard();
    renderKanbanBoard();
    renderLogsTable(); // update sub-revision badges in log table
  }
};

// Direct Revision modal for edits & additions
function openRevisionModal(revId = null) {
  populateDropdowns();
  const modalTitle = document.getElementById('modal-revision-title');
  
  if (revId) {
    const rev = appState.revisions.find(r => r.id === revId);
    if (!rev) return;

    modalTitle.innerText = "Edit Poin Revisi";
    document.getElementById('revision-id-input').value = rev.id;
    document.getElementById('revision-desc').value = rev.description;
    document.getElementById('revision-advisor').value = rev.advisorId;
    document.getElementById('revision-status').value = rev.status;
    document.getElementById('revision-source-log').value = rev.logId || '';
    document.getElementById('revision-gdrive').value = rev.gdriveLink || '';
  } else {
    modalTitle.innerText = "Tambah Poin Revisi Mandiri";
    document.getElementById('revision-id-input').value = '';
    document.getElementById('revision-desc').value = '';
    document.getElementById('revision-status').value = 'todo';
    document.getElementById('revision-source-log').value = '';
    document.getElementById('revision-gdrive').value = '';
    
    if (appState.advisors.length > 0) {
      document.getElementById('revision-advisor').value = appState.advisors[0].id;
    }
  }

  dom.modalRevision.classList.add('active');
}

function closeRevisionModal() {
  dom.modalRevision.classList.remove('active');
}

function handleRevisionSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('revision-id-input').value;
  const description = document.getElementById('revision-desc').value.trim();
  const advisorId = document.getElementById('revision-advisor').value;
  const status = document.getElementById('revision-status').value;
  const logId = document.getElementById('revision-source-log').value;
  const gdriveLink = document.getElementById('revision-gdrive').value.trim();

  if (!id) {
    // Generate new revision
    const newRevId = `rev-${Date.now()}`;
    const newRev = {
      id: newRevId,
      description,
      advisorId,
      status,
      logId,
      dateAdded: new Date().toISOString().split('T')[0],
      gdriveLink
    };
    appState.revisions.push(newRev);

    // Link back to log if set
    if (logId) {
      const logIdx = appState.logs.findIndex(l => l.id === logId);
      if (logIdx !== -1) {
        appState.logs[logIdx].revisions.push(newRevId);
      }
    }
  } else {
    // Update existing revision
    const revIdx = appState.revisions.findIndex(r => r.id === id);
    if (revIdx !== -1) {
      const oldLogId = appState.revisions[revIdx].logId;
      
      // Update fields
      appState.revisions[revIdx].description = description;
      appState.revisions[revIdx].advisorId = advisorId;
      appState.revisions[revIdx].status = status;
      appState.revisions[revIdx].logId = logId;
      appState.revisions[revIdx].gdriveLink = gdriveLink;

      // Handle Log link changes
      if (oldLogId !== logId) {
        // unlink old log
        if (oldLogId) {
          const oldLogIdx = appState.logs.findIndex(l => l.id === oldLogId);
          if (oldLogIdx !== -1) {
            appState.logs[oldLogIdx].revisions = appState.logs[oldLogIdx].revisions.filter(rid => rid !== id);
          }
        }
        // link new log
        if (logId) {
          const newLogIdx = appState.logs.findIndex(l => l.id === logId);
          if (newLogIdx !== -1) {
            appState.logs[newLogIdx].revisions.push(id);
          }
        }
      }
    }
  }

  saveAppState();
  closeRevisionModal();
  renderDashboard();
  renderKanbanBoard();
  renderLogsTable();
}

window.deleteRevision = function(id) {
  if (confirm("Ingin menghapus poin revisi skripsi ini?")) {
    appState.revisions = appState.revisions.filter(r => r.id !== id);
    
    // Also sever references inside Logs
    appState.logs.forEach((log, idx) => {
      appState.logs[idx].revisions = log.revisions.filter(rid => rid !== id);
    });

    saveAppState();
    renderDashboard();
    renderKanbanBoard();
    renderLogsTable();
  }
};

// --- DOSEN PEMBIMBING DIRECTORY MODULE ---
function renderAdvisors() {
  dom.advisorsContainer.innerHTML = '';
  const masterAdvisors = getMasterAdvisors();

  if (masterAdvisors.length === 0) {
    dom.advisorsContainer.innerHTML = `
      <div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 3rem;">
        Belum ada data Dosen Pembimbing terdaftar secara global.
      </div>
    `;
    return;
  }

  // Hide student "Tambah Pembimbing" button since adding advisors is an admin-only feature!
  const btnAddAdvisorAction = document.getElementById('btn-add-advisor-action');
  if (btnAddAdvisorAction) {
    btnAddAdvisorAction.style.display = 'none';
  }

  let studentAdvisors = masterAdvisors;
  if (appState && appState.profile && (appState.profile.advisor1Id || appState.profile.advisor2Id)) {
    studentAdvisors = masterAdvisors.filter(adv => adv.id === appState.profile.advisor1Id || adv.id === appState.profile.advisor2Id);
  }

  if (studentAdvisors.length === 0) {
    dom.advisorsContainer.innerHTML = `
      <div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 3rem;">
        Anda belum memiliki Dosen Pembimbing yang ditugaskan oleh Admin.
      </div>
    `;
    return;
  }

  studentAdvisors.forEach(adv => {
    const initial = adv.name.charAt(0).toUpperCase();
    
    dom.advisorsContainer.innerHTML += `
      <div class="glass-card advisor-card">
        <div class="advisor-avatar">${initial}</div>
        <h4 class="advisor-name">${adv.name}</h4>
        <span class="advisor-role">${adv.role}</span>
        
        <div class="advisor-details">
          <div class="advisor-detail-row">
            <span class="advisor-detail-label">NIP/NIDN</span>
            <span class="advisor-detail-val">${adv.nip || '-'}</span>
          </div>
          <div class="advisor-detail-row">
            <span class="advisor-detail-label">E-mail</span>
            <span class="advisor-detail-val" style="font-size:0.75rem;">${adv.email || '-'}</span>
          </div>
          <div class="advisor-detail-row">
            <span class="advisor-detail-label">Ruang Kerja</span>
            <span class="advisor-detail-val">${adv.room || '-'}</span>
          </div>
          <div style="text-align: left; font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.75rem; border-top: 1px dashed var(--border-color); padding-top: 0.5rem; width:100%;">
            <strong>Catatan Bimbingan:</strong><br>
            <span style="font-style: italic; display:block; margin-top:0.15rem;">"${adv.notes || 'Tidak ada catatan khusus.'}"</span>
          </div>
        </div>

        <div class="advisor-actions" style="justify-content: center; gap: 0.5rem;">
          ${adv.phone ? `
            <a href="https://wa.me/${adv.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-success btn-sm" style="text-decoration:none;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              WhatsApp
            </a>
          ` : ''}

          ${adv.email ? `
            <a href="mailto:${adv.email}" class="btn btn-secondary btn-sm" style="text-decoration:none;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              E-mail
            </a>
          ` : ''}
        </div>
      </div>
    `;
  });
}

function openAdvisorModal(advId = null) {
  const modalTitle = document.getElementById('modal-advisor-title');
  const masterAdvisors = getMasterAdvisors();
  
  if (advId) {
    const adv = masterAdvisors.find(a => a.id === advId);
    if (!adv) return;

    modalTitle.innerText = "Edit Dosen Pembimbing";
    document.getElementById('advisor-id-input').value = adv.id;
    document.getElementById('advisor-name').value = adv.name;
    document.getElementById('advisor-role').value = adv.role;
    document.getElementById('advisor-nip').value = adv.nip || '';
    document.getElementById('advisor-phone').value = adv.phone || '';
    document.getElementById('advisor-email').value = adv.email || '';
    document.getElementById('advisor-room').value = adv.room || '';
    document.getElementById('advisor-notes').value = adv.notes || '';
  } else {
    modalTitle.innerText = "Tambah Dosen Pembimbing Baru";
    document.getElementById('advisor-id-input').value = '';
    document.getElementById('advisor-name').value = '';
    document.getElementById('advisor-role').value = 'Pembimbing I (Utama)';
    document.getElementById('advisor-nip').value = '';
    document.getElementById('advisor-phone').value = '';
    document.getElementById('advisor-email').value = '';
    document.getElementById('advisor-room').value = '';
    document.getElementById('advisor-notes').value = '';
  }

  dom.modalAdvisor.classList.add('active');
}

function closeAdvisorModal() {
  dom.modalAdvisor.classList.remove('active');
}

function handleAdvisorSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('advisor-id-input').value;
  const name = document.getElementById('advisor-name').value.trim();
  const role = document.getElementById('advisor-role').value;
  const nip = document.getElementById('advisor-nip').value.trim();
  const phone = document.getElementById('advisor-phone').value.trim();
  const email = document.getElementById('advisor-email').value.trim();
  const room = document.getElementById('advisor-room').value.trim();
  const notes = document.getElementById('advisor-notes').value.trim();

  const username = getActiveUser();
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userMeta = users.find(u => u.username === username);
  const isAdmin = userMeta && userMeta.role === 'admin';

  if (isAdmin) {
    let masterAdvisors = getMasterAdvisors();
    if (!id) {
      const newAdv = {
        id: `adv-${Date.now()}`,
        name,
        role,
        nip,
        phone,
        email,
        room,
        notes
      };
      masterAdvisors.push(newAdv);
    } else {
      const advIdx = masterAdvisors.findIndex(a => a.id === id);
      if (advIdx !== -1) {
        masterAdvisors[advIdx] = { id, name, role, nip, phone, email, room, notes };
      }
    }
    localStorage.setItem(MASTER_ADVISORS_KEY, JSON.stringify(masterAdvisors));
    closeAdvisorModal();
    renderAdminComponents();
  } else {
    // legacy student support
    closeAdvisorModal();
  }
}

window.deleteAdvisor = function(id) {
  if (confirm("Ingin menghapus dosen pembimbing ini?")) {
    let masterAdvisors = getMasterAdvisors();
    masterAdvisors = masterAdvisors.filter(a => a.id !== id);
    localStorage.setItem(MASTER_ADVISORS_KEY, JSON.stringify(masterAdvisors));
    renderDashboard();
    renderAdvisors();
    populateDropdowns();
  }
};

// --- BACKUP & RESTORE DATA HANDLERS ---
function exportDataToJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  
  const datestamp = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `Backup_Bimbingan_Skripsi_${appState.profile.name.replace(/\s+/g, '_')}_${datestamp}.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importDataFromJSON(e) {
  const fileReader = new FileReader();
  const file = e.target.files[0];
  
  if (!file) return;

  fileReader.onload = function(event) {
    try {
      const importedData = JSON.parse(event.target.result);
      
      // Simple verification check to ensure JSON scheme matches basic required objects
      if (importedData.profile && importedData.advisors && importedData.logs && importedData.revisions) {
        appState = importedData;
        saveAppState();
        alert("Data diary skripsi berhasil dipulihkan dari file JSON!");
        location.reload();
      } else {
        alert("Format file tidak valid. Silakan gunakan berkas cadangan JSON yang valid dari aplikasi ini.");
      }
    } catch (err) {
      alert("Gagal membaca berkas JSON cadangan.");
      console.error(err);
    }
  };
  fileReader.readAsText(file);
}

// --- OFFICIAL PRINT LAYOUT CONTROLLER ---
function triggerPrintController() {
  // Sync the metadata to the print block before printing
  document.getElementById('print-student-name').innerText = appState.profile.name;
  document.getElementById('print-student-nim').innerText = appState.profile.nim;
  document.getElementById('print-thesis-title').innerText = appState.profile.thesisTitle;
  
  // Find Pembimbing 1 and Pembimbing 2
  const pembimbing1 = appState.advisors.find(a => a.role.includes("I (Utama)"));
  const pembimbing2 = appState.advisors.find(a => a.role.includes("II (Pendamping)"));

  document.getElementById('print-advisor-1').innerText = pembimbing1 ? pembimbing1.name : "-";
  document.getElementById('print-advisor-2').innerText = pembimbing2 ? pembimbing2.name : "-";

  document.getElementById('print-sig-name-1').innerText = pembimbing1 ? pembimbing1.name : "___________________________";
  document.getElementById('print-sig-nip-1').innerText = pembimbing1 && pembimbing1.nip ? pembimbing1.nip : "....................................................";
  
  document.getElementById('print-sig-name-2').innerText = pembimbing2 ? pembimbing2.name : "___________________________";
  document.getElementById('print-sig-nip-2').innerText = pembimbing2 && pembimbing2.nip ? pembimbing2.nip : "....................................................";
  
  document.getElementById('print-sig-student').innerText = appState.profile.name;

  // Print Date
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('print-current-date').innerText = new Date().toLocaleDateString('id-ID', options);

  // Trigger Print sheet
  window.print();
}

// --- AUTHENTICATION SYSTEMS (LOGIN, REGISTER, LOGOUT) ---
function setupAuthListeners() {
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');
  const loginSlide = document.getElementById('login-slide');
  const registerSlide = document.getElementById('register-slide');

  if (linkToRegister) {
    linkToRegister.addEventListener('click', () => {
      loginSlide.style.display = 'none';
      registerSlide.style.display = 'block';
      document.getElementById('login-error-msg').style.display = 'none';
    });
  }

  if (linkToLogin) {
    linkToLogin.addEventListener('click', () => {
      registerSlide.style.display = 'none';
      loginSlide.style.display = 'block';
      document.getElementById('register-error-msg').style.display = 'none';
    });
  }

  // Bind login form submit
  const loginForm = document.getElementById('auth-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Bind register form submit
  const registerForm = document.getElementById('auth-register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username').value.trim().toLowerCase();
  const passwordInput = document.getElementById('login-password').value;
  const errorMsg = document.getElementById('login-error-msg');

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

  if (user) {
    // Login success!
    sessionStorage.setItem(SESSION_USER_KEY, usernameInput);
    errorMsg.style.display = 'none';
    
    // Clear login inputs
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    // Initialize application state
    initAppState();
    
    if (user.role === 'admin') {
      setupAdminEventListeners();
      renderAdminComponents();
    } else {
      renderAppComponents();
    }
  } else {
    // Login failed
    errorMsg.style.display = 'block';
  }
}

function handleRegister(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('register-username').value.trim().toLowerCase();
  const passwordInput = document.getElementById('register-password').value;
  const nameInput = document.getElementById('register-name').value.trim();
  const nimInput = document.getElementById('register-nim').value.trim();
  const majorInput = document.getElementById('register-major').value.trim();
  const errorMsg = document.getElementById('register-error-msg');

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const userExists = users.some(u => u.username === usernameInput);

  if (userExists) {
    errorMsg.style.display = 'block';
    return;
  }

  // Register success!
  const newUser = {
    username: usernameInput,
    password: passwordInput,
    name: nameInput,
    nim: nimInput,
    major: majorInput
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  errorMsg.style.display = 'none';
  
  // Clear register inputs
  document.getElementById('register-username').value = '';
  document.getElementById('register-password').value = '';
  document.getElementById('register-name').value = '';
  document.getElementById('register-nim').value = '';
  document.getElementById('register-major').value = '';

  // Initialize clean state for self-registered student
  const blankState = {
    profile: {
      name: nameInput,
      nim: nimInput,
      major: majorInput,
      thesisTitle: "",
      defenseDate: "",
      approvedChapters: [],
      advisor1Id: "",
      advisor2Id: ""
    },
    meetingTarget: { date: "", agenda: "" },
    advisors: [],
    logs: [],
    revisions: [],
    workTarget: {
      dailyTargetHours: 0,
      weeklyTargetHours: 0,
      dailyLoggedMinutes: 0,
      weeklyLoggedMinutes: 0,
      lastLoggedDate: ""
    }
  };
  localStorage.setItem(`diary_tugas_akhir_state_${usernameInput}`, JSON.stringify(blankState));

  alert("Pendaftaran akun berhasil! Silakan masuk log menggunakan username dan kata sandi baru Anda.");
  
  // Slide back to login screen
  document.getElementById('register-slide').style.display = 'none';
  document.getElementById('login-slide').style.display = 'block';
}

function handleLogout() {
  if (confirm("Apakah Anda yakin ingin keluar dari sesi diary skripsi Anda saat ini?")) {
    saveAppState();
    sessionStorage.removeItem(SESSION_USER_KEY);
    
    // Reset view title to Dashboard
    switchTab('dashboard');
    
    // Re-initialize app state (which returns to auth screen)
    initAppState();
  }
}

// ==================== ADMIN PANEL MODULES ====================

function getAllStudentsData() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const students = users.filter(u => u.role !== 'admin');
  
  return students.map(student => {
    const userStateKey = `diary_tugas_akhir_state_${student.username}`;
    const stateStr = localStorage.getItem(userStateKey);
    let state = null;
    if (stateStr) {
      try {
        state = JSON.parse(stateStr);
      } catch(e) {
        state = null;
      }
    }
    
    let progress = 0;
    let meetingsCount = 0;
    if (state) {
      const masterChapters = getMasterChapters();
      const approvedCount = (state.profile.approvedChapters || []).filter(id => masterChapters.some(c => c.id === id)).length;
      const babPercentage = masterChapters.length > 0 ? Math.round((approvedCount / masterChapters.length) * 75) : 0;
      
      let revisionPercentage = 0;
      if (state.revisions && state.revisions.length > 0) {
        const doneRevisions = state.revisions.filter(r => r.status === 'done').length;
        revisionPercentage = Math.round((doneRevisions / state.revisions.length) * 15);
      }
      
      const meetingsPercentage = Math.min((state.logs ? state.logs.length : 0) * 2, 10);
      progress = babPercentage + revisionPercentage + meetingsPercentage;
      meetingsCount = state.logs ? state.logs.length : 0;
    }
    
    return {
      username: student.username,
      name: student.name,
      nim: student.nim,
      major: student.major,
      progress: progress,
      meetingsCount: meetingsCount,
      state: state
    };
  });
}

function renderAdminComponents() {
  const students = getAllStudentsData();
  const masterAdvisors = getMasterAdvisors();

  // 1. KPI Counts
  const totalStudentsEl = document.getElementById('admin-kpi-total-students');
  const totalAdvisorsEl = document.getElementById('admin-kpi-total-advisors');
  if (totalStudentsEl) totalStudentsEl.innerText = students.length;
  if (totalAdvisorsEl) totalAdvisorsEl.innerText = masterAdvisors.length;

  // 2. Render Tables
  renderAdminStudentsTable(students);
  renderAdminAdvisorsTable(masterAdvisors);
  renderAdminChaptersTable();
}

function renderAdminStudentsTable(students) {
  const tbody = document.getElementById('admin-students-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (students.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          Belum ada mahasiswa terdaftar.
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student, index) => {
    const progress = student.progress;
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${student.name}</div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">@${student.username}</span>
        </td>
        <td style="font-weight: 500;">${student.nim}</td>
        <td>${student.major}</td>
        <td>
          <div class="progress-container">
            <div class="progress-detail-bar" style="height: 8px; flex-grow: 1; margin-bottom: 0;">
              <div class="progress-detail-fill" style="width: ${progress}%; background: linear-gradient(to right, var(--primary), var(--secondary));"></div>
            </div>
            <span class="progress-label-micro">${progress}%</span>
          </div>
        </td>
        <td style="text-align: center; font-weight: 700; color: var(--primary);">${student.meetingsCount}x</td>
        <td style="text-align: center;">
          <button class="btn btn-secondary btn-sm" onclick="inspectStudent('${student.username}')">
            Detail &rarr;
          </button>
        </td>
      </tr>
    `;
  });
}

window.inspectStudent = function(username) {
  const students = getAllStudentsData();
  const student = students.find(s => s.username === username);
  if (!student) return;

  document.getElementById('inspect-student-name').innerText = student.name;
  document.getElementById('inspect-student-meta').innerText = `NIM: ${student.nim} • Jurusan: ${student.major} (@${student.username})`;
  document.getElementById('inspect-student-username-input').value = student.username;

  // Populate Advisor Penugasan dropdowns
  const adv1Select = document.getElementById('inspect-advisor1-select');
  const adv2Select = document.getElementById('inspect-advisor2-select');
  const masterAdvisors = getMasterAdvisors();

  adv1Select.innerHTML = '<option value="">-- Belum Ditugaskan --</option>';
  adv2Select.innerHTML = '<option value="">-- Belum Ditugaskan --</option>';

  masterAdvisors.forEach(adv => {
    adv1Select.innerHTML += `<option value="${adv.id}">${adv.name} (${adv.role.split(' ')[0]})</option>`;
    adv2Select.innerHTML += `<option value="${adv.id}">${adv.name} (${adv.role.split(' ')[0]})</option>`;
  });

  const state = student.state;

  if (state && state.profile) {
    adv1Select.value = state.profile.advisor1Id || '';
    adv2Select.value = state.profile.advisor2Id || '';
  } else {
    adv1Select.value = '';
    adv2Select.value = '';
  }

  const inspectThesisTitle = document.getElementById('inspect-thesis-title');
  const inspectBabContainer = document.getElementById('inspect-bab-checklist-container');
  const logsTbody = document.getElementById('inspect-logs-table-body');
  const inspectTodo = document.getElementById('inspect-list-todo');
  const inspectProgress = document.getElementById('inspect-list-progress');
  const inspectDone = document.getElementById('inspect-list-done');

  // Clear
  inspectThesisTitle.innerText = "Belum diatur oleh mahasiswa.";
  inspectBabContainer.innerHTML = '';
  logsTbody.innerHTML = '';
  inspectTodo.innerHTML = '';
  inspectProgress.innerHTML = '';
  inspectDone.innerHTML = '';

  if (state) {
    inspectThesisTitle.innerText = state.profile.thesisTitle || "Belum diatur oleh mahasiswa.";

    const renderBabBadge = (label, acc) => {
      const bg = acc ? 'var(--success-glow)' : 'rgba(255,255,255,0.05)';
      const color = acc ? 'var(--success)' : 'var(--text-muted)';
      const border = acc ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)';
      const icon = acc ? '✓' : '✗';
      return `<span style="padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; background: ${bg}; color: ${color}; border: ${border};">${icon} ${label}</span>`;
    };
    const masterChapters = getMasterChapters();
    masterChapters.forEach(chap => {
      const isApproved = (state.profile.approvedChapters || []).includes(chap.id);
      inspectBabContainer.innerHTML += renderBabBadge(chap.title, isApproved);
    });

    if (state.logs && state.logs.length > 0) {
      const sorted = [...state.logs].sort((a,b) => new Date(b.date) - new Date(a.date));
      sorted.forEach((log, index) => {
        const advName = getAdvisorName(log.advisorId);
        let statusClass = "badge-pending";
        if (log.status === "Approved") statusClass = "badge-approved";
        if (log.status === "Needs Revision") statusClass = "badge-revision";
        
        logsTbody.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td style="font-weight: 500;">${log.date}</td>
            <td>
              <div style="font-weight: 600; margin-bottom: 0.15rem;">${log.topic}</div>
              <span style="font-size: 0.75rem; color: var(--text-muted);">${advName} • ${log.type}</span>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem; white-space: pre-wrap;">${log.details || '-'}</p>
            </td>
            <td><span class="badge ${statusClass}">${log.status}</span></td>
          </tr>
        `;
      });
    } else {
      logsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">Belum ada log bimbingan.</td></tr>`;
    }

    if (state.revisions && state.revisions.length > 0) {
      state.revisions.forEach(rev => {
        const advName = getAdvisorName(rev.advisorId);
        const cardHtml = `
          <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.35rem;">
            <div>${rev.description}</div>
            ${rev.gdriveLink ? `<div style="font-size: 0.7rem;"><a href="${rev.gdriveLink}" target="_blank" style="color: var(--secondary); text-decoration: none; display: inline-flex; align-items: center; gap: 0.15rem;">🔗 Link Drive</a></div>` : ''}
            <span style="font-size: 0.65rem; color: var(--text-muted); align-self: flex-end;">${advName}</span>
          </div>
        `;
        if (rev.status === 'todo') inspectTodo.innerHTML += cardHtml;
        else if (rev.status === 'progress') inspectProgress.innerHTML += cardHtml;
        else if (rev.status === 'done') inspectDone.innerHTML += cardHtml;
      });
    }

    if (!inspectTodo.innerHTML) inspectTodo.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';
    if (!inspectProgress.innerHTML) inspectProgress.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';
    if (!inspectDone.innerHTML) inspectDone.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';

  } else {
    inspectThesisTitle.innerText = "Mahasiswa belum masuk / membuat data.";
    logsTbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">Tidak ada data bimbingan.</td></tr>`;
    inspectTodo.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';
    inspectProgress.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';
    inspectDone.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 1rem;">Kosong</div>';
  }

  // Set default active tab within inspection modal to Logs
  document.getElementById('inspect-tab-logs-btn').style.background = 'var(--primary)';
  document.getElementById('inspect-tab-logs-btn').style.color = 'white';
  document.getElementById('inspect-tab-revisions-btn').style.background = '';
  document.getElementById('inspect-tab-revisions-btn').style.color = '';
  document.getElementById('inspect-section-logs').style.display = 'block';
  document.getElementById('inspect-section-revisions').style.display = 'none';

  document.getElementById('modal-student-detail').classList.add('active');
};

function renderAdminAdvisorsTable(advisors) {
  const tbody = document.getElementById('admin-advisors-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (advisors.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          Belum ada dosen terdaftar di direktori master. Silakan klik "Tambah Dosen Global".
        </td>
      </tr>
    `;
    return;
  }

  advisors.forEach((adv, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${adv.name}</div>
        </td>
        <td style="font-weight: 500;">${adv.nip || '-'}</td>
        <td><span class="badge badge-approved" style="font-size:0.7rem;">${adv.role}</span></td>
        <td>
          <div style="font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.15rem;">
            <span>📞 ${adv.phone || '-'}</span>
            <span>✉️ ${adv.email || '-'}</span>
            <span>📍 ${adv.room || '-'}</span>
          </div>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.5rem; justify-content: center;">
            <button class="btn btn-secondary btn-sm btn-icon-only" onclick="adminEditAdvisor('${adv.id}')" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only" onclick="adminDeleteAdvisor('${adv.id}')" title="Hapus" style="color: var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

window.adminEditAdvisor = function(advId) {
  const masterAdvisors = getMasterAdvisors();
  const adv = masterAdvisors.find(a => a.id === advId);
  if (!adv) return;

  const modalTitle = document.getElementById('modal-advisor-title');
  modalTitle.innerText = "Edit Dosen Master Global";
  document.getElementById('advisor-id-input').value = adv.id;
  document.getElementById('advisor-name').value = adv.name;
  document.getElementById('advisor-role').value = adv.role;
  document.getElementById('advisor-nip').value = adv.nip || '';
  document.getElementById('advisor-phone').value = adv.phone || '';
  document.getElementById('advisor-email').value = adv.email || '';
  document.getElementById('advisor-room').value = adv.room || '';
  document.getElementById('advisor-notes').value = adv.notes || '';

  document.getElementById('modal-advisor').classList.add('active');
};

window.adminDeleteAdvisor = function(advId) {
  if (confirm("Ingin menghapus dosen pembimbing ini secara global? Aksi ini akan menghapus opsi pilihan dosen untuk semua mahasiswa.")) {
    let masterAdvisors = getMasterAdvisors();
    masterAdvisors = masterAdvisors.filter(a => a.id !== advId);
    localStorage.setItem(MASTER_ADVISORS_KEY, JSON.stringify(masterAdvisors));
    renderAdminComponents();
  }
};

function renderAdminChaptersTable() {
  const tbody = document.getElementById('admin-chapters-table-body');
  if (!tbody) return;

  const chapters = getMasterChapters();
  tbody.innerHTML = '';

  if (chapters.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: var(--text-muted); padding: 3rem;">
          Belum ada bab terdaftar. Silakan klik "Tambah Bab Baru".
        </td>
      </tr>
    `;
    return;
  }

  chapters.forEach((chap, index) => {
    tbody.innerHTML += `
      <tr>
        <td style="font-weight: bold;">${index + 1}</td>
        <td>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${chap.title}</div>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 0.5rem; justify-content: center;">
            <button class="btn btn-secondary btn-sm btn-icon-only" onclick="adminEditChapter('${chap.id}')" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-icon-only" onclick="adminDeleteChapter('${chap.id}')" title="Hapus" style="color: var(--danger);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

window.adminEditChapter = function(chapId) {
  const masterChapters = getMasterChapters();
  const chap = masterChapters.find(c => c.id === chapId);
  if (!chap) return;

  const modalTitle = document.getElementById('modal-chapter-title');
  modalTitle.innerText = "Edit Bab Skripsi";
  document.getElementById('chapter-id-input').value = chap.id;
  document.getElementById('chapter-title-input').value = chap.title;

  document.getElementById('modal-chapter').classList.add('active');
};

window.adminDeleteChapter = function(chapId) {
  if (confirm("Ingin menghapus bab ini secara global? Aksi ini akan menghapus status kemajuan bab ini untuk semua mahasiswa.")) {
    let masterChapters = getMasterChapters();
    masterChapters = masterChapters.filter(c => c.id !== chapId);
    localStorage.setItem(MASTER_CHAPTERS_KEY, JSON.stringify(masterChapters));
    renderAdminComponents();
  }
};

function setupAdminEventListeners() {
  const adminNavItems = document.querySelectorAll('.admin-nav-item');
  const adminTabViews = document.querySelectorAll('.admin-tab-view');
  const adminViewTitle = document.getElementById('admin-view-title');
  const adminViewSubtitle = document.getElementById('admin-view-subtitle');

  adminNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedTab = item.getAttribute('data-admin-tab');
      
      adminNavItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      adminTabViews.forEach(view => {
        if (view.id === `admin-${selectedTab}-view`) {
          view.style.display = 'block';
        } else {
          view.style.display = 'none';
        }
      });

      if (selectedTab === 'students') {
        adminViewTitle.innerText = "Dashboard Mahasiswa";
        adminViewSubtitle.innerText = "Pantau kemajuan skripsi seluruh peserta bimbingan UIN Jakarta.";
      } else if (selectedTab === 'manage-advisors') {
        adminViewTitle.innerText = "Kelola Dosen Global";
        adminViewSubtitle.innerText = "Kelola Direktori Master Dosen Pembimbing secara terpusat.";
      } else if (selectedTab === 'manage-chapters') {
        adminViewTitle.innerText = "Kelola Bab Skripsi";
        adminViewSubtitle.innerText = "Kelola daftar bab skripsi secara global.";
      }
    });
  });

  const adminThemeToggleBtn = document.getElementById('admin-theme-toggle');
  if (adminThemeToggleBtn) {
    adminThemeToggleBtn.addEventListener('click', () => {
      let activeTheme = document.documentElement.getAttribute('data-theme');
      let nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      
      updateThemeUI(nextTheme);
      updateAdminThemeUI(nextTheme);
    });
  }

  const adminLogoutBtn = document.getElementById('admin-btn-logout');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      if (confirm("Keluar dari Konsol Admin?")) {
        sessionStorage.removeItem(SESSION_USER_KEY);
        location.reload();
      }
    });
  }

  const adminAddAdvBtn = document.getElementById('admin-btn-add-advisor');
  if (adminAddAdvBtn) {
    adminAddAdvBtn.addEventListener('click', () => {
      const modalTitle = document.getElementById('modal-advisor-title');
      modalTitle.innerText = "Tambah Dosen Master Global";
      document.getElementById('advisor-id-input').value = '';
      document.getElementById('advisor-name').value = '';
      document.getElementById('advisor-role').value = 'Pembimbing I (Utama)';
      document.getElementById('advisor-nip').value = '';
      document.getElementById('advisor-phone').value = '';
      document.getElementById('advisor-email').value = '';
      document.getElementById('advisor-room').value = '';
      document.getElementById('advisor-notes').value = '';
      
      document.getElementById('modal-advisor').classList.add('active');
    });
  }

  const adminAddChapBtn = document.getElementById('admin-btn-add-chapter');
  if (adminAddChapBtn) {
    adminAddChapBtn.addEventListener('click', () => {
      const modalTitle = document.getElementById('modal-chapter-title');
      modalTitle.innerText = "Tambah Bab Skripsi";
      document.getElementById('chapter-id-input').value = '';
      document.getElementById('chapter-title-input').value = '';
      
      document.getElementById('modal-chapter').classList.add('active');
    });
  }

  const closeChapter1 = document.getElementById('modal-chapter-close');
  const closeChapter2 = document.getElementById('modal-chapter-cancel');
  const modalChapter = document.getElementById('modal-chapter');

  if (closeChapter1) {
    closeChapter1.addEventListener('click', () => {
      modalChapter.classList.remove('active');
    });
  }
  if (closeChapter2) {
    closeChapter2.addEventListener('click', () => {
      modalChapter.classList.remove('active');
    });
  }
  if (modalChapter) {
    modalChapter.addEventListener('click', (e) => {
      if (e.target === modalChapter) {
        modalChapter.classList.remove('active');
      }
    });
  }

  const formChapter = document.getElementById('form-chapter');
  if (formChapter) {
    formChapter.addEventListener('submit', (e) => {
      e.preventDefault();
      const chapId = document.getElementById('chapter-id-input').value;
      const title = document.getElementById('chapter-title-input').value.trim();

      let masterChapters = getMasterChapters();

      if (chapId) {
        // Edit mode
        const index = masterChapters.findIndex(c => c.id === chapId);
        if (index !== -1) {
          masterChapters[index].title = title;
        }
      } else {
        // Add mode
        const newId = `chap-${Date.now()}`;
        masterChapters.push({ id: newId, title: title });
      }

      localStorage.setItem(MASTER_CHAPTERS_KEY, JSON.stringify(masterChapters));
      alert("Bab skripsi berhasil disimpan secara global!");
      modalChapter.classList.remove('active');
      renderAdminComponents();
    });
  }

  const adminAddStudentBtn = document.getElementById('admin-btn-add-student');
  if (adminAddStudentBtn) {
    adminAddStudentBtn.addEventListener('click', () => {
      document.getElementById('student-username-input').value = '';
      document.getElementById('student-password-input').value = '';
      document.getElementById('student-name-input').value = '';
      document.getElementById('student-nim-input').value = '';
      document.getElementById('student-major-input').value = '';
      document.getElementById('modal-student').classList.add('active');
    });
  }

  const closeStudent1 = document.getElementById('modal-student-close');
  const closeStudent2 = document.getElementById('modal-student-cancel');
  const modalStudent = document.getElementById('modal-student');

  if (closeStudent1) {
    closeStudent1.addEventListener('click', () => {
      modalStudent.classList.remove('active');
    });
  }
  if (closeStudent2) {
    closeStudent2.addEventListener('click', () => {
      modalStudent.classList.remove('active');
    });
  }
  if (modalStudent) {
    modalStudent.addEventListener('click', (e) => {
      if (e.target === modalStudent) {
        modalStudent.classList.remove('active');
      }
    });
  }

  const formStudent = document.getElementById('form-student');
  if (formStudent) {
    formStudent.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('student-username-input').value.trim().toLowerCase();
      const password = document.getElementById('student-password-input').value;
      const name = document.getElementById('student-name-input').value.trim();
      const nim = document.getElementById('student-nim-input').value.trim();
      const major = document.getElementById('student-major-input').value.trim();

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const userExists = users.some(u => u.username === username);

      if (userExists) {
        alert("Username sudah terdaftar! Silakan gunakan username lain.");
        return;
      }

      const newUser = {
        username: username,
        password: password,
        name: name,
        nim: nim,
        major: major,
        role: "student"
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Create blank template: completely empty regarding advisors, logs, revisions and targets
      const blankState = {
        profile: {
          name: name,
          nim: nim,
          major: major,
          thesisTitle: "",
          defenseDate: "",
          approvedChapters: [],
          advisor1Id: "",
          advisor2Id: ""
        },
        meetingTarget: { date: "", agenda: "" },
        advisors: [],
        logs: [],
        revisions: [],
        workTarget: {
          dailyTargetHours: 0,
          weeklyTargetHours: 0,
          dailyLoggedMinutes: 0,
          weeklyLoggedMinutes: 0,
          lastLoggedDate: ""
        }
      };
      localStorage.setItem(`diary_tugas_akhir_state_${username}`, JSON.stringify(blankState));

      alert(`Berhasil mendaftarkan mahasiswa baru: ${name} (@${username})!`);
      modalStudent.classList.remove('active');
      renderAdminComponents();
    });
  }

  const inspectTabLogs = document.getElementById('inspect-tab-logs-btn');
  const inspectTabRevisions = document.getElementById('inspect-tab-revisions-btn');
  const inspectSecLogs = document.getElementById('inspect-section-logs');
  const inspectSecRevisions = document.getElementById('inspect-section-revisions');

  if (inspectTabLogs && inspectTabRevisions) {
    inspectTabLogs.addEventListener('click', () => {
      inspectTabLogs.style.background = 'var(--primary)';
      inspectTabLogs.style.color = 'white';
      inspectTabRevisions.style.background = '';
      inspectTabRevisions.style.color = '';
      inspectSecLogs.style.display = 'block';
      inspectSecRevisions.style.display = 'none';
    });

    inspectTabRevisions.addEventListener('click', () => {
      inspectTabRevisions.style.background = 'var(--primary)';
      inspectTabRevisions.style.color = 'white';
      inspectTabLogs.style.background = '';
      inspectTabLogs.style.color = '';
      inspectSecLogs.style.display = 'none';
      inspectSecRevisions.style.display = 'block';
    });
  }

  const closeStudentDetail1 = document.getElementById('modal-student-detail-close');
  const closeStudentDetail2 = document.getElementById('modal-student-detail-close-btn');
  const modalStudentDetail = document.getElementById('modal-student-detail');

  if (closeStudentDetail1) {
    closeStudentDetail1.addEventListener('click', () => {
      modalStudentDetail.classList.remove('active');
    });
  }
  if (closeStudentDetail2) {
    closeStudentDetail2.addEventListener('click', () => {
      modalStudentDetail.classList.remove('active');
    });
  }

  modalStudentDetail.addEventListener('click', (e) => {
    if (e.target === modalStudentDetail) {
      modalStudentDetail.classList.remove('active');
    }
  });

  // Assign Advisor Form submit listener
  const inspectAssignForm = document.getElementById('inspect-assign-advisors-form');
  if (inspectAssignForm) {
    inspectAssignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const studentUsername = document.getElementById('inspect-student-username-input').value;
      const advisor1Id = document.getElementById('inspect-advisor1-select').value;
      const advisor2Id = document.getElementById('inspect-advisor2-select').value;
      
      const userStateKey = `diary_tugas_akhir_state_${studentUsername}`;
      const stateStr = localStorage.getItem(userStateKey);
      
      let studentState = null;
      if (stateStr) {
        try {
          studentState = JSON.parse(stateStr);
        } catch(err) {
          studentState = null;
        }
      }
      
      if (!studentState) {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const studentMeta = users.find(u => u.username === studentUsername);
        studentState = {
          profile: {
            name: studentMeta ? studentMeta.name : "Mahasiswa UIN",
            nim: studentMeta ? studentMeta.nim : "",
            major: studentMeta ? studentMeta.major : "Teknik Informatika",
            thesisTitle: "",
            defenseDate: "",
            approvedChapters: []
          },
          meetingTarget: { date: "", agenda: "" },
          advisors: [],
          logs: [],
          revisions: [],
          workTarget: {
            dailyTargetHours: 4,
            weeklyTargetHours: 20,
            dailyLoggedMinutes: 0,
            weeklyLoggedMinutes: 0,
            lastLoggedDate: new Date().toISOString().split('T')[0]
          }
        };
      }
      
      if (!studentState.profile) studentState.profile = {};
      studentState.profile.advisor1Id = advisor1Id;
      studentState.profile.advisor2Id = advisor2Id;
      
      localStorage.setItem(userStateKey, JSON.stringify(studentState));
      alert(`Berhasil memperbarui penugasan dosen pembimbing untuk @${studentUsername}!`);
      
      if (modalStudentDetail) modalStudentDetail.classList.remove('active');
      renderAdminComponents();
    });
  }
}

function updateAdminThemeUI(theme) {
  const adminThemeIcon = document.getElementById('admin-theme-icon');
  const adminThemeText = document.getElementById('admin-theme-text');
  if (!adminThemeIcon || !adminThemeText) return;

  if (theme === 'light') {
    adminThemeIcon.innerHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>`;
    adminThemeText.innerText = "Dark Mode";
  } else {
    adminThemeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    adminThemeText.innerText = "Light Mode";
  }
}
