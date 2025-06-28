import React from "react";
import * as echarts from "echarts";
import { StatCard } from "./StatCard";
export const DashboardContent: React.FC = () => {
  React.useEffect(() => {
    // Sales Overview Chart
    const salesChart = echarts.init(document.getElementById("sales-chart"));
    const salesOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Orders", "Revenue"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Orders",
          type: "line",
          data: [120, 132, 101, 134, 90, 230, 210],
          smooth: true,
          lineStyle: {
            color: "#4f46e5",
          },
          itemStyle: {
            color: "#4f46e5",
          },
        },
        {
          name: "Revenue",
          type: "line",
          data: [220, 182, 191, 234, 290, 330, 310],
          smooth: true,
          lineStyle: {
            color: "#10b981",
          },
          itemStyle: {
            color: "#10b981",
          },
        },
      ],
    };
    salesChart.setOption(salesOption);
    // Product Categories Chart
    const categoryChart = echarts.init(
      document.getElementById("category-chart")
    );
    const categoryOption = {
      animation: false,
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Product Categories",
          type: "pie",
          radius: "70%",
          data: [
            { value: 1048, name: "Electronics" },
            { value: 735, name: "Clothing" },
            { value: 580, name: "Home & Garden" },
            { value: 484, name: "Books" },
            { value: 300, name: "Others" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    categoryChart.setOption(categoryOption);
    // Handle resize
    const handleResize = () => {
      salesChart.resize();
      categoryChart.resize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      salesChart.dispose();
      categoryChart.dispose();
    };
  }, []);
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Revenue"
          value="$24,560"
          change="+8.2%"
          isPositive={true}
          icon="fa-dollar-sign"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Orders"
          value="1,352"
          change="+5.1%"
          isPositive={true}
          icon="fa-shopping-cart"
          color="bg-green-500"
        />
        <StatCard
          title="New Customers"
          value="212"
          change="+12.4%"
          isPositive={true}
          icon="fa-users"
          color="bg-purple-500"
        />
        <StatCard
          title="Refund Rate"
          value="3.2%"
          change="-1.8%"
          isPositive={true}
          icon="fa-exchange-alt"
          color="bg-red-500"
        />
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
          <div
            id="sales-chart"
            style={{ height: "300px", width: "100%" }}
          ></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
          <div
            id="category-chart"
            style={{ height: "300px", width: "100%" }}
          ></div>
        </div>
      </div>
      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  id: "#ORD-001",
                  customer: "Emma Wilson",
                  date: "Jun 18, 2025",
                  amount: "$120.50",
                  status: "Completed",
                },
                {
                  id: "#ORD-002",
                  customer: "Michael Brown",
                  date: "Jun 17, 2025",
                  amount: "$85.20",
                  status: "Processing",
                },
                {
                  id: "#ORD-003",
                  customer: "Sarah Johnson",
                  date: "Jun 17, 2025",
                  amount: "$210.75",
                  status: "Completed",
                },
                {
                  id: "#ORD-004",
                  customer: "James Smith",
                  date: "Jun 16, 2025",
                  amount: "$65.30",
                  status: "Pending",
                },
                {
                  id: "#ORD-005",
                  customer: "Lisa Davis",
                  date: "Jun 16, 2025",
                  amount: "$149.99",
                  status: "Completed",
                },
              ].map((order, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer !rounded-button whitespace-nowrap">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 cursor-pointer !rounded-button whitespace-nowrap">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Top Selling Products</h2>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Wireless Headphones",
              category: "Electronics",
              price: "$89.99",
              sold: "245 units",
              image:
                "https://readdy.ai/api/search-image?query=wireless%20headphones%20with%20sleek%20modern%20design%20on%20a%20simple%20white%20background%2C%20premium%20quality%20product%20photography%2C%20high%20resolution%2C%20commercial%20product%20shot%20with%20soft%20lighting&width=100&height=100&seq=2&orientation=squarish",
            },
            {
              name: "Smart Watch",
              category: "Electronics",
              price: "$199.99",
              sold: "187 units",
              image:
                "https://readdy.ai/api/search-image?query=modern%20smartwatch%20with%20black%20band%20on%20a%20simple%20white%20background%2C%20premium%20quality%20product%20photography%2C%20high%20resolution%2C%20commercial%20product%20shot%20with%20soft%20lighting&width=100&height=100&seq=3&orientation=squarish",
            },
            {
              name: "Cotton T-Shirt",
              category: "Clothing",
              price: "$24.99",
              sold: "156 units",
              image:
                "https://readdy.ai/api/search-image?query=plain%20white%20cotton%20t-shirt%20folded%20neatly%20on%20a%20simple%20white%20background%2C%20premium%20quality%20product%20photography%2C%20high%20resolution%2C%20commercial%20product%20shot%20with%20soft%20lighting&width=100&height=100&seq=4&orientation=squarish",
            },
          ].map((product, index) => (
            <div
              key={index}
              className="flex items-center p-4 border border-gray-200 rounded-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover object-top rounded-md"
              />
              <div className="ml-4">
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {product.price}
                  </span>
                  <span className="text-sm text-gray-500">{product.sold}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
