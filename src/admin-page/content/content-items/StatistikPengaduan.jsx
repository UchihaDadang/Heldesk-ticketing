import { HeaderStatistikPengaduan } from "../../../modal/ModalHeaders";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatistikPengaduan = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        setLoading(true);
        const apiUrl = "http://localhost:3000/api/report/stats";

        const response = await axios.get(apiUrl);
        if (response.data && response.data.data) {
          setReportData(response.data.data);
        } else {
          setError("Data tidak tersedia");
        }
      } catch (err) {
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportStats();
  }, []);

  const getColorForCategory = (category) => {
    const COLORS = {
      Crime: "#FF5252",
      Bullying: "#FFD740",
      "Domestic Violence": "#7C4DFF",
      "Missing Persons": "#40C4FF",
      "Suspicious Activity": "#69F0AE",
    };
    return COLORS[category] || "#8884d8";
  };

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <HeaderStatistikPengaduan />
      <div className="report-stats-container">
        {}

        {/* Container Scrollable */}
        <div style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "10px" }}>
          {reportData.map((report) => (
            <div key={report.category} className="chart-container">
              <h3>{report.category}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[report]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} laporan`, "Jumlah"]} />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="Jumlah Laporan"
                    fill={getColorForCategory(report.category)}
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatistikPengaduan;
