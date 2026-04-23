import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import { Gauge } from "@mui/x-charts/Gauge";
import { Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* DATA */
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  { field: "age", headerName: "Age", type: "number", width: 110 },
  {
    field: "fullName",
    headerName: "Full name",
    width: 160,
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

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-orange-400">Dashboard</h1>
      <p className="text-gray-400 mt-2 mb-10">
        Solaris system overview and analytics
      </p>

      {/* STATS */}
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

      {/* GAUGES */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-500/30 bg-black p-6">
          <p className="text-orange-400 mb-2">Total Users</p>
          <Gauge
            width={160}
            height={160}
            value={totalUsers}
            sx={{
              "& text": { fill: "#fb923c" },
              "& .MuiGauge-valueArc": { fill: "#fb923c" },
            }}
          />
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-500/30 bg-black p-6">
          <p className="text-orange-400 mb-2">Average Age</p>
          <Gauge
            width={220}
            height={220}
            value={averageAge}
            valueMax={100}
            sx={{
              "& text": { fill: "#f97316" },
              "& .MuiGauge-valueArc": { fill: "#f97316" },
            }}
          />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white p-5 rounded-3xl shadow-lg">
          <BarChart
            series={[
              { data: [35, 44, 24, 34], label: "Series 1", color: "#fb923c" },
              { data: [51, 6, 49, 30], label: "Series 2", color: "#f97316" },
            ]}
            height={240}
            xAxis={[
              {
                data: ["Q1", "Q2", "Q3", "Q4"],
                scaleType: "band",
              },
            ]}
          />
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-lg flex justify-center">
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "A", color: "#fb923c" },
                  { id: 1, value: 15, label: "B", color: "#f97316" },
                  { id: 2, value: 20, label: "C", color: "#ea580c" },
                ],
              },
            ]}
            width={260}
            height={260}
          />
        </div>
      </div>

      {/* DATA GRID */}
      <Typography variant="h5" sx={{ color: "#fb923c", mb: 2 }}>
        Users Overview
      </Typography>

      <Box
        sx={{
          height: 420,
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #fb923c33",
          overflow: "hidden",
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
            color: "#000000",
            border: "none",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#111827",
              color: "#fb923c",
            },

            "& .MuiDataGrid-cell": {
              color: "#000000",
              borderColor: "rgba(0,0,0,0.08)",
            },

            "& .MuiTablePagination-root": {
              color: "#000000",
            },
          }}
        />
      </Box>

      {/* MAP */}
      <Typography variant="h5" sx={{ color: "#fb923c", mt: 5, mb: 2 }}>
        Location Map
      </Typography>

      <div className="h-[500px] rounded-3xl overflow-hidden border border-orange-500/20">
        <MapContainer
          center={[14.604253, 120.994314]}
          zoom={16}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[14.604253, 120.994314]}>
            <Popup>
              <b>National University - Manila</b>
              <br />
              551 F Jhocson St, Sampaloc
              <br />
              Metro Manila, Philippines
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}