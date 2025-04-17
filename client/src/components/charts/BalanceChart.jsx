import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const API_URL = import.meta.env.VITE_API_URL;

const BalanceChart = ({ dateRange }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = new URL(`${API_URL}/trends`);
    if (dateRange?.startDate) {
      url.searchParams.append("start_date", dateRange.startDate);
    }
    if (dateRange?.endDate) {
      url.searchParams.append("end_date", dateRange.endDate);
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data.balance))
      .catch(console.error);
  }, [dateRange]);

  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Balance Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, "Balance"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart; 