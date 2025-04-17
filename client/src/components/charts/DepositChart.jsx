import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar,
  ScatterChart, Scatter, Legend, Cell
} from "recharts";
const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#84cc16', '#65a30d'];

const DepositChart = () => {
  const [data, setData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [upiGroups, setUpiGroups] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/trends`).then(res => res.json()),
      fetch(`${API_URL}/transactions`).then(res => res.json())
    ]).then(([trendsData, transactionsData]) => {
      setData(trendsData.deposit);
      
      // Group transactions by UPI name
      const upiTransactions = {};
      transactionsData
        .filter(t => t.Deposited > 0)
        .forEach(t => {
          const upiName = t.UPI_Name || 'Other';
          if (!upiTransactions[upiName]) {
            upiTransactions[upiName] = [];
          }
          upiTransactions[upiName].push({
            date: t.Date_Formated,
            value: t.Deposited,
            name: upiName
          });
        });
      
      setUpiGroups(Object.keys(upiTransactions));
      setScatterData(upiTransactions);
    }).catch(console.error);
  }, []);

  if (!data || !scatterData) return null;

  return (
    <div className="bg-white p-1 rounded-lg h-[130vh]">
      <div className="grid grid-cols-1 gap-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Deposit"]} />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Deposit"]} />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
      formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
      labelFormatter={(label) => `Date: ${label}`}
    />
    
    {/* Scrollable Legend */}
    <Legend content={<CustomLegend />} />
            {upiGroups.map((upiName, index) => (
              <Scatter
                key={upiName}
                name={upiName}
                data={scatterData[upiName]}
                fill={COLORS[index % COLORS.length]}
                dataKey="value"
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div className="max-h-40 overflow-y-auto px-2 mt-6 border rounded-lg bg-white shadow-md mb-[-200rem] ml-10">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 my-1 ml-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default DepositChart; 