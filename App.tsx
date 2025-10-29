/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import AdminDashboard from './components/PromptForm'; // Re-purposed for AdminDashboard
import StudentDashboard from './components/VideoResult'; // Re-purposed for StudentDashboard
import * as dataService from './services/geminiService';
import {User} from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const allUsers = dataService.getUsers();
    setUsers(allUsers);

    // Load last used user or default to first student
    const lastUserId = localStorage.getItem('assignment_hub_currentUser');
    const lastUser = allUsers.find((u) => u.id === lastUserId);

    if (lastUser) {
      setCurrentUser(lastUser);
    } else if (allUsers.length > 0) {
      const firstStudent =
        allUsers.find((u) => u.role === 'student') || allUsers[0];
      setCurrentUser(firstStudent);
      if (firstStudent) {
        localStorage.setItem('assignment_hub_currentUser', firstStudent.id);
      }
    }
  }, []);

  const handleUserChange = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('assignment_hub_currentUser', user.id);
    }
  };

  if (!currentUser) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-700">
        <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center p-4 gap-4 sm:gap-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-green-400 bg-clip-text text-transparent">
            Assignment Hub
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Viewing as:</span>
            <select
              value={currentUser.id}
              onChange={(e) => handleUserChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
              <optgroup label="Admins">
                {users
                  .filter((u) => u.role === 'admin')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Students">
                {users
                  .filter((u) => u.role === 'student')
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      </header>
      <main className="w-full max-w-6xl mx-auto py-8 px-4">
        {currentUser.role === 'student' ? (
          <StudentDashboard user={currentUser} />
        ) : (
          <AdminDashboard user={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;
