import { useEffect, useState } from "react";
import { getReport } from "../api/reportApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [report, setReport] = useState({
    buildings: 0,
    floors: 0,
    rooms: 0,
    devices: 0,
    totalPower: 0,
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await getReport();
      setReport(response.data);
    } catch (error) {
      console.error(error);
    }
  };

    const chartData = {
  labels: ["Buildings", "Floors", "Rooms", "Devices"],
  datasets: [
    {
      label: "Campus Statistics",
      data: [
        report.buildings,
        report.floors,
        report.rooms,
        report.devices,
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

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

    const pieData = {
  labels: ["Buildings", "Floors", "Rooms", "Devices"],
  datasets: [
    {
      data: [
        report.buildings,
        report.floors,
        report.rooms,
        report.devices,
      ],
      backgroundColor: [
        "#0d6efd",
        "#198754",
        "#ffc107",
        "#dc3545",
      ],
      borderWidth: 1,
    },
  ],
};

    const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Smart Campus Energy Management Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Item", "Value"]],
    body: [
      ["Total Buildings", report.buildings],
      ["Total Floors", report.floors],
      ["Total Rooms", report.rooms],
      ["Total Devices", report.devices],
      ["Total Power Consumption", `${report.totalPower} W`],
    ],
  });

  doc.save("SmartCampusReport.pdf");
};

  return (
    <div className="container mt-4">
      <h2>System Report</h2>

<p className="page-description">
  View campus statistics and generate reports.
</p>



      <table className="table table-striped table-hover table-bordered">
        <tbody>
          <tr>
            <th>Total Buildings</th>
            <td>{report.buildings}</td>
          </tr>

          <tr>
            <th>Total Floors</th>
            <td>{report.floors}</td>
          </tr>

          <tr>
            <th>Total Rooms</th>
            <td>{report.rooms}</td>
          </tr>

          <tr>
            <th>Total Devices</th>
            <td>{report.devices}</td>
          </tr>

          <tr>
            <th>Total Power Consumption</th>
            <td>{report.totalPower} W</td>
          </tr>
        </tbody>
      </table>

      <div className="card p-3 mb-3">
  <h4 className="mb-3">Campus Statistics</h4>

  <Bar
    data={chartData}
    options={options}
  />
</div>

<div className="card p-3 mb-3">
  <h4 className="mb-3">Campus Distribution</h4>

  <div style={{ maxWidth: "500px", margin: "0 auto" }}>
    <Pie data={pieData} />
  </div>
</div>

      <div className="d-flex gap-2">
  <button
    className="btn btn-primary"
    onClick={() => window.print()}
  >
    🖨 Print Report
  </button>

  <button
    className="btn btn-success"
    onClick={downloadPDF}
  >
    📄 Download PDF
  </button>
</div>
    </div>
  );
}

export default Reports;