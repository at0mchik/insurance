import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './components/Login';
import Registration from './components/Registration';

import HomePage from './pages/HomePage';
import Unauthorized from './pages/Unauthorized';
import ClientAssessments from "./pages/clientPages/ClientAssessments";
import ClientPolicies from "./pages/clientPages/ClientPolicies";
import AccountPage from "./components/AccountPage";
import AssessorPendingAssessments from "./pages/assessorPages/AssessorPendingAssessments";
import AssessorAssignedAssessments from "./pages/assessorPages/AssessorAssignedAssessments";
import AdminPage from "./pages/AdminPage";
import CreatePolicyPage from "./pages/clientPages/CreatePolicyForm";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />

                <Route
                    path="/admin/account"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/panel"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/client/policies"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientPolicies />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client/account"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client/assessments"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientAssessments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/client/create"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <CreatePolicyPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessor/account"
                    element={
                        <ProtectedRoute allowedRoles={['assessor']}>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/assessor/pending"
                    element={
                        <ProtectedRoute allowedRoles={['assessor']}>
                            <AssessorPendingAssessments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/assessor/assigned"
                    element={
                        <ProtectedRoute allowedRoles={['assessor']}>
                            <AssessorAssignedAssessments />
                        </ProtectedRoute>
                    }
                />

                <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
        </Router>
    );
}

export default App;
