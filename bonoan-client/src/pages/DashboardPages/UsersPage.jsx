import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";

/* SAME DATA */
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  { field: "age", headerName: "Age", type: "number", width: 110 },
  {
    field: "fullName",
    headerName: "Full name",
    width: 180,
    valueGetter: (_, row) =>
      `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim(),
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

/* METRICS */
const totalUsers = rows.length;
const validAges = rows.filter((r) => r.age !== null);
const averageAge =
  validAges.reduce((sum, r) => sum + r.age, 0) / validAges.length;

export default function UsersPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-orange-400">
          Users
        </h1>
        <p className="text-gray-400 mt-2">
          Manage and view all registered system users
        </p>
      </div>

      {/* KPI SECTION */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">

        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg">
          <p className="text-gray-400">Total Users</p>
          <h2 className="text-4xl font-bold text-orange-400 mt-2">
            {totalUsers}
          </h2>
        </div>

        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg">
          <p className="text-gray-400">Average Age</p>
          <h2 className="text-4xl font-bold text-orange-400 mt-2">
            {averageAge.toFixed(1)}
          </h2>
        </div>

      </div>

      {/* TABLE CARD */}
      <Box
        sx={{
          height: 550,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #fb923c33",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            backgroundColor: "#ffffff",
            color: "#000000",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#111827",
              color: "#fb923c",
              fontSize: "14px",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fb923c",
              fontWeight: "bold",
            },

            "& .MuiDataGrid-cell": {
              color: "#000000",
              borderColor: "rgba(0,0,0,0.08)",
            },

            "& .MuiTablePagination-root": {
              color: "#000000",
            },

            "& .MuiCheckbox-root": {
              color: "#000000",
            },

            border: "none",
          }}
        />
      </Box>
    </div>
  );
}