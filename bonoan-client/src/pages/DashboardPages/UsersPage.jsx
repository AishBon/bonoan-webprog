import React, { useState, useEffect, useCallback } from "react";

import {
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { DataGrid } from "@mui/x-data-grid";

import { fetchUsers, createUser, updateUser } from "../../services/UserService";

/* ─── OPTIONS ────────────────────────────────────────────────────── */
const TYPES = ["admin", "editor", "viewer"];
const GENDERS = ["male", "female", "other"];

const labelize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

/* ─── Blank form ─────────────────────────────────────────────────── */
const blankForm = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  contactNumber: "",
  email: "",
  type: "",
  username: "",
  password: "",
  address: "",
  isActive: true,
};

const card =
  "rounded-3xl border border-orange-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg";

/* ─── Component ──────────────────────────────────────────────────── */
export default function UsersPage() {
  /* AUTH */
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  })();

  const isEditor = currentUser?.type === "editor";

  /* STATE */
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* TOAST */
  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  /* LOAD USERS */
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setApiError("");
      const { data } = await fetchUsers();
      setUsers(
        data.users.map((u, i) => ({
          ...u,
          id: u._id ?? u.id ?? i + 1,
        })),
      );
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* KPI */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const validAges = users.filter((u) => u.age);
  const avgAge =
    validAges.reduce((sum, u) => sum + Number(u.age), 0) /
    (validAges.length || 1);

  /* MODAL */
  const openModal = (user = null) => {
    setModal({ open: true, id: user?._id ?? user?.id ?? null });
    setForm(user ? { ...user, password: "" } : blankForm);
    setErrors({});
    setShowPassword(false);
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setForm(blankForm);
    setErrors({});
    setShowPassword(false);
  };

  /* FIX: onChange only updates form value — no error clearing while typing */
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* VALIDATION */
  const validate = () => {
    const err = {};

    if (!form.firstName?.trim()) err.firstName = "Required";
    if (!form.lastName?.trim()) err.lastName = "Required";

    if (!form.age?.toString().trim()) err.age = "Required";
    else if (isNaN(form.age.toString().trim())) err.age = "Must be a number";

    if (!form.gender) err.gender = "Required";

    if (!form.contactNumber?.trim()) err.contactNumber = "Required";
    else if (!/^\d{11}$/.test(form.contactNumber.trim()))
      err.contactNumber = "Must be exactly 11 digits";

    if (!form.email?.trim()) err.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      err.email = "Invalid email";

    if (!form.type) err.type = "Required";

    if (!form.username?.trim()) err.username = "Required";
    else if (/\s/.test(form.username)) err.username = "No spaces allowed";

    if (!modal.id && !form.password) err.password = "Required";
    else if (form.password && form.password.length < 8)
      err.password = "At least 8 characters";

    if (!form.address?.trim()) err.address = "Required";

    const email = form.email.trim().toLowerCase();
    const username = form.username.trim().toLowerCase();

    if (
      users.some(
        (u) => (u._id ?? u.id) !== modal.id && u.email?.toLowerCase() === email,
      )
    )
      err.email = "Email already exists";

    if (
      users.some(
        (u) =>
          (u._id ?? u.id) !== modal.id &&
          u.username?.toLowerCase() === username,
      )
    )
      err.username = "Username already exists";

    return err;
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: form.age.toString().trim(),
        gender: form.gender.toLowerCase(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim().toLowerCase(),
        type: form.type.toLowerCase(),
        username: form.username.trim().toLowerCase(),
        address: form.address.trim(),
        isActive: form.isActive,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (modal.id) {
        await updateUser(modal.id, payload);
        showToast("User updated successfully.");
      } else {
        payload.password = form.password;
        await createUser(payload);
        showToast("User created successfully.");
      }

      await loadUsers();
      closeModal();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to save user.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* TOGGLE STATUS */
  const toggleStatus = async (id, isActive) => {
    try {
      await updateUser(id, { isActive: !isActive });
      await loadUsers();
      showToast(`User ${!isActive ? "activated" : "disabled"}.`);
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  /* FILTER */
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || u.type === typeFilter;
    const matchesGender = genderFilter === "all" || u.gender === genderFilter;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? u.isActive
          : !u.isActive;
    return matchesSearch && matchesType && matchesGender && matchesStatus;
  });

  /* TABLE COLUMNS */
  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      valueGetter: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { field: "username", headerName: "Username", width: 140 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "age", headerName: "Age", width: 80 },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      valueGetter: (_, row) => labelize(row.gender),
    },
    {
      field: "type",
      headerName: "Role",
      width: 100,
      valueGetter: (_, row) => labelize(row.type),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (p) => (
        <Chip
          size="small"
          label={p.row.isActive ? "Active" : "Inactive"}
          color={p.row.isActive ? "success" : "default"}
        />
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
            className="px-2 py-1 border border-orange-400 rounded text-orange-400 hover:bg-orange-400/10 transition"
          >
            Edit
          </button>
          {!isEditor && (
            <button
              onClick={() =>
                toggleStatus(p.row._id ?? p.row.id, p.row.isActive)
              }
              className="px-2 py-1 bg-orange-500 rounded text-white hover:bg-orange-600 transition"
            >
              {p.row.isActive ? "Disable" : "Activate"}
            </button>
          )}
        </div>
      ),
    },
  ];

  /* ─── RENDER ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400">Users</h1>
          <p className="text-gray-400 mt-2">Manage system users</p>
        </div>

        {/* KPI */}
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className={card}>
            <p className="text-gray-400">Total Users</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {totalUsers}
            </h2>
          </div>
          <div className={card}>
            <p className="text-gray-400">Active Users</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {activeUsers}
            </h2>
          </div>
          <div className={card}>
            <p className="text-gray-400">Average Age</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {avgAge.toFixed(1)}
            </h2>
          </div>
        </div>

        {/* API ERROR */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        {/* SEARCH + FILTERS */}
        <div className="grid md:grid-cols-5 gap-3 mb-6">
          <input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg placeholder:text-gray-500 outline-none focus:border-orange-500"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="all">All Roles</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {labelize(t)}
              </option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="all">All Genders</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {labelize(g)}
              </option>
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

          {!isEditor && (
            <button
              onClick={() => openModal()}
              className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-lg font-medium"
            >
              + Add User
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl p-4">
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row._id ?? row.id}
            loading={loading}
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        </div>
      </div>

      {/* ─── ADD / EDIT MODAL ───────────────────────────────────────── */}
      <Dialog
        open={modal.open}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #111 0%, #000 100%)",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: "16px",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#f97316", fontWeight: 700, fontSize: "1.25rem" }}
        >
          {modal.id ? "Edit User" : "Add User"}
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(249,115,22,0.2)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: "8px",
            }}
          >
            {/* First / Last name */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </div>

            {/* Age / Gender / Contact */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              <TextField
                label="Age"
                name="age"
                value={form.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                size="small"
                fullWidth
                sx={fieldSx}
              />

              <TextField
                select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                error={!!errors.gender}
                helperText={errors.gender}
                size="small"
                fullWidth
                sx={fieldSx}
                SelectProps={{ MenuProps: { PaperProps: { sx: menuSx } } }}
              >
                <MenuItem value="">Select</MenuItem>
                {GENDERS.map((g) => (
                  <MenuItem key={g} value={g} sx={{ color: "#111111" }}>
                    {labelize(g)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Contact No."
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
                size="small"
                fullWidth
                inputProps={{ maxLength: 11 }}
                sx={fieldSx}
              />
            </div>

            {/* Email / Username */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                size="small"
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                size="small"
                fullWidth
                sx={fieldSx}
              />
            </div>

            {/* Role / Password */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <TextField
                select
                label="Role"
                name="type"
                value={form.type}
                onChange={handleChange}
                error={!!errors.type}
                helperText={errors.type}
                size="small"
                fullWidth
                sx={fieldSx}
                SelectProps={{ MenuProps: { PaperProps: { sx: menuSx } } }}
              >
                <MenuItem value="">Select</MenuItem>
                {TYPES.map((t) => (
                  <MenuItem key={t} value={t} sx={{ color: "#111111" }}>
                    {labelize(t)}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={modal.id ? "Password (leave blank to keep)" : "Password"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        sx={{ color: "#6b7280" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />
            </div>

            {/* Address */}
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              size="small"
              fullWidth
              multiline
              rows={2}
              sx={fieldSx}
            />

            {/* Active toggle */}
            {modal.id && !isEditor && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Status:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    form.isActive
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                  }`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 2, borderTop: "1px solid rgba(249,115,22,0.2)" }}
        >
          <Button
            onClick={closeModal}
            sx={{ color: "#9ca3af" }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              background: "linear-gradient(135deg, #f97316, #dc2626)",
              "&:hover": {
                background: "linear-gradient(135deg, #ea6c0a, #c71f1f)",
              },
              borderRadius: "8px",
              fontWeight: 600,
              minWidth: "120px",
            }}
          >
            {submitting ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : modal.id ? (
              "Save Changes"
            ) : (
              "Create User"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

/* ─── MUI field styles (light fields inside dark modal) ─────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    "& fieldset": { borderColor: "rgba(249,115,22,0.3)" },
    "&:hover fieldset": { borderColor: "rgba(249,115,22,0.6)" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
  },
  "& .MuiInputBase-input": { color: "#111111" },
  "& .MuiInputLabel-root": { color: "#6b7280" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  "& .MuiSelect-icon": { color: "#6b7280" },
  "& .MuiFormHelperText-root": { color: "#ef4444" },
};

const menuSx = {
  background: "#ffffff",
  border: "1px solid rgba(249,115,22,0.3)",
  "& .MuiMenuItem-root": { color: "#111111" },
  "& .MuiMenuItem-root:hover": { background: "rgba(249,115,22,0.1)" },
};
