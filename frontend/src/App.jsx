import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import PostSellerProperty from "./Components/PostProperty/PostProperty";
import VerifiedSellersCart from "./Components/agents/agent";

// Lazy-loaded components
const Home = lazy(() => import("./Components/Home/Home"));
const Register = lazy(() => import("./Components/Register/Register"));
const Login = lazy(() => import("./Components/Login/Login"));
const PropertyDetails = lazy(() => import("./Components/PropertyDetails.jsx/PropertyDetails"));
const RealEstateAdminDashboard = lazy(() => import("./Components/Admin/Admin"));
const VerifiedSellers = lazy(() => import("./Components/Admin/Seller"));
const GetAllProperties = lazy(() => import("./Components/Admin/GetAllProperty"));
const AdminUnVerifySeller = lazy(() => import("./Components/Admin/GetAllUnverifiedSeller"));
const AddProperty = lazy(() => import("./Components/Seller/AddProperty"));
const ForgotPassword = lazy(() => import("./Components/Login/ForgetPassword"));
const ResetPassword = lazy(() => import("./Components/Login/ResetPassword"));
const UserProfile = lazy(() => import("./userProfile/userProfile"));
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { FaSpinner } from "react-icons/fa";
import SellerPropertyForm from "./Components/PostProperty/PostProperty";
function App() {
  return (
    <BrowserRouter>
     <Suspense
  fallback={
    <div className="flex flex-col items-center mt-10 text-gray-600">
      <FaSpinner className="animate-spin text-blue-600 text-3xl mb-2" />
      <div>Loading...</div>
    </div>
  }
>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<><Navbar /><UserProfile /><Footer /></>} />
          <Route
            path="/property/:id"
            element={
              <>
                <Navbar />
                
                <PropertyDetails />
                <Footer />
              </>
            }
          />
             <Route path="/agent" element={<><Navbar /><VerifiedSellersCart /><Footer /></>} />
          <Route path="/admin" element={<RealEstateAdminDashboard />} />
          <Route path="/UnverifiedSellers" element={<AdminUnVerifySeller />} />
          <Route path="/VerifiedSellers" element={<VerifiedSellers />} />
          <Route path="/GetAllProperties" element={<GetAllProperties />} />
          <Route path="/seller" element={<SellerPropertyForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
