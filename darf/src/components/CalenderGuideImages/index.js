import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imgA from "./1.png";
import imgB from "./2.png";
import imgC from "./3.png";
import imgD from "./4.png";
import imgE from "./test1.JPG";
import imgF from "./test2.JPG";

const CalenderGuideImages = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    className: "slickCenter",
    infinite: true,
    speed: 1000,
    // lazyLoad: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    dots: true,
    afterChange: (currentSlide) => {
      setCurrentSlide(currentSlide);
    },
  };

  return (
    <div className="CalenderGuideImages">
      <h1 className="Header">이용 가이드</h1>
      <Slider {...settings}>
        <div>
          <img
            className="sliderImg"
            src={imgE}
            alt="https://ssl.pstatic.net/melona/libs/1399/1399997/d88d44b2d0479a8ff618_20220629140444294.jpg"
          ></img>
        </div>
        <div>
          <img
            className="sliderImg"
            src={imgF}
            alt="https://ssl.pstatic.net/melona/libs/1399/1399997/d88d44b2d0479a8ff618_20220629140444294.jpg"
          ></img>
        </div>
        <div>
          <img
            className="sliderImg"
            src={imgC}
            alt="https://ssl.pstatic.net/melona/libs/1399/1399997/d88d44b2d0479a8ff618_20220629140444294.jpg"
          ></img>
        </div>
        <div>
          <img
            className="sliderImg"
            src={imgD}
            alt="https://ssl.pstatic.net/melona/libs/1399/1399997/d88d44b2d0479a8ff618_20220629140444294.jpg"
          ></img>
        </div>
      </Slider>
    </div>
  );
};

export default CalenderGuideImages;
