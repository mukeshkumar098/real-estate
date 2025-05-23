import { FaBuilding, FaUsers, FaClock } from "react-icons/fa";

const StatCard = ({ label, count, onClick }) => {
  const renderIcon = () => {
    switch (label) {
      case "Total Properties":
        return <FaBuilding className="text-yellow-500 text-3xl" />;
      case "Total Agents":
        return <FaUsers className="text-yellow-500 text-3xl" />;
      case "Pending Approvals":
        return <FaClock className="text-yellow-500 text-3xl" />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
    >
      <div className="p-3 bg-yellow-100 rounded-full">{renderIcon()}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium uppercase">{label}</h3>
        <p className="text-3xl font-extrabold text-yellow-600">{count}</p>
      </div>
    </div>
  );
};

export default StatCard;
