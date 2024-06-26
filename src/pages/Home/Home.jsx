import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import './Home-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
    return (
        <>
            <Header />

            <section className='hero-section overflow-hidden'>
                <img src="assets/images/home/hero-section-image.svg" className='hero-section-img' data-aos="fade" alt="" />
                <img src="assets/images/home/map-pointer.svg" className='hero-section-dec-img' data-aos="fade-down" alt="" />
                <div className="container-md h-100 d-flex align-items-center hero-slider-area">
                    <Swiper
                        className='w-50'
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
                                    <a href="/about-us" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
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
                                    <a href="/services" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
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
                                    <a href="/contact-us" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
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
                                    <a href="/services" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
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
                                    <a href="/services" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
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
                                    <a href="/services" className='nav-link-button with-bg'>More detail</a>
                                    <a href="#reservation" className='nav-link-button with-outline'>Make Reservation</a>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section >

            <section className='section-padding overflow-hidden'>
                <div className="container-md">

                </div>
            </section>

            <Footer />
        </>
    )
}

export default Home;