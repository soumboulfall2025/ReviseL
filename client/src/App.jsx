import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FloatingAssistant from './components/FloatingAssistant';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import SubmissionPage from './pages/SubmissionPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SubjectDetail from './pages/SubjectDetail';
import { AuthProvider, useAuth } from './features/authContext.jsx';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20">Chargement...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <Sidebar />
          <div className="pt-20 pl-0 md:pl-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/matieres" element={
                <PrivateRoute>
                  <SubjectsPage />
                </PrivateRoute>
              } />
              <Route path="/soumission" element={
                <PrivateRoute>
                  <SubmissionPage />
                </PrivateRoute>
              } />
              <Route path="/profil" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/matieres/:id" element={
                <PrivateRoute>
                  <SubjectDetail />
                </PrivateRoute>
              } />
            </Routes>
          </div>
          <FloatingAssistant />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
