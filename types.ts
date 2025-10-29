/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Assignment {
  id: string;
  creatorId: string; // admin user id
  title: string;
  description: string;
}

export interface Submission {
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
}