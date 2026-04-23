import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

/* SAME DATA */
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

const maxAge = Math.max(...validAges.map((r) => r.age));
const minAge = Math.min(...validAges.map((r) => r.age));

const ageGroups = {
  youth: rows.filter((r) => r.age && r.age < 18).length,
  adult: rows.filter((r) => r.age && r.age >= 18 && r.age < 60).length,
  senior: rows.filter((r) => r.age && r.age >= 60).length,
};

/* STYLE */
const card =
  "rounded-3xl border border-orange-500/20 bg-gradient-to-br from-gray-900 to-black p-6 shadow-lg";

const chartBox = "bg-white p-5 rounded-3xl shadow-lg";

export default function ReportsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-orange-400">Reports</h1>
      <p className="text-gray-400 mt-2 mb-10">
        Analytical breakdown based on dashboard user dataset.
      </p>

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
            {minAge} - {maxAge}
          </h2>
        </div>

      </div>

      {/* GAUGES */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-500/20 bg-black p-6">
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

        <div className="flex flex-col items-center justify-center rounded-3xl border border-orange-500/20 bg-black p-6">
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

      {/* ANALYTICS CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* PIE: AGE DISTRIBUTION */}
        <div className={chartBox}>
          <h2 className="text-orange-500 mb-4">Age Distribution</h2>

          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: ageGroups.youth, label: "Youth", color: "#fb923c" },
                  { id: 1, value: ageGroups.adult, label: "Adult", color: "#f97316" },
                  { id: 2, value: ageGroups.senior, label: "Senior", color: "#ea580c" },
                ],
              },
            ]}
            width={260}
            height={260}
          />
        </div>

        {/* BAR: AGE SPREAD ANALYSIS */}
        <div className={chartBox}>
          <h2 className="text-orange-500 mb-4">Age Spread Trend</h2>

          <BarChart
            series={[
              {
                data: rows.map((r) => r.age ?? 0),
                label: "User Age",
                color: "#fb923c",
              },
            ]}
            height={250}
            xAxis={[
              {
                data: rows.map((r) => r.id),
                scaleType: "band",
              },
            ]}
          />
        </div>

      </div>

      {/* INSIGHT PANEL */}
      <div className={card}>
        <h2 className="text-orange-400 mb-3">System Insights</h2>

        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Majority users are in adult age group</li>
          <li>• Age distribution is moderately balanced</li>
          <li>• No extreme skew in dataset</li>
          <li>• Dataset size: {totalUsers} users</li>
        </ul>
      </div>

    </div>
  );
}