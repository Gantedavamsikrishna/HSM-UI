import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import DashboardStats from "./components/Dashboard/DashboardStats";
import RecentActivity from "./components/Dashboard/RecentActivity";
import PatientList from "./components/Patients/PatientList";
import BillingSystem from "./components/Billing/BillingSystem";
import AdminUserManagement from "./components/Admin/AdminUserManagement";
import LabModule from "./components/Lab/LabModule";

import {
  patientsAPI,
  billsAPI,
  appointmentsAPI,
  treatmentsAPI,
  labTestsAPI,
} from "./services/api";
import type { Bill, DashboardStats as StatsType } from "./types";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [patients, setPatients] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          patientsRes,
          billsRes,
          appointmentsRes,
          treatmentsRes,
          labTestsRes,
        ] = await Promise.all([
          patientsAPI.getAll(),
          billsAPI.getAll(),
          appointmentsAPI.getAll(),
          treatmentsAPI.getAll(),
          labTestsAPI.getAll(),
        ]);
        const mapPatient = (p: any) => ({
          id: p.id,
          firstName: p.first_name,
          lastName: p.last_name,
          email: p.email,
          phone: p.phone,
          dateOfBirth: p.date_of_birth,
          gender: p.gender,
          address: p.address,
          emergencyContact: p.emergency_contact,
          emergencyPhone: p.emergency_phone,
          medicalHistory: p.medical_history,
          allergies: p.allergies,
          bloodGroup: p.blood_group,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        });
        const patientArr = (patientsRes.patients || patientsRes || []).map(
          mapPatient
        );
        setPatients(patientArr);
        setBills(billsRes.bills || billsRes || []);
        setAppointments(appointmentsRes.appointments || appointmentsRes || []);
        setTreatments(treatmentsRes.treatments || treatmentsRes || []);
        setLabTests(labTestsRes.labTests || labTestsRes || []);
      } catch (err: any) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const [viewPatient, setViewPatient] = useState<any | null>(null);

  const handleAddPatient = async (patientData: any) => {
    try {
      await patientsAPI.create(patientData);
      const patientsRes = await patientsAPI.getAll();
      setPatients(patientsRes.patients || patientsRes || []);
    } catch (err: any) {
      alert(err.message || "Failed to add patient");
    }
  };

  const handleUpdatePatient = (id: string, patientData: any) => {};

  const handleViewPatient = (patient: any) => {
    setViewPatient(patient);
  };

  const handleCreateBill = async (billData: Omit<Bill, "id" | "createdAt">) => {
    try {
      await billsAPI.create(billData);
      const billsRes = await billsAPI.getAll();
      setBills(billsRes.bills || billsRes || []);
    } catch (err: any) {
      alert(err.message || "Failed to create bill");
    }
  };

  const handleUpdateBill = async (id: string, billData: Partial<Bill>) => {
    try {
      await billsAPI.updateStatus(id, billData.status); // or use a dedicated update endpoint if available
      const billsRes = await billsAPI.getAll();
      setBills(billsRes.bills || billsRes || []);
    } catch (err: any) {
      alert(err.message || "Failed to update bill");
    }
  };

  const dashboardStats: StatsType = {
    totalPatients: patients.length,
    todayAppointments: appointments.filter((apt) => {
      const today = new Date().toDateString();
      return new Date(apt.dateTime).toDateString() === today;
    }).length,
    pendingTests: labTests.filter((test) => test.status === "pending").length,
    totalRevenue: bills.reduce((sum, bill) => sum + bill.paidAmount, 0),
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">
                Here's what's happening at your hospital today.
              </p>
            </div>
            <DashboardStats
              stats={dashboardStats}
              role={user?.role || "doctor"}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveView("patients")}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">Manage Patients</span>
                  </button>
                  {(user?.role === "reception" || user?.role === "admin") && (
                    <button
                      onClick={() => setActiveView("billing")}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">Create Bill</span>
                    </button>
                  )}
                  {(user?.role === "doctor" || user?.role === "admin") && (
                    <button
                      onClick={() => setActiveView("appointments")}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">View Appointments</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "patients":
        return (
          <>
            <PatientList
              patients={patients}
              onAddPatient={handleAddPatient}
              onUpdatePatient={handleUpdatePatient}
              onViewPatient={handleViewPatient}
            />
            {/* Patient View Modal */}
            {viewPatient && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={() => setViewPatient(null)}
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-bold mb-4 text-blue-700">
                    Patient Details
                  </h3>
                  <div className="mb-2">
                    <b>Name:</b> {viewPatient.firstName} {viewPatient.lastName}
                  </div>
                  <div className="mb-2">
                    <b>Email:</b> {viewPatient.email}
                  </div>
                  <div className="mb-2">
                    <b>Phone:</b> {viewPatient.phone}
                  </div>
                  <div className="mb-2">
                    <b>Gender:</b> {viewPatient.gender}
                  </div>
                  <div className="mb-2">
                    <b>Date of Birth:</b> {viewPatient.dateOfBirth}
                  </div>
                  {viewPatient.bloodGroup && (
                    <div className="mb-2">
                      <b>Blood Group:</b> {viewPatient.bloodGroup}
                    </div>
                  )}
                  {viewPatient.allergies && (
                    <div className="mb-2">
                      <b>Allergies:</b> {viewPatient.allergies}
                    </div>
                  )}
                  <div className="mb-2">
                    <b>Registered:</b>{" "}
                    {viewPatient.createdAt
                      ? new Date(viewPatient.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case "users":
        if (user?.role === "admin") {
          return <AdminUserManagement />;
        }
        break;

      case "billing":
        if (user?.role === "reception" || user?.role === "admin") {
          return (
            <BillingSystem
              bills={bills}
              patients={patients}
              onCreateBill={handleCreateBill}
              onUpdateBill={handleUpdateBill}
            />
          );
        }
        break;

      case "lab-tests":
        if (user?.role === "lab") {
          return <LabModule />;
        }
        break;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
            <p className="text-gray-600">This module is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block fixed lg:relative inset-y-0 left-0 z-50`}
      >
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
