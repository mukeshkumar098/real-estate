import React from 'react'
import Header from '../Header/Header'
import SearchHouse from '../SeachHouse/SearchHouse'
import Footer from '../Footer/Footer'
import PopularProperties from '../PopularProperties/PopularProperties'
import GetAllProperties from '../GetAllProperties.jsx/GetAllProperties'
import PostSellerProperty from '../PostProperty/PostProperty.jsx'
import Carousel from '../Carousel/Carousel.jsx'
import PropertyCarousel from '../../page/recentProduct.jsx'
import AgentCarousel from '../../Seller/allAgent.jsx'

const Home = () => {

  const imageArray = [
    "./Images/images.jpeg",
    "./Images/1.jpg",
    "./Images/2.jpg",
    "./Images/3.jpg",
    "./Images/4.jpeg"
  ];

  return (
    <>
      <Header/>
      <SearchHouse/>
      <div>
        <div className="m-5 mb-20 flex justify-center items-center">
          <Carousel images={imageArray} />
        </div>
      </div>
      <PropertyCarousel/>
      <GetAllProperties/>
      <AgentCarousel/>
      {/* <PostSellerProperty/> */}
      <Footer/>
    </>
  )
}

export default Home