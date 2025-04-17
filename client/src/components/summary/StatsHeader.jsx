import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const StatsHeader = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  if (!summary) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem 
          label="Total Transactions" 
          value={summary.metrics.totalTransactions} 
        />
        <StatItem 
          label="Total Withdrawal" 
          value={`₹${summary.metrics.totalWithdrawal}`}
          color="text-red-600" 
        />
        <StatItem 
          label="Total Deposit" 
          value={`₹${summary.metrics.totalDeposit.toLocaleString()}`}
          color="text-green-600" 
        />
        <StatItem 
          label="Period" 
          value={`${summary.period.start} to ${summary.period.end}`} 
        />
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color = "text-gray-900" }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-lg font-semibold ${color}`}>{value}</p>
  </div>
);

export default StatsHeader; 