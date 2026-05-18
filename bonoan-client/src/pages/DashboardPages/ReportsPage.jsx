import React, { useState, useEffect, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, CircularProgress } from "@mui/material";

import { fetchUsers } from "../../services/UserService";

/* TABLE COLUMNS */
const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "firstName", headerName: "First Name", width: 130 },
  { field: "lastName", headerName: "Last Name", width: 130 },
  { field: "age", headerName: "Age", width: 90 },
];

/* STYLE */
const card =
  "rounded-3xl border border-orange-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg break-inside-avoid";

const chartBox = "bg-white p-5 rounded-3xl shadow-lg";

export default function ReportsPage() {
  const printRef = useRef(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const { data } = await fetchUsers();
        setRows(
          data.users.map((u, i) => ({
            id: u._id ?? u.id ?? i + 1,
            firstName: u.firstName,
            lastName: u.lastName,
            age: u.age ? Number(u.age) : null,
          })),
        );
      } catch (err) {
        setApiError(err?.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* METRICS */
  const totalUsers = rows.length;
  const validAges = rows.filter((r) => r.age !== null);
  const averageAge =
    validAges.reduce((sum, r) => sum + r.age, 0) / (validAges.length || 1);
  const maxAge = validAges.length
    ? Math.max(...validAges.map((r) => r.age))
    : 0;
  const minAge = validAges.length
    ? Math.min(...validAges.map((r) => r.age))
    : 0;
  const ageRange = maxAge - minAge;

  const ageGroups = {
    youth: rows.filter((r) => r.age && r.age < 18).length,
    adult: rows.filter((r) => r.age && r.age >= 18 && r.age < 60).length,
    senior: rows.filter((r) => r.age && r.age >= 60).length,
  };

  /* DYNAMIC INSIGHTS */
  const dominantGroup = Object.entries(ageGroups).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const dominantLabel =
    dominantGroup[0] === "youth"
      ? "Youth (under 18)"
      : dominantGroup[0] === "adult"
        ? "Adults (18–59)"
        : "Seniors (60+)";
  const dominantPct =
    totalUsers > 0 ? ((dominantGroup[1] / totalUsers) * 100).toFixed(1) : 0;

  const skewLabel =
    ageRange <= 10
      ? "tightly concentrated"
      : ageRange <= 30
        ? "moderately spread"
        : "widely spread";

  const avgAgeLabel =
    averageAge < 25
      ? "a young user base"
      : averageAge < 45
        ? "a mid-aged user base"
        : "a mature user base";

  /* PRINT */
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=1200,height=900");
    if (!printWindow) return;

    const headMarkup = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']"),
    )
      .map((node) => node.outerHTML)
      .join("");

    const exportedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date());

    printWindow.document.write(`
      <html>
        <head>
          ${headMarkup}
          <style>
            body { font-family: Arial; padding: 20px; background: #000; color: #fff; }
            h1 { color: #fb923c; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <h1>Reports Summary</h1>
          <p>Generated on ${exportedAt}</p>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div
      ref={printRef}
      className="w-full max-w-7xl mx-auto px-6 py-10 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white"
    >
      {/* HEADER + ACTIONS */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-4xl font-bold text-orange-400">Reports</h1>
          <p className="text-gray-400 mt-2">
            Analytical breakdown based on live database records.
          </p>
        </div>

        <div className="flex gap-2 no-print">
          <button
            onClick={handlePrint}
            className="bg-orange-500 px-4 py-2 rounded-lg"
          >
            Export
          </button>
        </div>
      </div>

      {/* API ERROR */}
      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress sx={{ color: "#f97316" }} />
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className={card}>
              <p className="text-gray-400">Total Users</p>
              <h2 className="text-4xl font-bold text-orange-400 mt-2">
                {totalUsers}
              </h2>
            </div>

            <div className={card}>
              <p className="text-gray-400">Average Age</p>
              <h2 className="text-4xl font-bold text-orange-400 mt-2">
                {averageAge.toFixed(1)}
              </h2>
            </div>

            <div className={card}>
              <p className="text-gray-400">Age Range</p>
              <h2 className="text-2xl font-bold text-orange-400 mt-2">
                {minAge} – {maxAge}
              </h2>
            </div>
          </div>

          {/* GAUGES */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className={card + " flex flex-col items-center"}>
              <p className="text-orange-400 mb-2">User Volume Index</p>
              <Gauge
                width={180}
                height={180}
                value={totalUsers}
                sx={{
                  "& text": { fill: "#fb923c" },
                  "& .MuiGauge-valueArc": { fill: "#fb923c" },
                }}
              />
            </div>

            <div className={card + " flex flex-col items-center"}>
              <p className="text-orange-400 mb-2">Age Stability Score</p>
              <Gauge
                width={220}
                height={220}
                value={Math.round(averageAge)}
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
            <div className={chartBox}>
              <h2 className="text-orange-500 font-semibold mb-1">
                Age Distribution
              </h2>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: ageGroups.youth,
                        label: "Youth",
                        color: "#fb923c",
                      },
                      {
                        id: 1,
                        value: ageGroups.adult,
                        label: "Adult",
                        color: "#f97316",
                      },
                      {
                        id: 2,
                        value: ageGroups.senior,
                        label: "Senior",
                        color: "#ea580c",
                      },
                    ],
                  },
                ]}
                width={260}
                height={260}
              />
            </div>

            <div className={chartBox}>
              <h2 className="text-orange-500 font-semibold mb-1">
                Age Spread Trend
              </h2>
              <BarChart
                series={[
                  {
                    data: rows.map((r) => r.age ?? 0),
                    color: "#fb923c",
                  },
                ]}
                height={250}
                xAxis={[
                  {
                    data: rows.map((_, i) => i + 1),
                    scaleType: "band",
                  },
                ]}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl p-4 mb-10">
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5]}
              autoHeight
            />
          </div>

          {/* DYNAMIC INSIGHTS */}
          <div className={card}>
            <h2 className="text-orange-400 mb-3">System Insights</h2>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                • The dominant user group is{" "}
                <span className="text-orange-300 font-medium">
                  {dominantLabel}
                </span>
                , making up{" "}
                <span className="text-orange-300 font-medium">
                  {dominantPct}%
                </span>{" "}
                of the total user base.
              </li>
              <li>
                • Youth users:{" "}
                <span className="text-orange-300 font-medium">
                  {ageGroups.youth}
                </span>{" "}
                &nbsp;|&nbsp; Adults:{" "}
                <span className="text-orange-300 font-medium">
                  {ageGroups.adult}
                </span>{" "}
                &nbsp;|&nbsp; Seniors:{" "}
                <span className="text-orange-300 font-medium">
                  {ageGroups.senior}
                </span>
              </li>
              <li>
                • Age spread is{" "}
                <span className="text-orange-300 font-medium">{skewLabel}</span>{" "}
                (range: {minAge}–{maxAge}, span of {ageRange} years).
              </li>
              <li>
                • An average age of{" "}
                <span className="text-orange-300 font-medium">
                  {averageAge.toFixed(1)}
                </span>{" "}
                suggests{" "}
                <span className="text-orange-300 font-medium">
                  {avgAgeLabel}
                </span>
                .
              </li>
              <li>
                • Dataset size:{" "}
                <span className="text-orange-300 font-medium">
                  {totalUsers}
                </span>{" "}
                registered user{totalUsers !== 1 ? "s" : ""}.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
