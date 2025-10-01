import React, { useState, useMemo } from "react";
import {
  Plus,
  Download,
  Eye,
  DollarSign,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";
import { Bill, Patient } from "../../types";
import { format } from "date-fns";
import jsPDF from "jspdf";
import SearchFilter from "../Common/SearchFilter";
import Pagination from "../Common/Pagination";

interface BillingSystemProps {
  bills: Bill[];
  patients: Patient[];
  onCreateBill: (bill: Omit<Bill, "id" | "createdAt">) => void;
  onUpdateBill: (id: string, bill: Partial<Bill>) => void;
}

const BillingSystem: React.FC<BillingSystemProps> = ({
  bills,
  patients,
  onCreateBill,
  onUpdateBill,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  // Add Bill modal state
  const [form, setForm] = useState({
    patientId: "",
    totalAmount: "",
    paidAmount: "",
    status: "pending",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const itemsPerPage = 10;

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.totalAmount || !form.paidAmount) {
      setFormError("Please fill all required fields");
      return;
    }
    setFormError("");
    onCreateBill({
      patientId: form.patientId,
      items: [],
      totalAmount: parseFloat(form.totalAmount),
      paidAmount: parseFloat(form.paidAmount),
      status: form.status as Bill["status"],
      notes: form.notes,
    });
    setShowCreateForm(false);
    setForm({
      patientId: "",
      totalAmount: "",
      paidAmount: "",
      status: "pending",
      notes: "",
    });
  };
  {
   
  }
  {
    showCreateForm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={() => setShowCreateForm(false)}
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4 text-blue-700">Create Bill</h3>
          {formError && <div className="text-red-600 mb-2">{formError}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Patient *
              </label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleFormChange}
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Amount *
              </label>
              <input
                type="number"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleFormChange}
                className="w-full border rounded p-2"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Paid Amount *
              </label>
              <input
                type="number"
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleFormChange}
                className="w-full border rounded p-2"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full border rounded p-2"
              >
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                className="w-full border rounded p-2"
                rows={2}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mt-2"
            >
              Create Bill
            </button>
          </form>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Partial", value: "partial" },
    { label: "Paid", value: "paid" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : "Unknown Patient";
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const patientName = getPatientName(bill.patientId);
      const matchesSearch =
        searchTerm === "" ||
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "" || bill.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [bills, searchTerm, selectedStatus]);

  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBills.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBills, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const generatePDF = (bill: Bill) => {
    const patient = patients.find((p) => p.id === bill.patientId);
    if (!patient) return;

    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(20);
    pdf.text("Hospital Management System", 20, 20);
    pdf.setFontSize(16);
    pdf.text("Invoice", 20, 35);

    // Bill Info
    pdf.setFontSize(12);
    pdf.text(`Invoice #: ${bill.id}`, 20, 50);
    pdf.text(
      `Date: ${format(new Date(bill.createdAt), "MMM dd, yyyy")}`,
      20,
      60
    );

    // Patient Info
    pdf.text("Bill To:", 20, 80);
    pdf.text(`${patient.firstName} ${patient.lastName}`, 20, 90);
    pdf.text(`${patient.email}`, 20, 100);
    pdf.text(`${patient.phone}`, 20, 110);

    // Items
    pdf.text("Description", 20, 130);
    pdf.text("Qty", 100, 130);
    pdf.text("Unit Price", 130, 130);
    pdf.text("Total", 160, 130);

    let yPosition = 145;
    bill.items.forEach((item) => {
      pdf.text(item.description, 20, yPosition);
      pdf.text(item.quantity.toString(), 100, yPosition);
      pdf.text(`$${item.unitPrice.toFixed(2)}`, 130, yPosition);
      pdf.text(`$${item.totalPrice.toFixed(2)}`, 160, yPosition);
      yPosition += 15;
    });

    // Total
    pdf.text(
      `Total Amount: $${bill.totalAmount.toFixed(2)}`,
      20,
      yPosition + 10
    );
    pdf.text(`Paid Amount: $${bill.paidAmount.toFixed(2)}`, 20, yPosition + 25);
    pdf.text(
      `Balance: $${(bill.totalAmount - bill.paidAmount).toFixed(2)}`,
      20,
      yPosition + 40
    );

    pdf.save(`invoice-${bill.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing & Invoices
          </h1>
          <p className="text-gray-600">
            Manage patient billing and generate invoices
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Bill</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                $
                {bills
                  .reduce((sum, bill) => sum + bill.paidAmount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Collected</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                $
                {bills
                  .filter(
                    (bill) =>
                      bill.status === "pending" || bill.status === "partial"
                  )
                  .reduce(
                    (sum, bill) => sum + (bill.totalAmount - bill.paidAmount),
                    0
                  )
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Outstanding</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
              <p className="text-sm text-gray-600">Total Bills</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {bills.filter((bill) => bill.status === "paid").length}
              </p>
              <p className="text-sm text-gray-600">Paid Bills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOptions={statusOptions}
        selectedFilter={selectedStatus}
        onFilterChange={setSelectedStatus}
        placeholder="Search bills by patient name or bill ID..."
      />

      {/* Bills Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">
                  Bill ID
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Patient
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Date
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Total
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Paid
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Balance
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-mono text-sm">{bill.id}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">
                      {getPatientName(bill.patientId)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {format(new Date(bill.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="p-4 font-medium">
                    ${bill.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-green-600 font-medium">
                    ${bill.paidAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-red-600 font-medium">
                    ${(bill.totalAmount - bill.paidAmount).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(
                        bill.status
                      )}`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generatePDF(bill)}
                        className="text-green-600 hover:text-green-800"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBills.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Empty State */}
      {filteredBills.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bills found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedStatus
              ? "Try adjusting your search criteria"
              : "Create your first bill to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BillingSystem;
