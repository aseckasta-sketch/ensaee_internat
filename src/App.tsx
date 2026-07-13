/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Vitrine from './components/Vitrine';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Eleve } from './types';

type AppRole = 'public' | 'login' | 'eleve' | 'admin';

export default function App() {
  const [role, setRole] = useState<AppRole>('public');
  const [currentUser, setCurrentUser] = useState<Eleve | null>(null);

  const handleLogin = (newRole: 'eleve' | 'admin', user: Eleve | null) => {
    setCurrentUser(user);
    setRole(newRole);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRole('public');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {role === 'public' && (
        <Vitrine onGoToLogin={() => setRole('login')} />
      )}

      {role === 'login' && (
        <Login onLogin={handleLogin} onBackToPublic={() => setRole('public')} />
      )}

      {role === 'eleve' && currentUser && (
        <StudentDashboard student={currentUser} onLogout={handleLogout} />
      )}

      {role === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
