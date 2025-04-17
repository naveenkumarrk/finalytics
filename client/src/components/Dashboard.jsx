import { useState } from "react";
import FileUpload from "./FileUpload";
import StatementSummary from "./summary/StatementSummary";
import StatsHeader from "./summary/StatsHeader";
import BalanceChart from "./charts/BalanceChart";
import WithdrawalChart from "./charts/WithdrawalChart";
import DepositChart from "./charts/DepositChart";
import UPIAnalysis from "./charts/UPIAnalysis";
import TransactionTable from "./transactions/TransactionTable";
import Navbar from "./NavBar";

const Dashboard = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen px-2 pt-6 sm:px-10 md:px-10 lg:px-10">
      <div className="max-w-8xl mx-auto mt-25">
        {/* Upload Area or Dashboard Content */}
        {!dataLoaded ? (
          <div className="bg-white shadow-md p-6 mb-6 transition-all duration-300 transform hover:shadow-lg rounded-4xl">
            <FileUpload onAnalysisComplete={() => setDataLoaded(true)} />
          </div>
        ) : (
          <>
            {/* Stats Overview Cards */}
            <div className="mb-6 transition-all duration-300">
              <StatsHeader dateRange={dateRange} />
            </div>

            {/* Summary Section */}
            <div className="bg-white shadow-md rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Statement Summary
              </h2>
              <StatementSummary dateRange={dateRange} />
            </div>

            {/* Charts - Each one in a separate row */}
            <div className="space-y-6 mb-6">
              {/* Balance Trend */}
              <div className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                <BalanceChart dateRange={dateRange} />
              </div>

              {/* UPI Spending Analysis */}
              <div className="bg-white shadow-md rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  UPI Spending Analysis
                </h2>
                <UPIAnalysis dateRange={dateRange} />
              </div>

              {/* Withdrawals */}
              <div className="bg-white shadow-md rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Withdrawals
                </h2>
                <WithdrawalChart dateRange={dateRange} />
              </div>

              {/* Deposits */}
              <div className="bg-white shadow-md rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Deposits
                </h2>
                <DepositChart dateRange={dateRange} />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white shadow-md rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Transaction History
              </h2>
              <TransactionTable dateRange={dateRange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
