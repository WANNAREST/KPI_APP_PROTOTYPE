export const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Hệ thống Quản lý KPI Nội bộ",
    startDate: "2026-03-01",
    endDate: "2026-06-01",
    status: "Planning",
    sprints: 4,
    requirements: {
      taskList: [
        { name: "Thiết kế Schema DB", skill: "SQL", weight: 5 },
        { name: "Viết API Core", skill: "NodeJS", weight: 8 },
        { name: "Giao diện Dashboard", skill: "React", weight: 7 },
        { name: "Viết Unit Test", skill: "Jest", weight: 4 }
      ]
    },
    createdAt: new Date().toISOString()
  }
];

export const MOCK_EMPLOYEES = [
  { id: 1, name: "Nguyễn Văn A", position: "Backend Lead", department: "Kỹ thuật", costPerHour: 50, skills: { "NodeJS": 5, "SQL": 4, "Docker": 3 } },
  { id: 2, name: "Trần Thị B", position: "Frontend Dev", department: "Kỹ thuật", costPerHour: 40, skills: { "React": 5, "CSS": 5, "Figma": 4 } },
  { id: 3, name: "Lê Văn C", position: "Fullstack Dev", department: "Kỹ thuật", costPerHour: 45, skills: { "NodeJS": 4, "React": 4, "SQL": 5 } },
  { id: 4, name: "Phạm Thị D", position: "Tester", department: "QC", costPerHour: 30, skills: { "Jest": 5, "Manual Test": 5, "Automation": 4 } }
];

export const MOCK_TASKS = [
  { id: 1, projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ", assigneeId: 3, assigneeName: "Lê Văn C", name: "Thiết kế Schema DB", status: "Done", type: "Task", estimate: 2, taskWeight: 5, bugCount: 0, actualStartTime: "2026-03-02", actualEndTime: "2026-03-04" },
  { id: 2, projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ", assigneeId: 1, assigneeName: "Nguyễn Văn A", name: "Viết API Core", status: "Inprogress", type: "Task", estimate: 5, taskWeight: 8, bugCount: 2, actualStartTime: "2026-03-05" },
  { id: 3, projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ", assigneeId: 2, assigneeName: "Trần Thị B", name: "Giao diện Dashboard", status: "Todo", type: "Task", estimate: 4, taskWeight: 7 },
  { id: 4, projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ", assigneeId: 4, assigneeName: "Phạm Thị D", name: "Viết Unit Test", status: "Todo", type: "Task", estimate: 3, taskWeight: 4 }
];

export const MOCK_KPIS = [
  { id: 1, name: "Velocity", target: 24, unit: "pts/sprint", projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ" },
  { id: 2, name: "Quality", target: 95, unit: "%", projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ" },
  { id: 3, name: "Cycle Time", target: 3, unit: "days", projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ" },
  { id: 4, name: "Completion Rate", target: 100, unit: "%", projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ" }
];

export const MOCK_ASSETS = [
  { id: 1, code: "LAP_001", name: "MacBook Pro M2", type: "Laptop", projectId: 1, projectName: "Hệ thống Quản lý KPI Nội bộ", status: "using" },
  { id: 2, code: "LAP_002", name: "Dell XPS 15", type: "Laptop", projectId: null, status: "available" }
];

export const MOCK_WORKLOGS = [
  { id: 1, taskId: 1, taskName: "Thiết kế Schema DB", employeeId: 3, employeeName: "Lê Văn C", oldStatus: "Todo", newStatus: "Inprogress", timestamp: "2026-03-02T09:00:00Z" },
  { id: 2, taskId: 1, taskName: "Thiết kế Schema DB", employeeId: 3, employeeName: "Lê Văn C", oldStatus: "Inprogress", newStatus: "Done", timestamp: "2026-03-04T17:00:00Z" }
];

export const MOCK_DASHBOARD = {
  stats: { totalProjects: 1, totalEmployees: 4, totalKpis: 4, totalTasks: 4, totalAssets: 2 },
  evalStats: { totalEmployees: 4, totalTasks: 4, doneTasks: 1, avgCompletion: 25, systemHealth: "Good" },
  projectData: [
    { name: 'KPI System', target: 24, actual: 5 },
    { name: 'E-Comm', target: 80, actual: 0 },
    { name: 'CRM', target: 60, actual: 0 }
  ],
  trendData: [
    { day: 'Thứ 2', avgScore: 80 },
    { day: 'Thứ 3', avgScore: 82 },
    { day: 'Thứ 4', avgScore: 85 },
    { day: 'Thứ 5', avgScore: 84 },
    { day: 'Thứ 6', avgScore: 88 },
    { day: 'Thứ 7', avgScore: 90 },
    { day: 'Chủ Nhật', avgScore: 92 },
  ],
  kpiStatusData: [
    { name: 'Đạt (Pass)', value: 1, color: '#fba918' },
    { name: 'Chưa đạt', value: 3, color: '#fb7185' }
  ]
};
