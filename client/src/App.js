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
import AdminMain from "./pages/adminPages/AdminMain";
import CreatePolicyPage from "./pages/clientPages/CreatePolicyForm";
import AdminUser from "./pages/adminPages/AdminUser";
import AdminPolicy from "./pages/adminPages/AdminPolicy";
import AdminAssessment from "./pages/adminPages/AdminAssessment";

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
                    path="/admin/main"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminMain />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/user"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminUser />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/policy"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminPolicy />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/assessment"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminAssessment />
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
