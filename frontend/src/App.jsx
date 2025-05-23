import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import VerifiedSellersCart from "./Components/agents/agent";

// Lazy-loaded components
const Home = lazy(() => import("./Components/Home/Home"));
const Register = lazy(() => import("./Components/Register/Register"));
const Login = lazy(() => import("./Components/Login/Login"));
const PropertyDetails = lazy(() => import("./Components/PropertyDetails.jsx/PropertyDetails"));

const VerifiedSellers = lazy(() => import("./Components/Admin/Seller"));
const GetAllProperties = lazy(() => import("./Components/Admin/GetAllProperty"));
const AdminUnVerifySeller = lazy(() => import("./Components/Admin/GetAllUnverifiedSeller"));
const AddProperty = lazy(() => import("./Components/Seller/AddProperty"));
const ForgotPassword = lazy(() => import("./Components/Login/ForgetPassword"));
const ResetPassword = lazy(() => import("./Components/Login/ResetPassword"));
const UserProfile = lazy(() => import("./userProfile/userProfile"));
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { FaSpinner } from "react-icons/fa";
import AllProperties from "./page/allProperty";
import ContactPage from "./page/contect-Us/contact";
import AboutPage from "./page/about-Us/about";
import SimpleHomePanel from "./Components/PropertyDetails.jsx";
import ProfileVerificationFlow from "./page/PostProperties/postProperties.jsx";
import SellerPropertyForm from "./page/PostProperties/PostPropertyForm.jsx";
import RealEstateAdminDashboard from "./Components/Admin/Admin.jsx";
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
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<><Navbar /><UserProfile /><Footer /></>} />
          <Route path="/all-properties" element={<><Navbar /><AllProperties /><Footer /></>} />
          <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
          <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
          <Route path="/post" element={<><Navbar /><ProfileVerificationFlow /><Footer /></>} />
          <Route
            path="/property/:id"
            element={ <><SimpleHomePanel /></>}/>
          <Route path="/agent" element={<><Navbar /><VerifiedSellersCart /><Footer /></>} />


      <Route path="/admin-dashboard" element={<RealEstateAdminDashboard />} />
   <Route path="/admin-dashboard/properties" element={<AdminUnVerifySeller />} />
<Route path="/admin-dashboard" element={<VerifiedSellers />} />
<Route path="/GetAllProperties/properties" element={<GetAllProperties />} />
          <Route path="/post-property-form" element={<><Navbar /><SellerPropertyForm /><Footer /></>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
