import React, { useState } from "react";
import usersData from "../../data/users.json";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

/* OPTIONS */
const roles = ["Admin", "Editor", "Viewer"];
const genders = ["Male", "Female", "Other"];

/* convert to backend format */
const toBackend = (value) => value.toLowerCase();

/* FORM DEFAULT */
const blankForm = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  contactNumber: "",
  email: "",
  role: "",
  username: "",
  password: "",
  address: "", 
  isActive: true,
};

/* Reports-style card design */
const card =
  "rounded-3xl border border-orange-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg break-inside-avoid";

export default function UsersPage() {
  const [users, setUsers] = useState(usersData);

  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});

  /* SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* KPI */
  const totalUsers = users.length;

  const validAges = users.filter((u) => u.age);
  const avgAge =
    validAges.reduce((sum, u) => sum + Number(u.age), 0) /
    (validAges.length || 1);

  /* OPEN MODAL */
  const openModal = (user = null) => {
    setModal({ open: true, id: user?.id ?? null });
    setForm(user || blankForm);
    setErrors({});
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setForm(blankForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* VALIDATION */
  const validate = () => {
    let err = {};

    if (!form.firstName?.trim()) err.firstName = "Required";
    if (!form.lastName?.trim()) err.lastName = "Required";
    if (!form.email?.trim()) err.email = "Required";
    if (!form.username?.trim()) err.username = "Required";
    if (!form.password?.trim()) err.password = "Required";
    if (!form.age?.toString().trim()) err.age = "Required";
    if (!form.contactNumber?.trim()) err.contactNumber = "Required";
    if (!form.gender) err.gender = "Required";
    if (!form.role) err.role = "Required";
    if (!form.address?.trim()) err.address = "Required";

    if (form.email && !form.email.includes("@"))
      err.email = "Enter a valid email";

    if (form.password && form.password.length < 8)
      err.password = "Password must be at least 8 characters";

    if (form.username && form.username.includes(" "))
      err.username = "Username cannot contain spaces";

    if (form.age && isNaN(form.age))
      err.age = "Age must be a number";

    if (form.contactNumber && !/^\d{11}$/.test(form.contactNumber))
      err.contactNumber = "Must be exactly 11 digits";

    return err;
  };

  /* SUBMIT */
  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    const formattedForm = {
      ...form,
      role: toBackend(form.role),
      gender: toBackend(form.gender),
    };

    if (modal.id) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === modal.id ? { ...formattedForm, id: modal.id } : u
        )
      );
    } else {
      const newId = users.length
        ? Math.max(...users.map((u) => u.id)) + 1
        : 1;

      setUsers([...users, { ...formattedForm, id: newId }]);
    }

    closeModal();
  };

  /* TOGGLE STATUS */
  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  /* FILTER LOGIC */
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : u.role === roleFilter.toLowerCase();

    const matchesGender =
      genderFilter === "all" ? true : u.gender === genderFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? u.isActive
        : !u.isActive;

    return matchesSearch && matchesRole && matchesGender && matchesStatus;
  });

  /* TABLE */
  const columns = [
    { field: "id", headerName: "ID", width: 70 },

    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      valueGetter: (_, row) =>
        `${row.firstName} ${row.lastName}`,
    },

    { field: "username", headerName: "Username", width: 120 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "age", headerName: "Age", width: 80 },

    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (p) => (
        <span className={p.row.isActive ? "text-green-500" : "text-gray-400"}>
          {p.row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      renderCell: (p) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(p.row)}
            className="px-2 py-1 border border-orange-400 rounded text-orange-400 font-medium"
          >
            Edit
          </button>

          <button
            onClick={() => toggleStatus(p.row.id)}
            className="px-2 py-1 bg-orange-500 rounded text-white"
          >
            {p.row.isActive ? "Disable" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400">Users</h1>
          <p className="text-gray-400 mt-2">Manage system users</p>
        </div>

        {/* KPI */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className={card}>
            <p className="text-gray-400">Total Users</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {totalUsers}
            </h2>
          </div>

          <div className={card}>
            <p className="text-gray-400">Average Age</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {avgAge.toFixed(1)}
            </h2>
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="grid md:grid-cols-5 gap-3 mb-6">

          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="all">All Genders</option>
            {genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => openModal()}
            className="bg-orange-500 px-4 py-2 rounded-lg"
          >
            Add User
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl p-4">
          <DataGrid rows={filteredUsers} columns={columns} autoHeight />
        </div>

      </div>

      {/* MODAL */}
      <Dialog
        open={modal.open}
        onClose={closeModal}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f97316",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#f97316",
          },
          "& .Mui-focused": {
            color: "#f97316",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {modal.id ? "Edit User" : "Add User"}
          </DialogTitle>

          <DialogContent>
            <div className="grid grid-cols-2 gap-4 mt-2">

              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
              />

              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />

              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
              />

              <TextField
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                fullWidth
              />

              <TextField
                label="Contact Number"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
                fullWidth
              />

              <TextField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
              />

              <TextField
                select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                fullWidth
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
                error={!!errors.role}
                helperText={errors.role}
                fullWidth
              >
                {roles.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>

            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeModal} sx={{ color: "#f97316" }}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#f97316",
                "&:hover": { backgroundColor: "#ea580c" },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
  );
}