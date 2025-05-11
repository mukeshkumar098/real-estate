import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaHome,
  FaBuilding,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

    useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);


  const [activeAccordion, setActiveAccordion] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    toast.success("Your message has been sent successfully! Our agent will contact you shortly.");
    reset();
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const contactMethods = [
    {
      icon: <FaPhoneAlt className="text-2xl text-yellow-600" />,
      title: "Sales Department",
      info: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm",
      details: "Our sales team specializes in luxury properties and investment opportunities."
    },
    {
      icon: <FaEnvelope className="text-2xl text-yellow-600" />,
      title: "Email Us",
      info: "sales@premierestate.com",
      description: "Response within 24 hours",
      details: "For general inquiries, property viewings, or partnership opportunities."
    },
    {
      icon: <FaBuilding className="text-2xl text-yellow-600" />,
      title: "Corporate Office",
      info: " 123 Real Estate Tower, agra - 282001",
      description: "Appointments recommended",
      details: "Visit our stunning office for personalized consultations with our top agents."
    }
  ];

  const propertyTypes = [
    { value: "buy", label: "Buying a Home" },
    { value: "sell", label: "Selling a Home" },
    { value: "rent", label: "Rental Property" },
    { value: "commercial", label: "Commercial Property" },
    { value: "investment", label: "Investment Property" },
    { value: "other", label: "Other Inquiry" }
  ];

  const budgetRanges = [
    { value: "100-300", label: "$100k - $300k" },
    { value: "300-500", label: "$300k - $500k" },
    { value: "500-750", label: "$500k - $750k" },
    { value: "750-1M", label: "$750k - $1M" },
    { value: "1M-2M", label: "$1M - $2M" },
    { value: "2M+", label: "$2M+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-12 transform transition duration-500 hover:scale-105">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Your <span className="text-yellow-500">Dream</span> Property
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Our expert agents are ready to guide you through every step of your real estate journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Info + Map */}
          <div className="space-y-8">
            {/* Interactive Contact Cards */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 transition-all duration-300 ${hoveredCard === index ? 'transform -translate-y-1 shadow-xl' : ''}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleAccordion(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{method.title}</h3>
                        <p className="text-gray-700 font-medium">{method.info}</p>
                        <p className="text-gray-500 text-sm mt-1">{method.description}</p>
                      </div>
                    </div>
                    {activeAccordion === index ? (
                      <FaChevronUp className="text-yellow-500" />
                    ) : (
                      <FaChevronDown className="text-yellow-500" />
                    )}
                  </div>
                  {activeAccordion === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200 text-gray-600">
                      {method.details}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h4>
              <div className="flex gap-3">
                {[
                  { icon: <FaFacebookF />, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
                  { icon: <FaInstagram />, color: "bg-pink-600 hover:bg-pink-700", label: "Instagram" },
                  { icon: <FaLinkedinIn />, color: "bg-blue-700 hover:bg-blue-800", label: "LinkedIn" },
                  { icon: <FaTwitter />, color: "bg-sky-500 hover:bg-sky-600", label: "Twitter" },
                  { icon: <FaYoutube />, color: "bg-red-600 hover:bg-red-700", label: "YouTube" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className={`p-3 ${social.color} text-white rounded-full transition transform hover:scale-110 flex items-center justify-center`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Interactive Map */}
            <div className="rounded-xl overflow-hidden shadow-xl border-2 border-yellow-400 hover:border-yellow-500 transition duration-300">
              <iframe
                title="Premiere Estate Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.748370366291!2d-118.40184192426694!3d34.06646527314933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc85a09d083d%3A0x6c11a9b8a7a046f1!2sBeverly%20Hills%2C%20CA%2090210%2C%20USA!5e0!3m2!1sen!2sin!4v1712345678901!5m2!1sen!2sin"
                className="w-full h-96 border-none"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Right Section: Form */}
          <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl border-t-4 border-yellow-500 transform transition duration-500 hover:shadow-2xl">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                <span className="text-yellow-500">Personalized</span> Consultation
              </h2>
              <p className="text-gray-600">
                Complete this form and we'll match you with the perfect agent for your needs.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div className="relative group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: "Please enter your name" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400"
                  placeholder="John Smith"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Please enter your email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="relative group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Property Interest */}
              <div className="relative group">
                <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Interest
                </label>
                <select
                  id="interest"
                  {...register("interest")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmFjMDUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-3"
                >
                  <option value="">Select an option</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="relative group">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <select
                  id="budget"
                  {...register("budget")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmYmFjMDUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im02IDkgNiA2IDYtNiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-3"
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="relative group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", { required: "Please enter your message" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition group-hover:border-yellow-400"
                  placeholder="Tell us about your dream property..."
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.message.message}</p>
                )}
              </div>

              <div className="flex items-center group">
                <input
                  id="newsletter"
                  type="checkbox"
                  {...register("newsletter")}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded group-hover:border-yellow-400 transition"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700 group-hover:text-gray-800 transition">
                  Subscribe to our newsletter for exclusive listings and market insights
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md transform hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <IoMdSend className="mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;