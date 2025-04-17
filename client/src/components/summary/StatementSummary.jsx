import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const StatementSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/summary`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  if (!summary) return null;
  return (
    <div className="bg-white p-1 rounded-lg mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricGroup
          title="Time Period"
          metrics={[
            {
              label: "Statement Period",
              value: `${summary.period.start} to ${summary.period.end}`,
            },
            {
              label: "Number of Days",
              value: summary.period.days,
            },
          ]}
        />
        <MetricGroup
          title="Transaction Overview"
          metrics={[
            {
              label: "Total Transactions",
              value: summary.metrics.totalTransactions,
            },
            {
              label: "Daily Average",
              value: parseFloat(summary.metrics.totalTransactions / summary.period.days).toFixed(1),
            },
          ]}
        />
        <MetricGroup
          title="Balance Details"
          metrics={[
            {
              label: "Opening Balance",
              value: `₹${summary.metrics.openingBalance.toLocaleString()}`,
            },
            {
              label: "Closing Balance",
              value: `₹${summary.metrics.closingBalance.toLocaleString()}`,
            },
          ]}
        />
        <MetricGroup
          title="Transaction Summary"
          metrics={[
            {
              label: "Total Withdrawal",
              value: `₹${summary.metrics.totalWithdrawal.toLocaleString()}`,
              color: "text-red-600",
            },
            {
              label: "Total Deposit",
              value: `₹${summary.metrics.totalDeposit.toLocaleString()}`,
              color: "text-green-600",
            },
          ]}
        />
        <MetricGroup
          title="Daily Averages"
          metrics={[
            {
              label: "Avg. Daily Withdrawal",
              value: `₹${summary.metrics.avgWithdrawalPerDay.toLocaleString()}`,
              color: "text-red-600",
            }
          ]}
        />
        <MetricGroup
          title="Monthly Projection"
          metrics={[
            {
              label: "Monthly Withdrawal",
              value: `₹${summary.metrics.avgWithdrawalPerMonth.toLocaleString()}`,
              color: "text-red-600",
            }
          ]}
        />
      </div>
    </div>
  );
};

const MetricGroup = ({ title, metrics }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>
    <div className="space-y-3">
      {metrics.map((metric, idx) => (
        <div key={idx}>
          <p className="text-xs text-gray-500">{metric.label}</p>
          <p className={`text-lg font-semibold ${metric.color || 'text-gray-900'}`}>
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default StatementSummary; 