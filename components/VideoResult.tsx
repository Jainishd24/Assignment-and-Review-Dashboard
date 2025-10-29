/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import {Assignment, Submission, User} from '../types';
import * as dataService from '../services/geminiService';
import ConfirmDialog from './ApiKeyDialog';
import {AssignmentIcon, CheckCircleIcon, ExternalLinkIcon} from './icons';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({user}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignmentToSubmit, setAssignmentToSubmit] = useState<Assignment | null>(
    null,
  );

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setAssignments(dataService.getAssignments());
    setSubmissions(dataService.getSubmissions({studentId: user.id}));
  };

  const handleSubmission = () => {
    if (assignmentToSubmit) {
      dataService.submitAssignment(assignmentToSubmit.id, user.id);
      setAssignmentToSubmit(null);
      loadData(); // Refresh data
    }
  };

  const isSubmitted = (assignmentId: string) => {
    return submissions.some((s) => s.assignmentId === assignmentId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-200 mb-6">Your Assignments</h2>
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No assignments available yet.
          </p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-indigo-500">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-600/20 p-3 rounded-full flex-shrink-0">
                  <AssignmentIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-400 mt-1">{assignment.description}</p>
                </div>
              </div>
              <div className="w-full md:w-auto flex-shrink-0">
                {isSubmitted(assignment.id) ? (
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-900/50 text-green-300 font-medium rounded-full text-sm w-full md:w-auto">
                    <CheckCircleIcon className="w-5 h-5" />
                    Submitted
                  </div>
                ) : (
                  <button
                    onClick={() => setAssignmentToSubmit(assignment)}
                    className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDialog
        isOpen={!!assignmentToSubmit}
        title="Confirm Submission"
        message={`Are you sure you want to submit "${assignmentToSubmit?.title}"? This action cannot be undone.`}
        onConfirm={handleSubmission}
        onCancel={() => setAssignmentToSubmit(null)}
      />
    </div>
  );
};

export default StudentDashboard;