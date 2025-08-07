import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Label
} from 'recharts';

const SLOT_COLORS = [ '#4ade80', '#f87171' ];

const Analysis: React.FC = () => {
  // Example data for pie chart
  const totalSlots = 8;
  const availableSlots = 5;
  const usedSlots = totalSlots - availableSlots;

  const slotData = [
    { name: 'Available', value: availableSlots },
    { name: 'Used', value: usedSlots },
  ];

  // Example data for bar chart
  const carData = [
    { date: '1/7', cars: 12 },
    { date: '2/7', cars: 18 },
    { date: '3/7', cars: 9 },
    { date: '4/7', cars: 22 },
    { date: '5/7', cars: 15 },
    { date: '6/7', cars: 10 },
  ];

  return (
    <div className="p-3 px-0 text-white rounded-2xl shadow-2xl space-y-2 max-w-[80vw]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Pie Chart */}
        <div className="bg-white/5 p-6 pr-1 rounded-xl backdrop-blur-md shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Slot Availability</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={slotData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                dataKey="value"
                animationDuration={800}
              >
                {slotData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SLOT_COLORS[index]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-1 text-center text-md">
            {availableSlots} of {totalSlots} slots available
          </p>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Cars per Day</h3>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={carData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
              <XAxis dataKey="date" stroke="#fff">
                <Label value="Date" offset={-5} position="insideBottom" fill="#ff4" />
              </XAxis>
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="cars" fill="#60a5fa" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
