import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import ErrorBoundary from './components/ErrorBoundary';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';

const App = () => {
  console.log('App component rendering...');
  
  const { currentRole } = useSelector(state => state.user);
  console.log('Current role:', currentRole);

  // Handle invalid roles from old data
  const validRoles = ["Admin", "Student", "Teacher"];
  const isValidRole = validRoles.includes(currentRole);
  const showPublicRoutes = !isValidRole;

  return (
    <ErrorBoundary>
      <Router>
        {showPublicRoutes && (
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/choose" element={<ChooseUser visitor="normal" />} />
            <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />

            <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
            <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
            <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />

            <Route path="/Adminregister" element={<AdminRegisterPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

        {currentRole === "Admin" && <ErrorBoundary><AdminDashboard /></ErrorBoundary>}
        {currentRole === "Student" && <ErrorBoundary><StudentDashboard /></ErrorBoundary>}
        {currentRole === "Teacher" && <ErrorBoundary><TeacherDashboard /></ErrorBoundary>}
      </Router>
    </ErrorBoundary>
  );
};

export default App;
