/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Assignment, Role, Submission, User} from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  {id: 'admin1', name: 'Professor Oak', role: 'admin'},
  {id: 'student1', name: 'Ash Ketchum', role: 'student'},
  {id: 'student2', name: 'Misty Williams', role: 'student'},
  {id: 'student3', name: 'Brock Harrison', role: 'student'},
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign1',
    creatorId: 'admin1',
    title: 'React Hooks Deep Dive',
    description:
      'Create a project demonstrating advanced usage of useState, useEffect, and useContext.',
  },
  {
    id: 'assign2',
    creatorId: 'admin1',
    title: 'Tailwind CSS for Responsive Design',
    description:
      'Build a fully responsive landing page using Tailwind CSS utility classes.',
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  {assignmentId: 'assign1', studentId: 'student1', submittedAt: new Date()},
];

// LocalStorage Keys
const USERS_KEY = 'assignment_hub_users';
const ASSIGNMENTS_KEY = 'assignment_hub_assignments';
const SUBMISSIONS_KEY = 'assignment_hub_submissions';

// Initialization
const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(ASSIGNMENTS_KEY)) {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(MOCK_ASSIGNMENTS));
  }
  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(MOCK_SUBMISSIONS));
  }
};

initializeData();

// Data Access Functions
export const getUsers = (role?: Role): User[] => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
  if (role) {
    return users.filter((u) => u.role === role);
  }
  return users;
};

export const getAssignments = (creatorId?: string): Assignment[] => {
  const assignments = JSON.parse(
    localStorage.getItem(ASSIGNMENTS_KEY) || '[]',
  ) as Assignment[];
  if (creatorId) {
    return assignments.filter((a) => a.creatorId === creatorId);
  }
  return assignments;
};

export const getSubmissions = (filters?: {
  assignmentId?: string;
  studentId?: string;
}): Submission[] => {
  let submissions = JSON.parse(
    localStorage.getItem(SUBMISSIONS_KEY) || '[]',
  ) as Submission[];
  if (filters?.assignmentId) {
    submissions = submissions.filter(
      (s) => s.assignmentId === filters.assignmentId,
    );
  }
  if (filters?.studentId) {
    submissions = submissions.filter((s) => s.studentId === filters.studentId);
  }
  return submissions.map((s) => ({...s, submittedAt: new Date(s.submittedAt)}));
};

export const createAssignment = (
  assignment: Omit<Assignment, 'id'>,
): Assignment => {
  const assignments = getAssignments();
  const newAssignment: Assignment = {...assignment, id: `assign${Date.now()}`};
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify([...assignments, newAssignment]));
  return newAssignment;
};

export const submitAssignment = (
  assignmentId: string,
  studentId: string,
): Submission => {
  const submissions = getSubmissions();
  const newSubmission: Submission = {
    assignmentId,
    studentId,
    submittedAt: new Date(),
  };
  const existingSubmission = submissions.find(
    (s) => s.assignmentId === assignmentId && s.studentId === studentId,
  );
  if (existingSubmission) {
    return existingSubmission; // Already submitted
  }
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([...submissions, newSubmission]));
  return newSubmission;
};