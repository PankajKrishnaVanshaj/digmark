import React from "react";

const HomePage = () => {
  // Dummy data for the charts
  const salesData = [
    { month: "January", sales: 65 },
    { month: "February", sales: 59 },
    { month: "March", sales: 80 },
    { month: "April", sales: 81 },
    { month: "May", sales: 56 },
    { month: "June", sales: 55 },
    { month: "July", sales: 40 },
  ];

  const expenseData = [
    { category: "Food", amount: 500 },
    { category: "Transportation", amount: 300 },
    { category: "Entertainment", amount: 200 },
    { category: "Utilities", amount: 400 },
    { category: "Health", amount: 600 },
  ];

  // Calculate the maximum sales value for scaling
  const maxSales = Math.max(...salesData.map((item) => item.sales));

  // Calculate the total expenses for the pie chart
  const totalExpenses = expenseData.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Analysis Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales Chart
          </h2>
          <div className="flex flex-col">
            {salesData.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div className="w-20 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    {item.month}
                  </span>
                </div>
                <div className="relative flex-grow ml-2">
                  <div className="absolute bottom-0 left-0 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.sales / maxSales) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {item.sales}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Expense Distribution
          </h2>
          <div className="flex justify-center">
            <svg viewBox="0 0 24 24" className="w-32 h-32">
              {expenseData.map((item, index) => (
                <circle
                  key={index}
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                  strokeWidth="5"
                  strokeDasharray={`${(item.amount / totalExpenses) * 62} 62`}
                  transform={`rotate(-90 ${12} ${12})`}
                  style={{ transformOrigin: "50% 50%" }}
                />
              ))}
            </svg>
          </div>
          <ul className="mt-4">
            {expenseData.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <div
                  className="w-4 h-4 mr-2 rounded-full"
                  style={{
                    backgroundColor: `#${Math.floor(
                      Math.random() * 16777215
                    ).toString(16)}`,
                  }}
                ></div>
                <span className="text-sm font-medium text-gray-600">
                  {item.category}
                </span>
                <span className="ml-auto text-sm font-medium text-gray-600">
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Activity
          </h2>
          <ul>
            <li className="flex items-center mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-600">
                John Doe viewed 5 books
              </span>
            </li>
            <li className="flex items-center mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-600">
                Jane Smith downloaded 3 books
              </span>
            </li>
            {/* Add more user activity items as needed */}
          </ul>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Trends
          </h2>
          <div className="flex justify-center">
            <svg viewBox="0 0 24 24" className="w-32 h-32">
              {/* Add trend data */}
            </svg>
          </div>
          <ul className="mt-4">
            <li className="text-sm font-medium text-gray-600">January: +10%</li>
            <li className="text-sm font-medium text-gray-600">February: -5%</li>
            {/* Add more trend data as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
