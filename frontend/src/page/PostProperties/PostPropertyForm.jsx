import React, { useState } from "react";

const SellerPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    property_subtype: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor_number: "",
    total_floors: "",
    price: "",
    location: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    latitude: "",
    longitude: "",
    built_up_area: "",
    carpet_area: "",
    plot_area: "",
    facing: "",
    age: "",
    ownership_type: "",
    possession_status: "",
    amenities: [],
    approved_by: [],
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = ["Residential", "Commercial", "Land", "Industrial"];
  const residentialSubtypes = ["Apartment", "Villa", "Plot", "House", "Penthouse"];
  const commercialSubtypes = ["Office", "Shop", "Showroom", "Warehouse", "Hotel"];
  const facingOptions = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
  const ownershipTypes = ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney"];
  const possessionStatuses = ["Ready to Move", "Under Construction", "New Launch"];
  
  const amenityOptions = [
    'Parking', 
    'Swimming Pool', 
    'Gym', 
    'Lift', 
    'Security', 
    'Power Backup',
    'Water Supply', 
    'Park', 
    'Clubhouse', 
    'Play Area', 
    'Intercom', 
    'Maintenance Staff',
    'Rain Water Harvesting', 
    'Shopping Center', 
    'Hospital', 
    'School', 
    'Pet Friendly'
  ];

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.property_type) newErrors.property_type = "Property type is required";
    if (!formData.property_subtype) newErrors.property_subtype = "Property subtype is required";
    if (!formData.bedrooms) newErrors.bedrooms = "Bedrooms is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.contact_name) newErrors.contact_name = "Contact name is required";
    if (!formData.contact_phone) newErrors.contact_phone = "Contact phone is required";
    if (!formData.contact_email) newErrors.contact_email = "Contact email is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else if (name === "approved_by") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map(item => item.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    const submissionData = new FormData();

    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => {
          submissionData.append("images", file);
        });
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((val) => submissionData.append(key, val));
      } else if (formData[key] !== "") {
        submissionData.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_END_URL}/properties/add-properties`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: submissionData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Property added successfully!");
        setFormData({
          title: "",
          description: "",
          property_type: "",
          property_subtype: "",
          bedrooms: "",
          bathrooms: "",
          balconies: "",
          floor_number: "",
          total_floors: "",
          price: "",
          location: "",
          street: "",
          city: "",
          state: "",
          postal_code: "",
          country: "India",
          latitude: "",
          longitude: "",
          built_up_area: "",
          carpet_area: "",
          plot_area: "",
          facing: "",
          age: "",
          ownership_type: "",
          possession_status: "",
          amenities: [],
          approved_by: [],
          contact_name: "",
          contact_phone: "",
          contact_email: "",
          images: [],
        });
      } else {
        alert(result.message || "Failed to add property");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server or network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubtypeOptions = () => {
    switch (formData.property_type) {
      case "Residential":
        return residentialSubtypes;
      case "Commercial":
        return commercialSubtypes;
      case "Land":
        return ["Residential Plot", "Commercial Plot", "Agricultural Land"];
      case "Industrial":
        return ["Factory", "Warehouse", "Industrial Shed"];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-600 border-b-2 border-yellow-500 pb-3">
        List Your Property
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">1</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. Beautiful 3BHK Apartment in Prime Location"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Detailed description of your property"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type*</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.property_type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.property_type && <p className="mt-1 text-sm text-red-600">{errors.property_type}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Subtype*</label>
              <select
                name="property_subtype"
                value={formData.property_subtype}
                onChange={handleChange}
                disabled={!formData.property_type}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.property_subtype ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Subtype</option>
                {getSubtypeOptions().map(subtype => (
                  <option key={subtype} value={subtype}>{subtype}</option>
                ))}
              </select>
              {errors.property_subtype && <p className="mt-1 text-sm text-red-600">{errors.property_subtype}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Property Details */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">2</span>
            Property Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms*</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Balconies</label>
              <input
                type="number"
                name="balconies"
                value={formData.balconies}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
              <input
                type="number"
                name="floor_number"
                value={formData.floor_number}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
              <input
                type="number"
                name="total_floors"
                value={formData.total_floors}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Built-up Area (sq.ft)</label>
              <input
                type="number"
                name="built_up_area"
                value={formData.built_up_area}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq.ft)</label>
              <input
                type="number"
                name="carpet_area"
                value={formData.carpet_area}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (sq.ft)</label>
              <input
                type="number"
                name="plot_area"
                value={formData.plot_area}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
              <select
                name="facing"
                value={formData.facing}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select Facing</option>
                {facingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age of Property (years)</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
              <select
                name="ownership_type"
                value={formData.ownership_type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select Ownership Type</option>
                {ownershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Possession Status</label>
              <select
                name="possession_status"
                value={formData.possession_status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select Possession Status</option>
                {possessionStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Location Details */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">3</span>
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. 123 Main Street"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark/Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. Near Central Park"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. 28.6139"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g. 77.2090"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Features & Amenities */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">4</span>
            Features & Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Amenities</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Approved By (comma separated)</label>
                <input
                  type="text"
                  name="approved_by"
                  value={formData.approved_by.join(", ")}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="e.g. RERA, Municipal Corporation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selected Amenities</label>
                <div className="p-3 border border-gray-300 rounded-lg min-h-12">
                  {formData.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleAmenityChange(amenity)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No amenities selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Contact Information */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">5</span>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name*</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.contact_name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contact_name && <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone*</label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.contact_phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email*</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${errors.contact_email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
            </div>
          </div>
        </div>

        {/* Section 6: Images Upload */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
          <h3 className="text-xl font-bold mb-4 text-yellow-700 border-b border-yellow-200 pb-2">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full mr-2">6</span>
            Property Images
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (1-20)*</label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.images ? 'border-red-500' : 'border-gray-300'}`}>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </label>
            </div>
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            
            {formData.images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images ({formData.images.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(formData.images).map((file, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Submit Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerPropertyForm;