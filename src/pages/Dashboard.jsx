import { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardApi";
import { getSystemStatus } from "../api/systemApi";
import axios from "axios";

import {
  FaBuilding,
  FaLayerGroup,
  FaDoorOpen,
  FaLaptop,
} from "react-icons/fa";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Dashboard() {
  const [stats, setStats] = useState({
    buildings: 0,
    floors: 0,
    rooms: 0,
    devices: 0,
    totalEnergyKwh: 0,
    dailyCost: 0,
    monthlyCost: 0,
  });

  const [buildingEnergyData, setBuildingEnergyData] = useState([]);

  const [systemStatus, setSystemStatus] = useState({
    system: "CHECKING",
    database: "CHECKING",
  });

  useEffect(() => {
    loadDashboard();
    loadSystemStatus();
  }, []);

  const loadDashboard = async () => {
  try {
    // Counts
    const dashboardResponse = await getDashboardData();

    // Energy totals
    const reportResponse = await axios.get(
      "/api/reports"
    );

    // Real building ranking
    const buildingResponse = await axios.get(
      "/api/reports/building-energy"
    );

    setStats({
      ...dashboardResponse.data,
      totalEnergyKwh: reportResponse.data.totalEnergyKwh || 0,
      dailyCost: reportResponse.data.dailyCost || 0,
      monthlyCost: reportResponse.data.monthlyCost || 0,
    });

    setBuildingEnergyData(buildingResponse.data);

  } catch (error) {
    console.error(error);
  }
};


  const loadSystemStatus = async () => {
    try {
      const response = await getSystemStatus();
      setSystemStatus(response.data);
    } catch (error) {
      console.error(error);

      setSystemStatus({
        system: "ERROR",
        database: "DISCONNECTED",
      });
    }
  };

  const chartData = {
    labels: ["Buildings", "Floors", "Rooms", "Devices"],
    datasets: [
      {
        label: "Campus Statistics",
        data: [
          stats.buildings,
          stats.floors,
          stats.rooms,
          stats.devices,
        ],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  

  // High consumption warning
// High consumption warning
const ENERGY_LIMIT = 50; // kWh per day
const isHighConsumption = stats.totalEnergyKwh > ENERGY_LIMIT;
const isCriticalConsumption = stats.totalEnergyKwh > 100;

const isBuildingCritical = isCriticalConsumption;

// Weekly energy trend
const energyTrendData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Energy Usage (kWh)",
      data: [
        stats.totalEnergyKwh * 0.7,
        stats.totalEnergyKwh * 0.8,
        stats.totalEnergyKwh * 0.9,
        stats.totalEnergyKwh,
        stats.totalEnergyKwh * 1.1,
        stats.totalEnergyKwh * 0.85,
        stats.totalEnergyKwh * 0.75,
      ],
      borderColor: "#0d6efd",
      backgroundColor: "rgba(13,110,253,0.2)",
      tension: 0.4,
      fill: true,
    },
  ],
};


// Sort highest first
const rankedBuildings = [...buildingEnergyData].sort((a, b) => b.kwh - a.kwh);

const buildingChartData = {
  labels: rankedBuildings.map((b) => b.name),
  datasets: [
    {
      label: "Energy (kWh)",
      data: rankedBuildings.map((b) => b.kwh),
      backgroundColor: ["#dc3545", "#fd7e14", "#0d6efd", "#198754"],
    },
  ],
};

const topBuilding = rankedBuildings[0] || {
  name: "No building data",
  kwh: 0,
};

const topPercentage =
  stats.totalEnergyKwh > 0
    ? ((topBuilding.kwh / stats.totalEnergyKwh) * 100).toFixed(0)
    : 0;

  const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
};

  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Welcome Banner */}
      <div className="alert alert-info d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">👋 Welcome, Admin!</h5>
          <small>
            Manage your Smart Campus Energy Management System efficiently.
          </small>
        </div>

        <div className="text-end">
          <small className="text-muted">
            Last Updated:
            <br />
            {new Date().toLocaleString()}
          </small>
        </div>
      </div>

      {isHighConsumption && (
  <div className="alert alert-danger d-flex align-items-center mb-4">
    <div className="me-3 fs-3">⚠️</div>
    <div>
      <h5 className="mb-1">High Energy Consumption Detected</h5>
      <p className="mb-0">
        Current daily usage is
        <strong> {stats.totalEnergyKwh.toFixed(2)} kWh</strong>,
        which exceeds the recommended limit of
        <strong> {ENERGY_LIMIT} kWh/day</strong>.
      </p>
    </div>
  </div>
)}

      {/* Main Statistics Cards */}
      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card shadow p-3 border-0 bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Buildings</h6>
                <h2>{stats.buildings}</h2>
              </div>
              <FaBuilding size={40} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow p-3 border-0 bg-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Floors</h6>
                <h2>{stats.floors}</h2>
              </div>
              <FaLayerGroup size={40} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow p-3 border-0 bg-warning text-dark">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Rooms</h6>
                <h2>{stats.rooms}</h2>
              </div>
              <FaDoorOpen size={40} />
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow p-3 border-0 bg-danger text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Total Devices</h6>
                <h2>{stats.devices}</h2>
              </div>
              <FaLaptop size={40} />
            </div>
          </div>
        </div>

      </div>

      {/* Energy Cards */}
      <div className="row mt-2">

        <div className="col-md-4 mb-3">
          <div className="card shadow p-3 border-0 bg-warning text-dark">
            <h6>⚡ Total Daily Energy</h6>
            <h2>{stats.totalEnergyKwh.toFixed(2)} kWh</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow p-3 border-0 bg-success text-white">
            <h6>💰 Daily Cost</h6>
            <h2>GH₵{stats.dailyCost.toFixed(2)}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow p-3 border-0 bg-info text-white">
            <h6>📅 Monthly Cost</h6>
            <h2>GH₵{stats.monthlyCost.toFixed(2)}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
  <div
    className={`card shadow p-3 border-0 ${
      isHighConsumption ? "bg-danger text-white" : "bg-success text-white"
    }`}
  >
    <h6>🚨 Consumption Status</h6>
    <h2>{isHighConsumption ? "HIGH" : "NORMAL"}</h2>
  </div>
</div>

      </div>

      {/* Overview + System Status */}
      <div className="row mt-4">

        <div className="col-md-6 mb-3">
          <div className="card shadow-sm p-3 h-100">
            <h5>⚡ Campus Overview</h5>

            <p>
              There are currently <strong>{stats.buildings}</strong> buildings,
              <strong> {stats.floors}</strong> floors,
              <strong> {stats.rooms}</strong> rooms and
              <strong> {stats.devices}</strong> registered devices.
            </p>

            <hr />

            <p className="mb-1">
              Estimated daily energy usage:
              <strong> {stats.totalEnergyKwh.toFixed(2)} kWh</strong>
            </p>

            <p className="mb-0">
              Estimated monthly cost:
              <strong> GH₵{stats.monthlyCost.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card shadow-sm p-3 h-100">
            <h5>📈 System Status</h5>

            {systemStatus.system === "CHECKING" ? (
              <p className="text-warning">
                ⏳ Checking system status...
              </p>
            ) : systemStatus.system === "RUNNING" ? (
              <p className="text-success">
                ✔️ System Running Normally
              </p>
            ) : (
              <p className="text-danger">
                ❌ System Error
              </p>
            )}

            {systemStatus.database === "CONNECTED" ? (
              <p className="text-success">
                🟢 Database Connected
              </p>
            ) : systemStatus.database === "DISCONNECTED" ? (
              <p className="text-danger">
                🔴 Database Disconnected
              </p>
            ) : (
              <p className="text-warning">
                🟡 Checking Database...
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Chart */}
      <div className="card shadow-sm p-3 mt-3 mb-4">
        <h4 className="mb-3">📊 Campus Statistics Overview</h4>

        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="card shadow-sm p-3 mt-4">
  <h4 className="mb-3">📈 Weekly Energy Trend</h4>
  <div style={{ height: "300px" }}>
    <Line data={energyTrendData} options={lineOptions} />
  </div>
</div>

{/* Smart Insights */}
<div className="card shadow-sm p-4 mt-4 mb-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h4 className="mb-0">🏆 Smart Energy Insights</h4>
    <span
      className={`badge ${
        isBuildingCritical ? "bg-danger" : "bg-success"
      }`}
    >
      {isBuildingCritical ? "Critical" : "Normal"}
    </span>
  </div>

  <div className="row g-4">
    <div className="col-lg-6">
      <div
        className={`p-4 rounded-4 border ${
          isBuildingCritical
            ? "border-danger bg-danger-subtle"
            : "border-success bg-success-subtle"
        }`}
      >
        <h6 className="text-uppercase text-muted mb-2">
          Top Consuming Building
        </h6>

        <h3 className="mb-2">{topBuilding.name}</h3>

        <div className="d-flex align-items-end gap-2 mb-2">
          <h2
            className={`mb-0 ${
              isBuildingCritical ? "text-danger" : "text-success"
            }`}
          >
            {topBuilding.kwh.toFixed(2)} kWh
          </h2>

          <span className="text-muted mb-1">
            {topPercentage}% of campus energy
          </span>
        </div>

        <hr />

        {isBuildingCritical ? (
  <div className="text-danger">
    <strong>⚠️ Critical energy consumption detected</strong>
    <ul className="mb-0 mt-2">
      <li>Review overall campus energy usage</li>
      <li>Reduce unnecessary energy consumption during low-occupancy periods</li>
      <li>Monitor high-consumption areas and improve energy efficiency</li>
    </ul>
  </div>
) : (
  <div className="text-success">
    <strong>✔️ Energy consumption is within the normal range</strong>
    <ul className="mb-0 mt-2">
      <li>Continue current energy-saving practices</li>
      <li>Monitor campus energy consumption regularly</li>
      <li>Review energy efficiency trends over time</li>
    </ul>
  </div>
)}

      </div>
    </div>

    <div className="col-lg-6">
      <div className="card border-0 bg-light h-100">
        <div className="card-body">
          <h5 className="mb-3">📊 Building Energy Ranking</h5>

          <Bar
            data={buildingChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  );
}

export default Dashboard;