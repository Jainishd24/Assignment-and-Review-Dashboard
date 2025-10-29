/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import {Assignment, Submission, User} from '../types';
import * as dataService from '../services/geminiService';
import {
  AssignmentIcon,
  PlusCircleIcon,
  UsersIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
} from './icons';

interface AdminDashboardProps {
  user: User;
}

const CreateAssignmentForm: React.FC<{
  onAssignmentCreated: () => void;
  adminId: string;
}> = ({onAssignmentCreated, adminId}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required.');
      return;
    }
    dataService.createAssignment({creatorId: adminId, title, description});
    // Reset form
    setTitle('');
    setDescription('');
    setIsExpanded(false);
    onAssignmentCreated();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors mb-6">
        <PlusCircleIcon className="w-6 h-6" />
        Create New Assignment
      </button>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">New Assignment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

const AssignmentDetails: React.FC<{
  assignment: Assignment;
  students: User[];
  submissions: Submission[];
}> = ({assignment, students, submissions}) => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-b-lg">
      <h4 className="font-semibold text-gray-300 mb-2">Submission Status:</h4>
      <ul className="space-y-2">
        {students.map((student) => {
          const hasSubmitted = submissions.some((s) => s.studentId === student.id);
          return (
            <li
              key={student.id}
              className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{student.name}</span>
              {hasSubmitted ? (
                <span className="font-medium text-green-400">Submitted</span>
              ) : (
                <span className="font-medium text-yellow-400">Not Submitted</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({user}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    setStudents(dataService.getUsers('student'));
  }, [user]);

  const loadData = () => {
    setAssignments(dataService.getAssignments(user.id));
    setAllSubmissions(dataService.getSubmissions());
  };

  const getSubmissionStats = (assignmentId: string) => {
    const submissionsForAssignment = allSubmissions.filter(
      (s) => s.assignmentId === assignmentId,
    );
    return {
      count: submissionsForAssignment.length,
      total: students.length,
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-200 mb-6">
        Manage Assignments
      </h2>
      <CreateAssignmentForm onAssignmentCreated={loadData} adminId={user.id} />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            You haven't created any assignments yet.
          </p>
        ) : (
          assignments.map((assignment) => {
            const stats = getSubmissionStats(assignment.id);
            const progress = stats.total > 0 ? (stats.count / stats.total) * 100 : 0;
            const isExpanded = expandedAssignment === assignment.id;
            return (
              <div
                key={assignment.id}
                className="bg-gray-800 border border-gray-700 rounded-lg transition-all hover:border-indigo-500">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-600/20 p-3 rounded-full flex-shrink-0">
                        <AssignmentIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {assignment.title}
                        </h3>
                        <p className="text-gray-400 mt-1">
                          {assignment.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex-shrink-0 flex items-center gap-4 self-start md:self-center">
                      <div className="flex items-center gap-2 text-gray-300">
                        <UsersIcon className="w-5 h-5" />
                        <span className="font-medium">
                          {stats.count} / {stats.total} Submitted
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setExpandedAssignment(isExpanded ? null : assignment.id)
                        }
                        className="p-2 rounded-full hover:bg-gray-700">
                        <ChevronDownIcon
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{width: `${progress}%`}}></div>
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <AssignmentDetails
                    assignment={assignment}
                    students={students}
                    submissions={allSubmissions.filter(
                      (s) => s.assignmentId === assignment.id,
                    )}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;