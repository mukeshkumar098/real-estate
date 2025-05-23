import { Loader2 } from "lucide-react";
import { useState } from "react";

export function RoleSelection({ onContinue, loading }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  
  const roles = ["admin", "seller", "buyer"];
  const purposes = ["Sell", "Rent/lease", "List as PG"];

  const handleContinue = () => {
    if (!selectedRole || !selectedPurpose) return;
    onContinue({ role: selectedRole, purpose: selectedPurpose });
  };

  return (
    <div className="text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Let's get you started</h2>
      
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">You are:</h3>
        <div className="grid grid-cols-3 gap-3">
          {roles.map((role) => (
            <button
              key={role}
              className={`py-2 px-4 border rounded-md text-center ${selectedRole === role ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">You are here to:</h3>
        <div className="grid grid-cols-3 gap-3">
          {purposes.map((purpose) => (
            <button
              key={purpose}
              className={`py-2 px-4 border rounded-md text-center ${selectedPurpose === purpose ? "border-yellow-500 bg-yellow-50 text-yellow-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setSelectedPurpose(purpose)}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleContinue}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        disabled={loading || !selectedRole || !selectedPurpose}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin mr-2" />
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
}