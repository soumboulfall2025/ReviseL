import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminHeader from './components/AdminHeader';
import SubjectsAdmin from './pages/SubjectsAdmin';
import StudentProgress from './pages/StudentProgress';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (!token || !user) return <Navigate to="/login" replace />;
  try {
    const parsed = JSON.parse(user);
    if (parsed.role !== 'admin') return <Navigate to="/login" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <AdminHeader />
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/subjects" element={
          <PrivateRoute>
            <SubjectsAdmin />
          </PrivateRoute>
        } />
        <Route path="/etudiant/:id" element={
          <PrivateRoute>
            <StudentProgress />
          </PrivateRoute>
        } />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
