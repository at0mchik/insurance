import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import AssessorPage from './pages/AssessorPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/assessor" element={<AssessorPage />} />
        </Routes>
      </Router>
  );
}

export default App;
