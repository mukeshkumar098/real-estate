import { useState } from "react";
import { FileText, Loader2 } from "lucide-react"; // ✅ Import icons from lucide-react

export function ListingPermission({ onAgree, onDisagree, loading }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="text-left max-w-xl mx-auto">
      {/* Icon */}
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4 mx-auto">
        <FileText className="h-6 w-6 text-green-600" />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Property Listing Agreement
      </h2>

      {/* Terms Box */}
      <div className="bg-gray-50 p-4 rounded-md mb-6 max-h-60 overflow-y-auto border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">Terms and Conditions:</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          <li>I confirm that all properties I list are legally owned or authorized for sale/rent by the owner.</li>
          <li>I will provide accurate and truthful information about all properties listed.</li>
          <li>I understand that fraudulent listings will result in immediate account suspension.</li>
          <li>I agree to comply with all local real estate laws and regulations.</li>
          <li>I will not engage in any discriminatory practices prohibited by law.</li>
          <li>I understand that Premium Properties may verify my listings and request additional documentation.</li>
        </ol>
      </div>

      {/* Agreement Checkbox */}
      <div className="flex items-start mb-6">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="font-medium text-gray-700">
            I agree to the terms and conditions
          </label>
          <p className="text-gray-500">
            You must agree to list properties on our platform.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onDisagree}
          className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          I Disagree
        </button>
        <button
          onClick={onAgree}
          disabled={!checked || loading}
          className="flex-1 py-3 px-4 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            "I Agree - Continue"
          )}
        </button>
      </div>
    </div>
  );
}
