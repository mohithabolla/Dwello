
export type ProjectType = 'Residential' | 'Commercial' | 'Industrial';

export interface Task {
  id: string;
  name: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  startDate: string;
  endDate: string;
  assignedTeam: string;
  materials: string[];
}

export interface ResourceInfo {
  category: string;
  allocated: number;
  unit: string;
  cost: number;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  area: number;
  floors: number;
  timelineWeeks: number;
  budget: number;
  status: 'Draft' | 'Active' | 'Completed';
  tasks: Task[];
  completionPercentage: number;
  lastUpdated: string;
  location?: string;
  resources?: ResourceInfo[];
  actualSpend?: number;
}

export interface SocialPost {
  id: string;
  projectId: string;
  projectName: string;
  imageUrl: string;
  caption: string;
  likes: number;
  builder: string;
  timestamp: string;
}

export interface User {
  name: string;
  email: string;
  role: 'Builder' | 'Client';
  isLoggedIn: boolean;
}

export interface AppState {
  user: User | null;
  projects: Project[];
  theme: 'light' | 'dark';
}

export interface BackendProject {
  _id: string;
  name: string;
  clientName: string;
  budget: number;
  startDate: string;
  expectedFloors: number;
  currentFloor: number;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  location: string;
  landSize: {
    length: number;
    width: number;
  };
  budgetUsed: number;
  images: string[];
}

export interface Worker {
  _id: string;
  name: string;
  role: string;
  salaryType: 'Daily' | 'Monthly' | 'Contract';
  salaryAmount: number;
  assignedProject?: {
    _id: string;
    name: string;
  };
  attendanceDays: number;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
}

export interface BackendTask {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  project: {
    _id: string;
    name: string;
  };
}
