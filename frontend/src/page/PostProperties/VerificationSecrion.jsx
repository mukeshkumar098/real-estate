import { AlertTriangle, Clock, Loader2, Shield } from 'lucide-react';
import React from 'react'

function VerificationStatus({ verificationStatus, onCheckStatus, onEditProfile, loading }) {
  return (
    <div className="text-center">
      {verificationStatus === "pending" && (
        <>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Waiting for Admin Verification</h2>
          <p className="text-gray-600 mb-6">
            Your profile has been submitted for verification. Our admin team will review your information 
            and you'll receive an email notification once approved. This usually takes 1-2 business days.
          </p>
        </>
      )}
      
      {verificationStatus === "rejected" && (
        <>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Rejected</h2>
          <p className="text-gray-600 mb-6">
            Your profile verification was rejected. Please update your information and resubmit for review.
          </p>
        </>
      )}
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Why do we verify users?</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                We verify all users to maintain a trusted community of real estate professionals 
                and ensure the quality of listings on our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onCheckStatus}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin mr-2" />
        ) : (
          "Check Verification Status"
        )}
      </button>
      
      {verificationStatus === "rejected" && (
        <button
          onClick={onEditProfile}
          className="mt-4 w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          Edit Profile and Resubmit
        </button>
      )}
    </div>
  );
}

export default VerificationStatus