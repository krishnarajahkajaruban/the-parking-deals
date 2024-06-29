import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import './Home-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [dropOffDate, setDropOffDate] = useState(null);
    const [pickupDate, setPickupDate] = useState(null);
    const [showError, setShowError] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState(null);
    const today = new Date();
    const [dropOffTime, setDropOffTime] = useState(null);
    const [pickupTime, setPickupTime] = useState(null);

    const airports = [
        { name: 'Birmingham Airport' },
        { name: 'Bristol Airport' },
        { name: 'Gatwick Airport' },
        { name: 'Heathrow Airport' },
        { name: 'Liverpool Airport' },
        { name: 'Luton Airport' },
        { name: 'Stansted Airport' },
        { name: 'Manchester Airport' },
        { name: 'Southend Airport' }
    ];

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

    const getQuote = () => {
        setLoading(true);
        setShowError(true);

        setTimeout(() => {
            setLoading(false);
            setShowError(false);

            window.location.assign('/results');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }
    return (
        <>
            <Header />

            <section className='hero-section overflow-hidden'>
                <img src="assets/images/home/hero-section-image.svg" className='hero-section-img' data-aos="fade" alt="" />
                <img src="assets/images/home/map-pointer.svg" className='hero-section-dec-img' data-aos="fade-down" alt="" />
                <div className="container-md hero-slider-area">
                    <Swiper
                        className='hero-swiper-area'
                        modules={[Navigation, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={false}
                        speed={1500}
                        navigation={{
                            nextEl: '.swiper-button-next2',
                            prevEl: '.swiper-button-prev2',
                        }}
                        grabCursor={true}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                        autoplay={{
                            delay: 5000,
                            waitForTransition: true,
                            disableOnInteraction: false,
                        }}

                    >
                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Unmatched Airport Parking Solutions</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    Discover the easiest way to secure airport parking with The Parking Deals. We specialize in providing top-notch parking solutions tailored to meet your needs, ensuring your travel experience starts off on the right foot. Book now and enjoy unparalleled convenience and security.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/about-us" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Unmatched Airport Parking Solutions</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    Welcome to The Parking Deals, your premier choice for airport parking. We provide a range of tailored services including Valet Parking, Self-Park Options, and Long-Term Parking. Enjoy peace of mind knowing your vehicle is secure, and experience the convenience of our premium features designed to make your travel stress-free.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/services" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Easy and Convenient Contact</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    Have questions or need assistance? We're here to help! Reach out to us via email call us. Our dedicated customer service team is available 24hours of operation to ensure you have a smooth and stress-free parking experience. Visit our website for more information and support.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/contact-us" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Convenience at Your Fingertips</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    At The Parking Deals, we prioritize your convenience. Our user-friendly online booking system makes reserving your spot quick and easy. With 24/7 access, covered parking options, and complimentary shuttle services, we ensure that your parking experience is seamless from start to finish.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/services" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Secure and Affordable Parking</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    Your vehicle's safety is our top priority. The Parking Deals offers secure parking facilities with round-the-clock surveillance at competitive rates. Whether you're traveling for a day or an extended period, our short-term and long-term parking solutions provide the security and affordability you need.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/services" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className="hero-section-title-area">
                                <h3 className='hero-section-title' data-aos="fade-up">Premium Parking for Business Travelers</h3>
                                <p className='hero-section-para' data-aos="fade-up">
                                    Business travel just got easier with The Parking Deals. Our Business Parking service features dedicated spots close to the terminal, priority shuttle services, and access to business facilities. Maximize your productivity and minimize travel stress with our premium parking solutions.
                                </p>
                                <div className="hero-section-btn-area" data-aos="fade-up">
                                    <a href="/services" className='nav-link-button text-no-wrap with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button text-no-wrap with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section >

            <section className='section-padding overflow-hidden'>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-6">
                        </div>
                        <div className="col-12 col-xl-6">
                            <article className="custom-card border-top-primary p-3" id='reservation' data-aos="fade-up">
                                <div className="custom-card-logo-area mb-3">
                                    <h3 className="custom-card-header-head">GET QUOTE</h3>
                                </div>
                                <form action="" className="custom-card-form form-2 get-quote-form mt-0">
                                    <div className="row">
                                        <div className="col-12 col-xl-8 col-lg-6 col-md-8 col-sm-8 mx-auto">
                                            <div className="custom-form-group mb-0 input-with-icon">
                                                <label htmlFor="airport" className="custom-form-label form-required text-sm-center">Select airport</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-airplane-fill input-grp-icon"></i>
                                                    <Dropdown id='airport' value={selectedAirport} onChange={(e) => setSelectedAirport(e.value)} options={airports} optionLabel="name" placeholder="Select a Airport"
                                                        filter valueTemplate={selectedAirportTemplate} itemTemplate={airportOptionTemplate} className="w-full w-100 custom-form-dropdown" invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg text-sm-center">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Divider className='mt-4 mb-4' />
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                                <label htmlFor="dropOffDate" className="custom-form-label form-required">Drop off date</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                                                    <Calendar id="dropOffDate" value={dropOffDate} onChange={(e) => setDropOffDate(e.value)} placeholder='dd/mm/yyyy' minDate={today} className='w-100' invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                                <label htmlFor="dropOffTime" className="custom-form-label form-required">Drop off time</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-clock-fill input-grp-icon"></i>
                                                    <Calendar id="dropOffTime" className='w-100' value={dropOffTime} onChange={(e) => setDropOffTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                                <label htmlFor="pickupDate" className="custom-form-label form-required">Pickup date</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                                                    <Calendar id="pickupDate" value={pickupDate} onChange={(e) => setPickupDate(e.value)} placeholder='dd/mm/yyyy' minDate={dropOffDate} disabled={!dropOffDate} className='w-100' invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                                <label htmlFor="pickupTime" className="custom-form-label form-required">Pickup time</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-clock-fill input-grp-icon"></i>
                                                    <Calendar id="pickupTime" className='w-100' value={pickupTime} onChange={(e) => setPickupTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6 col-lg-4 col-md-6 mx-auto">
                                            <div className="custom-form-group mb-2 mb-sm-2 input-with-icon">
                                                <label htmlFor="couponCode" className="custom-form-label form-required text-sm-center">Coupon Code</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-gift-fill input-grp-icon"></i>
                                                    <InputText id="couponCode" className="custom-form-input" placeholder='Enter promo code' invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg text-sm-center">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Divider className='mb-4' />
                                        </div>
                                    </div>

                                    <div className="custom-form-group contains-float-input mb-0">
                                        <Button label="GET QUOTE" className="w-100 submit-button justify-content-center" loading={loading} onClick={getQuote} />
                                    </div>
                                </form>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Home;