//import axios from 'axios'
import React, { useEffect } from 'react'
import { FaChevronRight } from "react-icons/fa";

const properties = [
  {
    id: 1,
    image: "internship-portal.webp", // Replace with actual image URL
    bhk: "3 BHK Flat",
    price: "₹2.70 Cr",
    area: "1935 sqft",
    location: "Vasundhara, Ghaziabad",
    status: "Ready to Move",
    imagesCount: 4,
  },
  {
    id: 2,
    image: "internship-portal.webp",
    bhk: "2 BHK Flat",
    price: "₹95 Lac",
    area: "1155 sqft",
    location: "Siddharth Vihar, Ghaziabad",
    status: "Ready to Move",
    imagesCount: 29,
  },
  {
    id: 3,
    image: "internship-portal.webp",
    bhk: "2 BHK Flat",
    price: "₹23 Lac",
    area: "750 sqft",
    location: "Sector 1 Vasundhara, Ghaziabad",
    status: "Ready to Move",
    imagesCount: 3,
  },
];

const PopularProperties = ({ property }) => {

    // const property=async()=>{
    //     try {
    //         let res=await axios.get(`${BACK_END_URL}/properties/getProperties`)
    //         console.log(res);
            
    //     } catch (error) {
    //         console.log(error);
            
    //     }
    // }

    // useEffect(()=>{
    //     property()
    // })

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-80">
    <div className="relative">
      <img src={property.image} alt={property.bhk} className="w-full h-48 object-cover" />
      <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
        📷 {property.imagesCount}
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold">{property.bhk}</h3>
      <p className="text-gray-700 font-bold">{property.price} | {property.area}</p>
      <p className="text-gray-600 text-sm">{property.location}</p>
      <p className="text-green-600 text-xs font-semibold mt-1">{property.status}</p>
    </div>
  </div>
  )
}

export default PopularProperties
