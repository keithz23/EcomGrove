export const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
}> = ({ title, value, change, isPositive, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full`}>
          <i className={`fas ${icon} text-white`}></i>
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <span
          className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          <i
            className={`fas ${isPositive ? "fa-arrow-up" : "fa-arrow-down"} mr-1`}
          ></i>
          {change}
        </span>
        <span className="text-gray-500 text-sm ml-1">since last month</span>
      </div>
    </div>
  );
};