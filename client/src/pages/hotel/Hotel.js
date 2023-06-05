import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import MailList from "../../components/MailList/MailList";
import Footer from "../../components/Footer/Footer";
import useFetch from "../../hooks/useFetch";

import "./Hotel.css";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";
import Reserve from "../../components/Reserve/Reserve";

const Hotel = () => {
  const { user } = useContext(AuthContext);
  const { dates, options } = useContext(SearchContext);
  const navigate = useNavigate();

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
  }
  const days = dayDifference(dates[0].endDate, dates[0].startDate);
  const location = useLocation();

  const id = location.pathname.split("/")[2];
  const [openModal, setOpenModal] = useState(false);
  const [slideNum, setSlideNum] = useState(0);
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useFetch(`/hotels/find/${id}`);

  const handleOpen = (i) => {
    setSlideNum(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newNum;
    if (direction === "l") newNum = slideNum === 0 ? 5 : slideNum - 1;
    else newNum = slideNum === 5 ? 0 : slideNum + 1;

    setSlideNum(newNum);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />

      {loading ? (
        "Loading"
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />

              <div className="sliderWrapper">
                <img
                  src={data.photos[slideNum]}
                  alt=""
                  className="sliderImage"
                />
              </div>

              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookNow">Book now</button>
            <h1 className="hotelTitle">{data.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>

            <span className="hotelDistance">
              Excellent Location - {data.distance}m from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay for ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>

            <div className="hotelImages">
              {data.photos?.map((photo, index) => (
                <div
                  className="hotelImgWrapper"
                  onClick={() => handleOpen(index)}
                >
                  <img src={photo} alt="" className="hotelImg" />
                </div>
              ))}
            </div>

            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data.title}</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Perfect for a {days}-night stay!</h1>
                <span>
                  Located in the real heart of Krakow, this property has an
                  excellent location score of 9.8!
                </span>
                <h2>
                  <b>${days * data.cheapestPrice * options.room}</b>({days}{" "}
                  nights)
                </h2>
                <button onClick={handleClick}>Book Now!</button>
              </div>
            </div>
          </div>

          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;
