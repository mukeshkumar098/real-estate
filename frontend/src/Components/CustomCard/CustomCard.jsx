import React from "react";

const CustomCard = ({ title, image, description, propertyType, location, price }) => {
  return (
    <div className="border p-4 m-2 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-bold">{title}</h3>
      <img src={image} alt={title} className="w-full object-cover rounded-md my-2" />
      <p className="text-gray-600">{description}</p>
      <p className="text-blue-500 font-medium">Type: {propertyType}</p>
      <p className="text-gray-700">Location: {location}</p>
      <p className="text-green-500 font-semibold">Price: ${price}</p>
    </div>
  );
};

export default CustomCard;
