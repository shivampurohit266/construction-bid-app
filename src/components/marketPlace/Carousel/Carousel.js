import React, { useState, useEffect } from "react";
import { url } from "../../../helper/helper";
import { ReactComponent as LeftArrow } from "../../../images/left-arrowCar.svg";
import { ReactComponent as RightArrow } from "../../../images/right-arrowCar.svg";

import "./Carousel.css";
const Carousel = ({ featuredImage, images }) => {
  const [current, setCurrent] = useState(0);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    mergePhotos();
  }, [images]);

  const mergePhotos = () => {
    const featImage = [featuredImage];

    const imgValue = images ? Object.values(images) : "";
    setGallery(featImage.concat(imgValue));
  };

  const nextSlide = () => {
    setCurrent(current === gallery?.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? gallery.length - 1 : current - 1);
  };

  if (!Array.isArray(gallery) || gallery.length <= 0) {
    return null;
  }

  const Buttons = () => {
    let li = [];
    gallery && gallery.forEach((img, index) => li.push(index));

    return (
      <ol className="carousel_indicators">
        {li.map((slide, i) => {
          return (
            <li
              key={i}
              className={current === slide ? "activeBTN" : ""}
              value={i}
              onClick={(e) => setCurrent(e.target.value)}
            >
              {slide}
            </li>
          );
        })}
      </ol>
    );
  };

  return (
    <>
      {gallery[0] === undefined || gallery[0] === null ? (
        ""
      ) : (
        <section
          className="carousel-slider "
          style={
            gallery[0] !== undefined ? { display: "Flex" } : { display: "None" }
          }
        >
          <LeftArrow className="carousel-arrow-left" onClick={prevSlide} />
          <RightArrow className="carousel-arrow-right" onClick={nextSlide} />

          {gallery?.map((slide, index) => {
            return (
              <>
                <div
                  className={
                    index === current
                      ? "carousel-slide active"
                      : "carousel-slide"
                  }
                  key={index}
                >
                  {index === current && (
                    <img
                      src={`${url}/images/marketplace/material/${slide}`}
                      alt="Image Details"
                      className="carousel-image"
                    />
                  )}
                </div>
                <Buttons />
              </>
            );
          })}
        </section>
      )}
    </>
  );
};

export default Carousel;
