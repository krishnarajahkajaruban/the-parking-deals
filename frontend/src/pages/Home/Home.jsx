import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "./Home-responsive.css";
import Header from "../../components/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Preloader from "../../Preloader";
import SmoothScroll from "smooth-scroll";

import Tilt from "react-parallax-tilt";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { fetchAllAirports, getAvailableQuotes } from "../../utils/vendorUtil";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import Footer from "../../components/Footer";
import { getBookingChargesWithCouponCodeAndCorrespondingDiscount } from "../../utils/chargesAndCouponCode";
// import { SocketContext } from '../../context/SocketContext';
import ReactGA from "react-ga";

const Home = () => {
  // const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const reservationRef = useRef(null);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropOffDateStr, setDropOffDateStr] = useState("");
  const [pickupDateStr, setPickupDateStr] = useState("");
  const [dayDifference, setDayDifference] = useState(0);
  const [showError, setShowError] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const today = new Date();
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  const airports = useSelector((state) => state.vendor.airport);
  const couponCodeObj = useSelector(
    (state) => state.bookingChargeCouponCode.couponCode?.couponCode
  );

  // useEffect(() => {setCouponCode(couponCodeObj)},[couponCodeObj]);

  const times = [
    { time: "00:00" },
    { time: "00:30" },
    { time: "01:00" },
    { time: "01:30" },
    { time: "02:00" },
    { time: "02:30" },
    { time: "03:00" },
    { time: "03:30" },
    { time: "04:00" },
    { time: "04:30" },
    { time: "05:00" },
    { time: "05:30" },
    { time: "06:00" },
    { time: "06:30" },
    { time: "07:00" },
    { time: "07:30" },
    { time: "08:00" },
    { time: "08:30" },
    { time: "09:00" },
    { time: "09:30" },
    { time: "10:00" },
    { time: "10:30" },
    { time: "11:00" },
    { time: "11:30" },
    { time: "12:00" },
    { time: "12:30" },
    { time: "13:00" },
    { time: "13:30" },
    { time: "14:00" },
    { time: "14:30" },
    { time: "15:00" },
    { time: "15:30" },
    { time: "16:00" },
    { time: "16:30" },
    { time: "17:00" },
    { time: "17:30" },
    { time: "18:00" },
    { time: "18:30" },
    { time: "19:00" },
    { time: "19:30" },
    { time: "20:00" },
    { time: "20:30" },
    { time: "21:00" },
    { time: "21:30" },
    { time: "22:00" },
    { time: "22:30" },
    { time: "23:00" },
    { time: "23:30" },
  ];

  console.log(dropOffDate);
  console.log(pickupDate);

  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  const selectedTimeTemplate = (option, props) => {
    if (option) {
      const time = parseTime(option.time);
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return props.placeholder;
  };

  const timeTemplate = (option) => {
    const time = parseTime(option.time);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function normalizeDate(dateString) {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  useEffect(() => {
    const normalizedPickupDate = normalizeDate(pickupDate);
    const normalizedDropOffDate = normalizeDate(dropOffDate);

    const timeDifference = normalizedPickupDate - normalizedDropOffDate;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    console.log(dayDifference);

    setDayDifference(dayDifference);
  }, [dropOffDate, pickupDate]);

  useEffect(() => {
    fetchAllAirports(dispatch);
  }, [dispatch]);

  // useEffect(() => {
  //     socket.on('checkout.session.completed', (session) => {
  //       console.log('Checkout session completed');

  //     });

  //     socket.on('payment_intent.payment_failed', (paymentIntent) => {
  //       console.log('Payment intent failed');

  //     });

  //     return () => {
  //       socket.off('checkout.session.completed');
  //       socket.off('payment_intent.payment_failed');
  //     };
  //   }, [socket]);

  const selectedAirportTemplate = (option, props) => {
    if (option) {
      return (
        <div className="">
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const airportOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option.name}</div>
      </div>
    );
  };

  const handleGetQuote = async (e) => {
    e.preventDefault();
    setShowError(false);
    if (
      !selectedAirport ||
      !dropOffDate ||
      !dropOffTime ||
      !pickupDate ||
      !pickupTime
    ) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }

    const quoteInfo = {
      selectedAirport,
      dropOffDate,
      dropOffDateStr,
      dropOffTime: dropOffTime?.time,
      pickupDate,
      pickupDateStr,
      pickupTime: pickupTime?.time,
      couponCode,
      dayDifference,
    };
    navigate("/results", { state: { quoteInfo } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDropOffDateChange = (e) => {
    const newDropOffDate = e.value;
    setDropOffDate(newDropOffDate);
    setDropOffDateStr(newDropOffDate.toLocaleDateString("en-GB"));

    if (newDropOffDate) {
      const newPickupDate = new Date(newDropOffDate);
      newPickupDate.setDate(newPickupDate.getDate() + 7);
      setPickupDate(newPickupDate);
      setPickupDateStr(newPickupDate.toLocaleDateString("en-GB"));
    } else {
      setPickupDate(null);
      setPickupDate("");
    }
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const scroll = new SmoothScroll();
    scroll.animateScroll(reservationRef.current, null, { offset: 120 });
  };

  const goToLink = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);


  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []) 
  

  return (
    <>
      {/* {pageLoading && <Preloader />} */}
      <Preloader />
      <Header />

      <section className="hero-section overflow-hidden">
        <img
          src="assets/images/home/hero-section-image.svg"
          className="hero-section-img"
          data-aos="fade"
          alt=""
        />
        <img
          src="assets/images/home/map-pointer.svg"
          className="hero-section-dec-img"
          data-aos="fade-down"
          alt=""
        />
        <div className="container-md hero-slider-area">
          <Swiper
            className="hero-swiper-area"
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={false}
            speed={1500}
            navigation={{
              nextEl: ".swiper-button-next2",
              prevEl: ".swiper-button-prev2",
            }}
            grabCursor={true}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={{
              delay: 5000,
              waitForTransition: true,
              disableOnInteraction: false,
            }}
          >
            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Unmatched Airport Parking Solutions
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  Discover the easiest way to secure airport parking with The
                  Parking Deals. We specialize in providing top-notch parking
                  solutions tailored to meet your needs, ensuring your travel
                  experience starts off on the right foot. Book now and enjoy
                  unparalleled convenience and security.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/about-us")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Unmatched Airport Parking Solutions
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  Welcome to The Parking Deals, your premier choice for airport
                  parking. We provide a range of tailored services including
                  Valet Parking, Self-Park Options, and Long-Term Parking. Enjoy
                  peace of mind knowing your vehicle is secure, and experience
                  the convenience of our premium features designed to make your
                  travel stress-free.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/services")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Easy and Convenient Contact
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  Have questions or need assistance? We're here to help! Reach
                  out to us via email call us. Our dedicated customer service
                  team ensure you have a smooth and stress-free parking
                  experience. Visit our website for more information and
                  support.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/contact-us")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Convenience at Your Fingertips
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  At The Parking Deals, we prioritize your convenience. Our
                  user-friendly online booking system makes reserving your spot
                  quick and easy. With 24/7 access, covered parking options, and
                  complimentary shuttle services, we ensure that your parking
                  experience is seamless from start to finish.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/services")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Secure and Affordable Parking
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  Your vehicle's safety is our top priority. The Parking Deals
                  offers secure parking facilities with round-the-clock
                  surveillance at competitive rates. Whether you're traveling
                  for a day or an extended period, our short-term and long-term
                  parking solutions provide the security and affordability you
                  need.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/services")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="hero-section-title-area">
                <h3 className="hero-section-title" data-aos="fade-up">
                  Premium Parking for Business Travelers
                </h3>
                <p className="hero-section-para" data-aos="fade-up">
                  Business travel just got easier with The Parking Deals. Our
                  Business Parking service features dedicated spots close to the
                  terminal, priority shuttle services, and access to business
                  facilities. Maximize your productivity and minimize travel
                  stress with our premium parking solutions.
                </p>
                <div className="hero-section-btn-area" data-aos="fade-up">
                  <button
                    onClick={() => goToLink("/services")}
                    className="nav-link-button text-no-wrap with-bg"
                  >
                    More detail
                  </button>
                  <a
                    href="#reservation"
                    onClick={handleScroll}
                    className="nav-link-button text-no-wrap with-outline"
                  >
                    Make Reservation
                  </a>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      <Toast ref={toast} />

      <section className="section-padding overflow-hidden">
        <div className="container-md">
          <div className="row">
            <div className="col-12 col-xl-6 col-lg-6 pe-xl-5">
              <h3 className="section-heading text-center mx-auto text-lg-start ms-lg-0 text-purple">
                Get Your Parking Quote
              </h3>

              <p className="section-paragraph text-center text-lg-start mt-5 mb-5 mb-xl-0">
                Planning your trip just got easier with The Parking Deals. Use
                our quick and convenient form to get an instant quote for your
                airport parking needs. Simply select your airport from the
                dropdown menu, enter your drop-off and pick-up dates and times,
                and apply any available coupon codes to maximize your savings.
                Whether you need short-term, long-term, or premium parking
                options, our easy-to-use form will help you find the best rates
                and secure your spot in just a few clicks. Experience the
                convenience of knowing your parking is sorted before you even
                leave home. Fill out the form below and get ready for a
                stress-free start to your journey with The Parking Deals.
              </p>
            </div>
            <div className="col-12 col-xl-6 col-lg-6">
              <article
                className="custom-card border-top-primary p-3"
                id="reservation"
                ref={reservationRef}
                data-aos="fade-up"
              >
                <div className="custom-card-logo-area mb-3">
                  <h3 className="custom-card-header-head">GET QUOTE</h3>
                </div>
                <form
                  action=""
                  className="custom-card-form form-2 get-quote-form mt-0 p-3"
                  onSubmit={handleGetQuote}
                >
                  <div className="form-head-input-area">
                    <div className="row">
                      <div className="col-12 col-xl-8 col-lg-10 col-md-8 col-sm-8 mx-auto">
                        <div className="custom-form-group mb-0 input-with-icon">
                          <label
                            htmlFor="airport"
                            className="custom-form-label form-required text-sm-center"
                          >
                            Select airport
                          </label>
                          <div className="form-icon-group">
                            <i className="bi bi-airplane-fill input-grp-icon"></i>
                            <Dropdown
                              id="airport"
                              value={selectedAirport}
                              onChange={(e) => setSelectedAirport(e.value)}
                              options={
                                Array.isArray(airports)
                                  ? airports.map((airport) => ({
                                      ...airport,
                                      name: capitalizeFirstLetter(airport.name),
                                    }))
                                  : []
                              }
                              optionLabel="name"
                              placeholder="Select a Airport"
                              //   valueTemplate={selectedAirportTemplate}
                              //   itemTemplate={airportOptionTemplate}
                              className="w-full w-100 custom-form-dropdown"
                              invalid={showError}
                            />
                          </div>
                          {showError && !selectedAirport && (
                            <small className="text-danger form-error-msg text-sm-center">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <Divider className="mt-4 mb-4" />
                    </div>

                    <div className="col-12 col-sm-6 col-xl-6">
                      <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                        <label
                          htmlFor="dropOffDate"
                          className="custom-form-label form-required"
                        >
                          Drop off date
                        </label>
                        <div className="form-icon-group">
                          <i className="bi bi-calendar-check-fill input-grp-icon"></i>
                          <Calendar
                            id="dropOffDate"
                            value={dropOffDate}
                            onChange={handleDropOffDateChange}
                            placeholder="dd/mm/yyyy"
                            dateFormat="dd/mm/yy"
                            minDate={today}
                            className="w-100"
                            invalid={showError}
                          />
                        </div>
                        {showError && !dropOffDate && (
                          <small className="text-danger form-error-msg">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-6">
                      <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                        <label
                          htmlFor="dropOffTime"
                          className="custom-form-label form-required"
                        >
                          Drop off time
                        </label>
                        <div className="form-icon-group">
                          <i className="bi bi-clock-fill input-grp-icon"></i>
                          {/* <Calendar id="dropOffTime" className='w-100' value={dropOffTime} onChange={(e) => setDropOffTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} /> */}
                          <Dropdown
                            id="dropOffTime"
                            value={dropOffTime}
                            onChange={(e) => setDropOffTime(e.value)}
                            options={times}
                            optionLabel="time"
                            placeholder="Select the time"
                            valueTemplate={selectedTimeTemplate}
                            itemTemplate={timeTemplate}
                            className="w-full w-100 custom-form-dropdown"
                            invalid={showError}
                          />
                        </div>
                        {showError && !dropOffTime && (
                          <small className="text-danger form-error-msg">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-6">
                      <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                        <label
                          htmlFor="pickupDate"
                          className="custom-form-label form-required"
                        >
                          Pickup date
                        </label>
                        <div className="form-icon-group">
                          <i className="bi bi-calendar-check-fill input-grp-icon"></i>
                          <Calendar
                            id="pickupDate"
                            value={pickupDate}
                            onChange={(e) => {
                              setPickupDate(e.value);
                              setPickupDateStr(
                                e.value.toLocaleDateString("en-GB")
                              );
                            }}
                            placeholder="dd/mm/yyyy"
                            dateFormat="dd/mm/yy"
                            minDate={dropOffDate}
                            disabled={!dropOffDate}
                            className="w-100"
                            invalid={showError}
                          />
                        </div>
                        {showError && !pickupDate && (
                          <small className="text-danger form-error-msg">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-6">
                      <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                        <label
                          htmlFor="pickupTime"
                          className="custom-form-label form-required"
                        >
                          Pickup time
                        </label>
                        <div className="form-icon-group">
                          <i className="bi bi-clock-fill input-grp-icon"></i>
                          {/* <Calendar id="pickupTime" className='w-100' value={pickupTime} onChange={(e) => setPickupTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} /> */}
                          <Dropdown
                            id="pickupTime"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.value)}
                            options={times}
                            optionLabel="time"
                            placeholder="Select the time"
                            valueTemplate={selectedTimeTemplate}
                            itemTemplate={timeTemplate}
                            className="w-full w-100 custom-form-dropdown"
                            invalid={showError}
                          />
                        </div>
                        {showError && !pickupTime && (
                          <small className="text-danger form-error-msg">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-6 col-lg-7 col-md-6 mx-auto">
                      <div className="custom-form-group mb-2 mb-sm-2 input-with-icon">
                        <label
                          htmlFor="couponCode"
                          className="custom-form-label text-sm-center"
                        >
                          Coupon Code
                        </label>
                        <div className="form-icon-group">
                          <i className="bi bi-gift-fill input-grp-icon"></i>
                          <InputText
                            id="couponCode"
                            className="custom-form-input"
                            placeholder="Enter promo code"
                            invalid={showError}
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                        </div>
                        {/* {showError &&
                                                    <small className="text-danger form-error-msg text-sm-center">This field is required</small>
                                                } */}
                      </div>
                    </div>

                    <div className="col-12">
                      <Divider className="mb-4" />
                    </div>
                  </div>

                  <div className="custom-form-group contains-float-input mb-0">
                    <Button
                      label="GET QUOTE"
                      className="w-100 submit-button justify-content-center"
                      loading={loading}
                    />
                  </div>
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
