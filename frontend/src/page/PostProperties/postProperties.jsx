import { useState, useEffect } from "react";
import { Phone, Mail, CheckCircle, User, Home, ArrowRight, Loader2, Shield, ShieldCheck, Clock, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RoleSelection } from "./roleSection";
import { ListingPermission } from "./listinngPermission";
import axios from "axios";

export default function ProfileVerificationFlow() {
  const [step, setStep] = useState(0); // Start with role selection
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("unverified");
  const [userRole, setUserRole] = useState({ role: "", purpose: "" });
  const navigate = useNavigate();

  // Check verification status
  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/properties/check_Verified_Seller`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.isVerified) {
        setVerificationStatus("verified");
        return true;
      }

      setVerificationStatus(data.verificationStatus || "unverified");
      return false;
    } catch (err) {
      console.error("Error checking verification status:", err);
      setError("Failed to check verification status. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check verification status on component mount
  useEffect(() => {
    const verifyAndRedirect = async () => {
      const isVerified = await checkVerificationStatus();
      if (isVerified) {
        // If already verified, skip to listing permission
        setStep(6);
      }
    };
    verifyAndRedirect();
  }, [navigate]);

  // Handle role selection and continue
  const handleRoleSelection = async ({ role, purpose }) => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/update-Seller`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          role,
          purpose 
        })
      });

      if (!response.ok) throw new Error("Failed to save role information");

      setUserRole({ role, purpose });
      setStep(1);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle phone submission
  const handlePhoneSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("authToken");
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/update-phone`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      setSuccess("OTP sent successfully!");
      setTimeout(() => {
        setSuccess("");
        setStep(2);
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handlePhoneOtpSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ 
          phoneNumber: formattedPhone,
          otp: phoneOtp.join("")
        })
      });
      
      if (!response.ok) throw new Error("Invalid OTP");
      
      setSuccess("Phone verified successfully!");
      setTimeout(() => {
        setSuccess("");
        setStep(3);
      }, 1500);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/emailOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) throw new Error("Failed to send email OTP");
      
      setSuccess("Email OTP sent successfully!");
      setTimeout(() => {
        setSuccess("");
        setStep(4);
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong with email verification.");
    } finally {
      setLoading(false);
    }
  };

  // Handle email OTP verification
  const handleEmailOtpSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email,
          otp: emailOtp.join("")
        })
      });
      
      if (!response.ok) throw new Error("Invalid OTP");
      
      setSuccess("Email verified successfully!");
      setTimeout(() => {
        setSuccess("");
        setStep(5);
      }, 1500);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile completion and admin verification request
  const handleProfileSubmit = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("authToken");
      
      const response = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          bio,
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          email,
          verificationStatus: "pending"
        })
      });
      
      if (!response.ok) throw new Error("Failed to update profile");
      
      setSuccess("Profile submitted for admin verification!");
      setTimeout(async () => {
        setSuccess("");
        setStep(6); // Move to verification status step
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle agreement to listing terms
  const handleAgreeToTerms = async () => {
    setLoading(true);
    try {
      navigate("/post-property-form");
    } catch (err) {
      setError(err.message || "Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (e, index, otpType) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    
    if (otpType === 'phone') {
      const newOtp = [...phoneOtp];
      newOtp[index] = value;
      setPhoneOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`phone-otp-${index + 1}`);
        nextInput && nextInput.focus();
      }
    } else {
      const newOtp = [...emailOtp];
      newOtp[index] = value;
      setEmailOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`email-otp-${index + 1}`);
        nextInput && nextInput.focus();
      }
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (e, index, otpType) => {
    if (e.key === "Backspace" && !(otpType === 'phone' ? phoneOtp[index] : emailOtp[index]) && index > 0) {
      const prevInput = document.getElementById(`${otpType}-otp-${index - 1}`);
      prevInput && prevInput.focus();
    }
  };

  // Handle enter key press
  const handleKeyPress = (e, submitFunction) => {
    if (e.key === "Enter") {
      submitFunction();
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Handle phone input with formatting
  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  // Handle check verification status button click
  const handleCheckVerification = async () => {
    const isVerified = await checkVerificationStatus();
    if (isVerified) {
      setStep(6); // Move to verification complete step
    }
  };

  // Handle continue to property listing
  const handleContinueToListing = () => {
    setStep(7); // Move to listing permission
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pb-6">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-yellow-500 relative">
        <img 
          src="/api/placeholder/1200/900" 
          alt="Real estate" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-12 bg-gradient-to-br from-yellow-800/70 to-yellow-500/40">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to Premium Properties</h1>
          <p className="text-white/90 text-lg max-w-md">
            Verify your account to unlock exclusive real estate listings and personalized property recommendations.
          </p>
          
          {/* Progress indicator */}
          <div className="mt-16">
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 0 ? "bg-white text-yellow-600" : "bg-white/30 text-white"}`}>
                <User size={18} />
              </div>
              <span className="text-white/90">Role Selection</span>
            </div>
            <div className={`h-12 border-l-2 ml-4 ${step >= 1 ? "border-white" : "border-white/30"}`}></div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-white text-yellow-600" : "bg-white/30 text-white"}`}>
                <Phone size={18} />
              </div>
              <span className="text-white/90">Phone Verification</span>
            </div>
            <div className={`h-12 border-l-2 ml-4 ${step >= 3 ? "border-white" : "border-white/30"}`}></div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-white text-yellow-600" : "bg-white/30 text-white"}`}>
                <Mail size={18} />
              </div>
              <span className="text-white/90">Email Verification</span>
            </div>
            <div className={`h-12 border-l-2 ml-4 ${step >= 5 ? "border-white" : "border-white/30"}`}></div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 5 ? "bg-white text-yellow-600" : "bg-white/30 text-white"}`}>
                <User size={18} />
              </div>
              <span className="text-white/90">Complete Profile</span>
            </div>
            <div className={`h-12 border-l-2 ml-4 ${step >= 6 ? "border-white" : "border-white/30"}`}></div>
            
            <div className="flex items-center space-x-4 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 6 ? "bg-white text-yellow-600" : "bg-white/30 text-white"}`}>
                <ShieldCheck size={18} />
              </div>
              <span className="text-white/90">Verification Status</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <Home className="h-8 w-8 text-yellow-500" />
            <span className="ml-2 text-2xl font-bold text-gray-800">Premium Properties</span>
          </div>
          
          {/* Mobile progress indicator */}
          <div className="lg:hidden flex justify-between mb-8">
            <div className={`h-2 ${step >= 0 ? "bg-yellow-500" : "bg-gray-200"} rounded-l flex-1`}></div>
            <div className={`h-2 ${step >= 1 ? "bg-yellow-500" : "bg-gray-200"} flex-1 mx-0.5`}></div>
            <div className={`h-2 ${step >= 2 ? "bg-yellow-500" : "bg-gray-200"} flex-1 mx-0.5`}></div>
            <div className={`h-2 ${step >= 3 ? "bg-yellow-500" : "bg-gray-200"} flex-1 mx-0.5`}></div>
            <div className={`h-2 ${step >= 4 ? "bg-yellow-500" : "bg-gray-200"} flex-1 mx-0.5`}></div>
            <div className={`h-2 ${step >= 5 ? "bg-yellow-500" : "bg-gray-200"} flex-1 mx-0.5`}></div>
            <div className={`h-2 ${step >= 6 ? "bg-yellow-500" : "bg-gray-200"} rounded-r flex-1`}></div>
          </div>
          
          {/* Success and error messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
              <CheckCircle size={18} className="mr-2" />
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Show listing permission if verified */}
          {step === 7 ? (
            <ListingPermission 
              onAgree={handleAgreeToTerms}
              onDisagree={() => navigate("/")}
              loading={loading}
            />
          ) : (
            <>
              {/* Role selection - Step 0 */}
              {step === 0 && (
                <RoleSelection 
                  onContinue={handleRoleSelection}
                  loading={loading}
                />
              )}

              {/* Phone verification - Step 1 */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify your phone number</h2>
                  <p className="text-gray-600 mb-6">
                    Enter your phone number to receive a verification code.
                  </p>
                  
                  <div>
                    <div className="mb-6">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone size={18} className="text-yellow-500" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="(555) 123-4567"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          onKeyPress={(e) => handleKeyPress(e, handlePhoneSubmit)}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Format: (123) 456-7890</p>
                    </div>
                    
                    <button
                      onClick={handlePhoneSubmit}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      disabled={loading || !phoneNumber}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <>
                          Send Verification Code <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Phone OTP verification - Step 2 */}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter phone verification code</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a 6-digit code to <span className="font-medium">{phoneNumber}</span>
                  </p>
                  
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Verification Code
                      </label>
                      <div className="flex justify-between gap-2">
                        {phoneOtp.map((digit, index) => (
                          <input
                            key={index}
                            id={`phone-otp-${index}`}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index, 'phone')}
                            onKeyDown={(e) => handleOtpKeyDown(e, index, 'phone')}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-center mb-6">
                      <span className="text-gray-500 mr-2">Didn't receive the code?</span>
                      <button 
                        type="button" 
                        className="text-yellow-600 hover:text-yellow-800 font-medium"
                        onClick={() => {
                          setPhoneOtp(["", "", "", "", "", ""]);
                          handlePhoneSubmit();
                        }}
                      >
                        Resend code
                      </button>
                    </div>
                    
                    <button
                      onClick={handlePhoneOtpSubmit}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      disabled={loading || phoneOtp.some(digit => !digit)}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <>
                          Verify Phone <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Email submission - Step 3 */}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify your email</h2>
                  <p className="text-gray-600 mb-6">
                    Enter your email address to receive a verification code.
                  </p>
                  
                  <div>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-yellow-500" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleEmailSubmit)}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleEmailSubmit}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      disabled={loading || !email}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <>
                          Send Email Verification Code <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Email OTP verification - Step 4 */}
              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter email verification code</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a 6-digit code to <span className="font-medium">{email}</span>
                  </p>
                  
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Verification Code
                      </label>
                      <div className="flex justify-between gap-2">
                        {emailOtp.map((digit, index) => (
                          <input
                            key={index}
                            id={`email-otp-${index}`}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index, 'email')}
                            onKeyDown={(e) => handleOtpKeyDown(e, index, 'email')}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-center mb-6">
                      <span className="text-gray-500 mr-2">Didn't receive the code?</span>
                      <button 
                        type="button" 
                        className="text-yellow-600 hover:text-yellow-800 font-medium"
                        onClick={() => {
                          setEmailOtp(["", "", "", "", "", ""]);
                          handleEmailSubmit();
                        }}
                      >
                        Resend code
                      </button>
                    </div>
                    
                    <button
                      onClick={handleEmailOtpSubmit}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      disabled={loading || emailOtp.some(digit => !digit)}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <>
                          Verify Email <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Complete profile - Step 5 */}
              {step === 5 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete your profile</h2>
                  <p className="text-gray-600 mb-6">
                    Tell us a bit about yourself to help us personalize your experience.
                  </p>
                  
                  <div>
                    <div className="mb-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="Tell us about your interests in real estate..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500">
                        This information will be reviewed by our admin team before you can post properties.
                      </p>
                    </div>
                    
                    <button
                      onClick={handleProfileSubmit}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      disabled={loading || !bio}
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        "Submit for Admin Verification"
                      )}
                    </button>
                  </div>
                </>
              )}

              {/* Verification status - Step 6 */}
              {step === 6 && (
                <div className="text-center">
                  {verificationStatus === "verified" ? (
                    <>
                      <div className="mb-6 flex justify-center">
                        <ShieldCheck size={48} className="text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Complete!</h2>
                      <p className="text-gray-600 mb-6">
                        Your account has been successfully verified. You can now list properties on our platform.
                      </p>
                      <button
                        onClick={handleContinueToListing}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      >
                        Continue to Property Listing <ArrowRight size={18} className="ml-2" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-6 flex justify-center">
                        {verificationStatus === "pending" ? (
                          <Clock size={48} className="text-yellow-500" />
                        ) : (
                          <AlertTriangle size={48} className="text-red-500" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {verificationStatus === "pending" ? "Verification Pending" : "Verification Required"}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {verificationStatus === "pending" 
                          ? "Your profile is under review by our admin team. This process usually takes 1-2 business days. You'll receive an email notification once your verification is complete."
                          : "Your profile needs to be verified before you can list properties. Please complete all verification steps."}
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={handleCheckVerification}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                          ) : (
                            "Check Verification Status"
                          )}
                        </button>
                        <button
                          onClick={() => navigate("/")}
                          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                        >
                          Return to Home
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}