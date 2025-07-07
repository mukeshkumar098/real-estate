import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChevronRight, FaArrowLeft } from "react-icons/fa";
import PropertyDetails from "./PropertyDetails";
import Navbar from "../Header/Header";
import Footer from "../Footer/Footer";

const SimpleHomePanel = ({ title }) => {
    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
            <div className="  bg-white  p-4  border-gray-100">
                <div className="flex items-center justify-between ">
                    {/* Left side: Breadcrumb */}
                    <div className="flex items-center text-sm">
                        <Link to="/" className="flex items-center text-yellow-500 hover:text-yellow-600 transition">
                            <FaHome className="mr-1" />
                            <span>Home</span>
                        </Link>
                        <FaChevronRight className="mx-2 text-gray-300" />
                        <span className="text-gray-700 font-medium truncate max-w-[200px]">
                            {title || "Property Details"}
                        </span>
                    </div>

                    {/* Right side: Back to properties button */}
                    {/* <Link
                        to="/properties"
                        className="hidden sm:flex items-center text-yellow-500 hover:text-yellow-600 transition text-sm font-medium"
                    >
                        <FaArrowLeft className="mr-1" />
                        <span>Back to Properties</span>
                    </Link> */}
                </div>
            </div>
              <PropertyDetails />
            </div>
            
          <Footer />

        </>
    );
};

export default SimpleHomePanel;