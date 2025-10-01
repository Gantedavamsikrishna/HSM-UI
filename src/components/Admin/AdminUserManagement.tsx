import React, { useEffect, useState } from "react";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { usersAPI } from "../../services/api";
import { User } from "../../types";

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await usersAPI.getAll();
      // Map backend snake_case fields to frontend camelCase
      const mappedUsers = data.users.map((u: any) => ({
        id: u.id,
        email: u.email,
        password: "", // not sent from backend
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
        phone: u.phone,
        isActive: u.is_active === 1 || u.is_active === true,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  // Add user fields
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addRole, setAddRole] = useState("doctor");
  const [addIsActive, setAddIsActive] = useState(true);
  const [addPassword, setAddPassword] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  // Open delete modal
  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await usersAPI.delete(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  // Open edit modal
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setShowEditModal(true);
  };

  // Confirm edit
  const confirmEdit = async () => {
    if (!selectedUser) return;
    try {
      await usersAPI.update(selectedUser.id, {
        first_name: editFirstName,
        last_name: editLastName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
        is_active: editIsActive ? 1 : 0,
      });
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  // Add user handler
  const handleAddUser = async () => {
    if (
      !addFirstName ||
      !addLastName ||
      !addEmail ||
      !addPhone ||
      !addRole ||
      !addPassword
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      await usersAPI.create({
        firstName: addFirstName,
        lastName: addLastName,
        email: addEmail,
        phone: addPhone,
        role: addRole,
        is_active: addIsActive ? 1 : 0,
        password: addPassword,
      });
      setShowAddModal(false);
      setAddFirstName("");
      setAddLastName("");
      setAddEmail("");
      setAddPhone("");
      setAddRole("doctor");
      setAddIsActive(true);
      setAddPassword("");
      setError("");
      fetchUsers();
    } catch (err) {
      setError("Failed to add user");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" /> Manage Users
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          + Add User
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </td>
                <td className="p-2 border">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit className="inline w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => openDeleteModal(user)}
                  >
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Add User</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={addFirstName}
                  onChange={(e) => setAddFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={addLastName}
                  onChange={(e) => setAddLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  type="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="reception">Reception</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={addIsActive ? "active" : "inactive"}
                  onChange={(e) => setAddIsActive(e.target.value === "active")}
                >
                  {" "}
                  <option value="active">Active</option>{" "}
                  <option value="inactive">Inactive</option>{" "}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  type="password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleAddUser}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <b>
                {selectedUser.firstName} {selectedUser.lastName}
              </b>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  type="tel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="reception">Reception</option>
                  <option value="lab">Lab</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={editIsActive ? "active" : "inactive"}
                  onChange={(e) => setEditIsActive(e.target.value === "active")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={confirmEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
