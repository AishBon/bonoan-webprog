import React, { useState, useEffect, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../services/articleService";

/* ─── Blank form matches Article schema exactly ──────────────────── */
const BLANK_FORM = {
  name: "",
  title: "",
  content: "",
  imageUrl: "",
};

/* ─── MUI field styles — white box, gray label, black typed text ─── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#d1d5db" },
    "&:hover fieldset": { borderColor: "#f97316" },
    "&.Mui-focused fieldset": { borderColor: "#f97316" },
    backgroundColor: "#ffffff",
  },
  "& .MuiInputLabel-root": { color: "#6b7280" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
  "& .MuiInputBase-input": { color: "#111111" },
  "& .MuiInputBase-input::placeholder": { color: "#9ca3af" },
  "& .MuiFormHelperText-root": { color: "#6b7280" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ef4444" },
};

const card =
  "rounded-3xl border border-orange-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg";

/* ─── Component ──────────────────────────────────────────────────── */
const DashArticleListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* AUTH */
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch {
      return null;
    }
  })();

  const isAdmin = currentUser?.type === "admin";
  const isEditor = currentUser?.type === "editor";
  const canEdit = isAdmin || isEditor;

  /* STATE */
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [modal, setModal] = useState({ open: false, id: null });
  const [form, setForm] = useState(BLANK_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* FETCH */
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const { data } = await fetchArticles();
      const raw = Array.isArray(data) ? data : (data.articles ?? []);
      setArticles(
        raw.map((a) => ({
          ...a,
          id: a._id ?? a.id,
          content: Array.isArray(a.content)
            ? a.content.join("\n")
            : (a.content ?? ""),
        })),
      );
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load articles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  /* HELPERS */
  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const openModal = (article) => {
    setModal({ open: true, id: article?._id ?? article?.id ?? null });
    setForm(
      article
        ? {
            name: article.name ?? "",
            title: article.title ?? "",
            content: Array.isArray(article.content)
              ? article.content.join("\n")
              : (article.content ?? ""),
            imageUrl: article.imageUrl ?? "",
          }
        : { ...BLANK_FORM },
    );
    setErrors({});
    setSubmitted(false);
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setForm({ ...BLANK_FORM });
    setErrors({});
    setSubmitted(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted && errors[name])
      setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* VALIDATION */
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name (slug) is required.";
    else if (/\s/.test(form.name.trim()))
      errs.name = "No spaces — use hyphens (e.g. my-article).";
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.content.trim()) errs.content = "Content is required.";
    if (!form.imageUrl.trim()) errs.imageUrl = "Image URL is required.";
    return errs;
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      name: form.name.trim().toLowerCase(),
      title: form.title.trim(),
      content: form.content.trim().split("\n").filter(Boolean),
      imageUrl: form.imageUrl.trim(),
    };

    setSubmitting(true);
    try {
      if (modal.id) {
        const { data } = await updateArticle(modal.id, payload);
        setArticles((prev) =>
          prev.map((a) =>
            a.id === modal.id
              ? {
                  ...a,
                  ...data,
                  id: modal.id,
                  content: Array.isArray(data.content)
                    ? data.content.join("\n")
                    : data.content,
                }
              : a,
          ),
        );
        showToast("Article updated successfully.");
      } else {
        const { data } = await createArticle(payload);
        setArticles((prev) => [
          ...prev,
          {
            ...data,
            id: data._id ?? data.id,
            content: Array.isArray(data.content)
              ? data.content.join("\n")
              : data.content,
          },
        ]);
        showToast("Article created successfully.");
      }
      closeModal();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to save article.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* TOGGLE ACTIVE */
  const toggleActive = async (article) => {
    if (!isAdmin) return;
    const updated = { isActive: !article.isActive };
    try {
      await updateArticle(article.id, updated);
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, ...updated } : a)),
      );
      showToast(`Article ${updated.isActive ? "restored" : "archived"}.`);
    } catch {
      showToast("Failed to update article.", "error");
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this article permanently?")) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast("Article deleted.");
    } catch {
      showToast("Failed to delete article.", "error");
    }
  };

  /* FILTER */
  const filteredArticles = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchesSearch =
      a.title?.toLowerCase().includes(q) || a.name?.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "active"
        ? a.isActive
        : filterStatus === "inactive"
          ? !a.isActive
          : true;
    return matchesSearch && matchesStatus;
  });

  /* KPI */
  const totalArticles = articles.length;
  const activeArticles = articles.filter((a) => a.isActive).length;

  /* COLUMNS */
  const columns = [
    { field: "name", headerName: "Slug", minWidth: 200, flex: 1 },
    { field: "title", headerName: "Title", minWidth: 220, flex: 1.5 },
    {
      field: "isActive",
      headerName: "Status",
      minWidth: 110,
      renderCell: ({ row }) => (
        <Chip
          size="small"
          label={row.isActive ? "Active" : "Archived"}
          color={row.isActive ? "success" : "default"}
          variant={row.isActive ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: isAdmin ? 240 : 90,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1} sx={{ py: 0.5 }}>
          {canEdit && (
            <button
              onClick={() => openModal(row)}
              className="px-2 py-1 border border-orange-400 rounded text-orange-400 text-sm hover:bg-orange-400/10 transition"
            >
              Edit
            </button>
          )}
          {isAdmin && (
            <>
              <button
                onClick={() => toggleActive(row)}
                className={`px-2 py-1 rounded text-sm text-white transition ${
                  row.isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {row.isActive ? "Archive" : "Restore"}
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white transition"
              >
                Delete
              </button>
            </>
          )}
        </Stack>
      ),
    },
  ];

  /* ─── RENDER ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400">Articles</h1>
          <p className="text-gray-400 mt-2">Manage your published content</p>
        </div>

        {/* KPI */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className={card}>
            <p className="text-gray-400">Total Articles</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {totalArticles}
            </h2>
          </div>
          <div className={card}>
            <p className="text-gray-400">Active Articles</p>
            <h2 className="text-4xl font-bold text-orange-400 mt-2">
              {activeArticles}
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
        <div className="grid md:grid-cols-4 gap-3 mb-6">
          <input
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:col-span-2 bg-black border border-orange-500/40 text-white p-2 rounded-lg placeholder:text-gray-500 outline-none focus:border-orange-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-orange-500/40 text-white p-2 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Archived</option>
          </select>
          {canEdit && (
            <button
              onClick={() => openModal()}
              className="bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-lg font-medium"
            >
              + New Article
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <CircularProgress sx={{ color: "#f97316" }} />
            </div>
          ) : filteredArticles.length ? (
            <DataGrid
              rows={filteredArticles}
              columns={columns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              sx={{
                "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader": {
                  outline: "none",
                },
              }}
            />
          ) : (
            <Alert severity="info">
              No articles found. Adjust your search or create your first
              article.
            </Alert>
          )}
        </div>
      </div>

      {/* ─── ADD / EDIT MODAL ──────────────────────────────────────── */}
      <Dialog
        open={modal.open}
        onClose={closeModal}
        fullWidth
        fullScreen={isMobile}
        maxWidth="md"
        PaperProps={{
          sx: {
            background: "#ffffff",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: "16px",
          },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle
            sx={{ color: "#f97316", fontWeight: 700, fontSize: "1.25rem" }}
          >
            {modal.id ? "Edit Article" : "New Article"}
          </DialogTitle>

          <DialogContent
            dividers
            sx={{ borderColor: "rgba(249,115,22,0.2)", px: { xs: 2, sm: 3 } }}
          >
            <Stack spacing={2} sx={{ pt: 1 }}>
              {/* Slug */}
              <TextField
                name="name"
                label="Slug (unique name)"
                value={form.name}
                onChange={handleChange}
                error={submitted && Boolean(errors.name)}
                helperText={
                  submitted && errors.name
                    ? errors.name
                    : "Lowercase, hyphens only. Used in the page URL."
                }
                placeholder="e.g. my-article-title"
                fullWidth
                sx={fieldSx}
              />

              {/* Title */}
              <TextField
                name="title"
                label="Title"
                value={form.title}
                onChange={handleChange}
                error={submitted && Boolean(errors.title)}
                helperText={submitted ? errors.title : ""}
                fullWidth
                sx={fieldSx}
              />

              {/* Image URL */}
              <TextField
                name="imageUrl"
                label="Image URL"
                value={form.imageUrl}
                onChange={handleChange}
                error={submitted && Boolean(errors.imageUrl)}
                helperText={submitted ? errors.imageUrl : ""}
                placeholder="https://example.com/image.jpg"
                fullWidth
                sx={fieldSx}
              />

              {/* Content */}
              <TextField
                name="content"
                label="Content"
                value={form.content}
                onChange={handleChange}
                error={submitted && Boolean(errors.content)}
                helperText={
                  submitted && errors.content
                    ? errors.content
                    : "Each paragraph on its own line."
                }
                placeholder="Article body. Each paragraph on its own line."
                multiline
                rows={8}
                fullWidth
                sx={fieldSx}
              />
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{ px: 3, py: 2, borderTop: "1px solid rgba(249,115,22,0.2)" }}
          >
            <Button
              onClick={closeModal}
              disabled={submitting}
              sx={{ color: "#9ca3af" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={{
                background: "linear-gradient(135deg, #f97316, #dc2626)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ea6c0a, #c71f1f)",
                },
                borderRadius: "8px",
                fontWeight: 600,
                minWidth: "130px",
              }}
            >
              {modal.id ? "Update Article" : "Save Article"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DashArticleListPage;
