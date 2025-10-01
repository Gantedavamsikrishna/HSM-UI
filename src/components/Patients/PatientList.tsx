import React, { useState, useMemo } from "react";
import {
  Plus,
  CreditCard as Edit,
  Eye,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Patient } from "../../types";
import { format } from "date-fns";
import SearchFilter from "../Common/SearchFilter";
import Pagination from "../Common/Pagination";
import PatientForm from "./PatientForm";

interface PatientListProps {
  patients: Patient[];
  onAddPatient: (
    patient: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => void;
  onUpdatePatient: (
    id: string,
    patient: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => void;
  onViewPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onViewPatient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();

  const itemsPerPage = 10;

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        searchTerm === "" ||
        patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);

      const matchesGender =
        selectedGender === "" || patient.gender === selectedGender;

      return matchesSearch && matchesGender;
    });
  }, [patients, searchTerm, selectedGender]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPatients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleAddPatient = () => {
    setEditingPatient(undefined);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormSubmit = (
    patientData: Omit<Patient, "id" | "createdAt" | "updatedAt">
  ) => {
    if (editingPatient) {
      onUpdatePatient(editingPatient.id, patientData);
    } else {
      onAddPatient(patientData);
    }
    setShowForm(false);
    setEditingPatient(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPatient(undefined);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Management
          </h1>
          <p className="text-gray-600">Manage and view all patient records</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={genderOptions}
        selectedFilter={selectedGender}
        onFilterChange={setSelectedGender}
        placeholder="Search patients by name, email, or phone..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {patient.gender} • Age {calculateAge(patient.dateOfBirth)}
                  </p>
                  {patient.bloodGroup && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Registered{" "}
                    {(() => {
                      const date =
                        patient.createdAt &&
                        !isNaN(new Date(patient.createdAt).getTime())
                          ? new Date(patient.createdAt)
                          : null;
                      return date ? format(date, "MMM dd, yyyy") : "-";
                    })()}
                  </span>
                </div>
              </div>

              {/* FIX: Ensure field renders even if null, using optional chaining and fallback */}
              {(patient.allergies || patient.medicalHistory) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Allergies:</span>{" "}
                    {patient.allergies || "None recorded"}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewPatient(patient)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditPatient(patient)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No patients found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedGender
              ? "Try adjusting your search criteria"
              : "Get started by adding your first patient"}
          </p>
          {!searchTerm && !selectedGender && (
            <button
              onClick={handleAddPatient}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Patient</span>
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPatients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default PatientList;
