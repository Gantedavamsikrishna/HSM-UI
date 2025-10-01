const API_BASE_URL = "/api"; // Use Vite proxy for local/dev, update for production if needed
const getAuthToken = () => {
  return localStorage.getItem("hms_auth")
    ? JSON.parse(localStorage.getItem("hms_auth")).token
    : null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/me");
  },

  updateProfile: async (profileData) => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
};

// Patients API
export const patientsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/patients${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/patients/${id}`);
  },

  create: async (patientData) => {
    return apiRequest("/patients", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
  },

  update: async (id, patientData) => {
    return apiRequest(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patientData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/patients/${id}`, {
      method: "DELETE",
    });
  },

  getAppointments: async (id) => {
    return apiRequest(`/patients/${id}/appointments`);
  },

  getTreatments: async (id) => {
    return apiRequest(`/patients/${id}/treatments`);
  },

  getLabTests: async (id) => {
    return apiRequest(`/patients/${id}/lab-tests`);
  },

  getBills: async (id) => {
    return apiRequest(`/patients/${id}/bills`);
  },
};

// Appointments API
export const appointmentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/appointments${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/appointments/${id}`);
  },

  create: async (appointmentData) => {
    return apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  update: async (id, appointmentData) => {
    return apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    });
  },

  cancel: async (id, reason) => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  },

  complete: async (id) => {
    return apiRequest(`/appointments/${id}/complete`, {
      method: "PUT",
    });
  },

  delete: async (id) => {
    return apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    });
  },

  getToday: async () => {
    return apiRequest("/appointments/today/list");
  },

  getStats: async () => {
    return apiRequest("/appointments/stats/overview");
  },
};

// Bills API
export const billsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/bills${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/bills/${id}`);
  },

  create: async (billData) => {
    return apiRequest("/bills", {
      method: "POST",
      body: JSON.stringify(billData),
    });
  },

  updatePayment: async (id, paymentData) => {
    return apiRequest(`/bills/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    });
  },

  updateStatus: async (id, status) => {
    return apiRequest(`/bills/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/bills/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return apiRequest("/bills/stats/overview");
  },
};

// Treatments API
export const treatmentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/treatments${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/treatments/${id}`);
  },

  create: async (treatmentData) => {
    return apiRequest("/treatments", {
      method: "POST",
      body: JSON.stringify(treatmentData),
    });
  },

  update: async (id, treatmentData) => {
    return apiRequest(`/treatments/${id}`, {
      method: "PUT",
      body: JSON.stringify(treatmentData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/treatments/${id}`, {
      method: "DELETE",
    });
  },

  getByPatient: async (patientId) => {
    return apiRequest(`/treatments/patient/${patientId}`);
  },

  getByDoctor: async (doctorId) => {
    return apiRequest(`/treatments/doctor/${doctorId}`);
  },
};

// Lab Tests API
export const labTestsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/lab-tests${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/lab-tests/${id}`);
  },

  create: async (labTestData) => {
    return apiRequest("/lab-tests", {
      method: "POST",
      body: JSON.stringify(labTestData),
    });
  },

  updateResults: async (id, resultsData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(resultsData).forEach((key) => {
      if (key !== "resultFile" && resultsData[key] !== undefined) {
        formData.append(key, resultsData[key]);
      }
    });

    // Add file if present
    if (resultsData.resultFile) {
      formData.append("resultFile", resultsData.resultFile);
    }

    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/lab-tests/${id}/results`, {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  },

  getResultDownloadUrl: async (id) => {
    return apiRequest(`/lab-tests/${id}/result-url`);
  },

  updateStatus: async (id, status, technician) => {
    return apiRequest(`/lab-tests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, technician }),
    });
  },

  delete: async (id) => {
    return apiRequest(`/lab-tests/${id}`, {
      method: "DELETE",
    });
  },

  getByPatient: async (patientId) => {
    return apiRequest(`/lab-tests/patient/${patientId}`);
  },

  getPending: async () => {
    return apiRequest("/lab-tests/pending/list");
  },

  getStats: async () => {
    return apiRequest("/lab-tests/stats/overview");
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiRequest(`/users/${id}`);
  },

  create: async (userData) => {
    return apiRequest("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return apiRequest(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  updatePassword: async (id, password) => {
    return apiRequest(`/users/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    });
  },

  toggleStatus: async (id) => {
    return apiRequest(`/users/${id}/toggle-status`, {
      method: "PUT",
    });
  },

  delete: async (id) => {
    return apiRequest(`/users/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async () => {
    return apiRequest("/users/stats/overview");
  },

  getByRole: async (role) => {
    return apiRequest(`/users/role/${role}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiRequest("/dashboard/stats");
  },

  getRecentActivities: async (limit = 10) => {
    return apiRequest(`/dashboard/recent-activities?limit=${limit}`);
  },

  getTodaySchedule: async () => {
    return apiRequest("/dashboard/today-schedule");
  },

  getMonthlyStats: async () => {
    return apiRequest("/dashboard/monthly-stats");
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest("/health");
};

export default {
  authAPI,
  patientsAPI,
  appointmentsAPI,
  billsAPI,
  treatmentsAPI,
  labTestsAPI,
  usersAPI,
  dashboardAPI,
  healthCheck,
};
