import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register"; // if you have it
import ProtectedRoute from "./ProtectedRoute";
import Companies from "../pages/company/Companies";
import CompanyDetails from "../pages/company/CompanyDetails";
import Contacts from "../pages/contacts/Contacts";
import Jobs from "../pages/jobs/Jobs";
import JobDetails from "../pages/jobs/JobDetails";
import Candidates from "../pages/candidate/Candidates";
import CandidateDetails from "../pages/candidate/CandidateDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* First Page */}
      <Route path="/" element={<Login />} />

      {/* Optional Register */}
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Companies />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Contacts />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Jobs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidates"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Candidates />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CompanyDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JobDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidates/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CandidateDetails />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Add more routes for contacts, jobs, users as needed */}
    </Routes>
  );
};

export default AppRoutes;
