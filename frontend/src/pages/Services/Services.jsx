import React from "react";
import './Services.css';
import './Services-responsive.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Preloader from "../../Preloader";

import Tilt from 'react-parallax-tilt';

const Services = () => {
    return (
        <>
            <Preloader />
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Services</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Services</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Services Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Services</h3>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 mx-auto">
                            <div className="section-main-image-area mt-5" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/services/services1-pink.svg" className="section-main-image animate-image" alt="Services" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 mb-4 mb-lg-5">
                            <div className="mt-4 mt-sm-4 mt-lg-5">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    At The Parking Deals, we cater to a diverse clientele, including business professionals, families, and solo travelers, with a variety of parking services tailored to meet different needs. Our offerings include Valet Parking for a hassle-free experience, Self-Park Options for those who prefer to park their own vehicle, and Long-Term Parking for extended trips. Each service is designed to maximize your convenience and security, ensuring a smooth and worry-free parking experience.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='row content-card-row mt-5'>
                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/valet-parking.jpg" className="service-card-img" alt="Valet Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Valet Parking</h4>
                                        <p className="service-card-desc">
                                            Experience the ultimate convenience with our Valet Parking service. Simply drive up to the terminal, and our professional valet attendants will take care of the rest. We'll park your vehicle in a secure location, allowing you to proceed directly to your check-in without the hassle of finding a parking spot. This service is perfect for those in a hurry or anyone looking for a stress-free start to their journey. Upon your return, your vehicle will be waiting for you at the terminal, ensuring a smooth and quick exit.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/self-parking.jpg" className="service-card-img" alt="Self-Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Self-Parking</h4>
                                        <p className="service-card-desc">
                                            For travelers who prefer to maintain control over their parking experience, our Self-Park Options are an ideal choice. We offer a variety of parking lots located conveniently close to the airport. You can park your vehicle yourself, keep your keys, and have the peace of mind that your car is secure. Our self-park facilities are equipped with 24/7 surveillance and easy shuttle services to and from the airport terminals, ensuring a seamless transition from your car to your flight.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/long-term-parking.jpg" className="service-card-img" alt="Long-Term Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Long-Term Parking</h4>
                                        <p className="service-card-desc">
                                            If you're planning to be away for an extended period, our Long-Term Parking service provides a cost-effective solution for leaving your vehicle in a secure environment. Our long-term lots are monitored around the clock to ensure the safety of your car while you're away. We offer competitive rates to help you save money on parking fees without compromising on security. This service is ideal for vacations, business trips, or any extended stay, giving you one less thing to worry about while you're away.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/short-term-parking.jpg" className="service-card-img" alt="Short-Term Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Short-Term Parking</h4>
                                        <p className="service-card-desc">
                                            For those needing parking for a few hours or a day, our Short-Term Parking service is the perfect solution. Located close to the airport terminals, our short-term parking options are convenient and easy to access. Whether you’re picking up a loved one or attending a meeting, our short-term parking ensures your vehicle is nearby, safe, and easily accessible.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/covered-parking.jpg" className="service-card-img" alt="Covered Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Covered Parking</h4>
                                        <p className="service-card-desc">
                                            Protect your vehicle from the elements with our Covered Parking service. Ideal for long-term and short-term stays, our covered parking facilities shield your car from weather damage, such as sun exposure, rain, and snow. Enjoy peace of mind knowing your vehicle is well-protected while you travel.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/ev-charging.jpg" className="service-card-img" alt="Electric Vehicle (EV) Charging Stations" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Electric Vehicle (EV) Charging Stations</h4>
                                        <p className="service-card-desc">
                                            For eco-conscious travelers, we offer parking spots equipped with Electric Vehicle (EV) Charging Stations. Charge your electric vehicle while you’re away, ensuring it’s ready to go when you return. Our EV charging stations are conveniently located and easy to use, providing a seamless experience for electric vehicle owners.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/premium-parking.jpg" className="service-card-img" alt="Premium Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Premium Parking</h4>
                                        <p className="service-card-desc">
                                            Enjoy the best of the best with our Premium Parking service. Located in the most convenient areas close to the terminals, our premium parking spots offer extra-wide spaces, enhanced security, and expedited shuttle service. This service is perfect for those looking to maximize convenience and minimize time spent in transit.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/business-parking.jpg" className="service-card-img" alt="Business Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Business Parking</h4>
                                        <p className="service-card-desc">
                                            Designed specifically for business travelers, our Business Parking service offers dedicated spaces close to the terminals, priority shuttle service, and access to business facilities such as Wi-Fi and meeting rooms. Ensure your travel experience is efficient and productive with our specialized business parking solutions.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>

                        <div className="col-12 col-xl-4 col-lg-6 col-md-8 col-sm-8 mx-auto" data-aos="fade-up">
                            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className='h-100'>
                                <article className="service-card">
                                    <div className="service-card-img-area">
                                        <img src="assets/images/services/family-parking.jpg" className="service-card-img" alt="Family Parking" />
                                    </div>
                                    <div className="service-card-body">
                                        <h4 className="service-card-head">Family Parking</h4>
                                        <p className="service-card-desc">
                                            Our Family Parking service caters to travelers with children, offering larger parking spots for easier loading and unloading, proximity to terminal entrances, and priority shuttle service with child-friendly amenities. Start your family trip smoothly and conveniently with our tailored parking solutions.
                                        </p>
                                    </div>
                                </article>
                            </Tilt>
                        </div>
                    </div>
                </div>
            </section>
            {/* Services Section End */}

            <Footer />
        </>
    )
}

export default Services;