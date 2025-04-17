import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UPI Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Withdrawal
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deposit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((txn, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {txn.Date_Formated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{txn.UPI_Name}</td>
                <td className="px-6 py-4">{txn.UPI_Description}</td>
                <td className="px-6 py-4 text-right text-red-600">
                  {txn.Withdrawal > 0 ? `₹${txn.Withdrawal.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 text-right text-green-600">
                  {txn.Deposited > 0 ? `₹${txn.Deposited.toLocaleString()}` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  ₹{txn.Balance.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable; 