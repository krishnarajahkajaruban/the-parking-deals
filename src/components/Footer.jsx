import React, { useEffect, useState } from 'react';
import { Tooltip } from 'bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleShow = () => {
            const isShow = window.scrollY > 100;
            setShowBackToTop(isShow);
        };

        window.addEventListener('scroll', handleShow);

        return () => {
            window.removeEventListener('scroll', handleShow);
        };
    }, []);

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    }, []);

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <button class={`back-to-top-btn ${showBackToTop ? 'show' : ''}`} id='back_to_top'
                onClick={handleBackToTop}>
                <svg class="svgIcon" viewBox="0 0 384 512">
                    <path
                        d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
                    ></path>
                </svg>
            </button>

            <footer className='footer-section overflow-hidden'>
                <div className="footer-sub-section">
                    <div className="container-md">
                        <div className="row">
                            <div className="col-12 col-xxl-4 col-xl-4 text-center text-xl-start">
                                <a href='/' className='footer-logo-link'>
                                    <img src="../assets/images/logo-light.png" className='footer-logo' alt="The Parking Deals" />
                                </a>
                                <p className='footer-desc'>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis veritatis officia necessitatibus dolorum voluptate, tenetur modi nemo eaque eius. Tempora minus ea eum illo expedita a dolorem ratione voluptatibus qui facere, assumenda ducimus laboriosam excepturi, dignissimos pariatur, veniam quisquam velit.
                                </p>
                            </div>

                            <div className="col-12 col-xxl-8 col-xl-8 mt-5 mt-xl-0">
                                <div className="row pe-lg-0 ps-lg-0 ps-sm-3 pe-sm-3">
                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                        <h6 className='footer-link-head'>Company</h6>
                                        <ul className='footer-link-area'>
                                            <li className='footer-link-item'>
                                                <a href="/about-us" className='footer-link'>About Us</a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="/about-us" className='footer-link'>Contact Us</a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="/services" className='footer-link'>Services</a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 mt-4 mt-sm-0">
                                        <h6 className='footer-link-head'>Quick Links</h6>
                                        <ul className='footer-link-area'>
                                            <li className='footer-link-item'>
                                                <a href="/terms-and-conditions" className='footer-link'>Terms & Conditions</a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="/privacy-policy" className='footer-link'>Privacy Policy</a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="/faq" className='footer-link'>FaQ</a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-4 mt-lg-0">
                                        <h6 className='footer-link-head text-sm-center text-lg-start'>Contact</h6>
                                        <ul className='footer-link-area contact-detail'>
                                            <li className='footer-link-item'>
                                                <a href="tel:" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i class="bi bi-telephone-fill"></i>
                                                    </div>
                                                    <span>+94 00 000 0000</span>
                                                </a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="mailto:" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i class="bi bi-envelope-fill"></i>
                                                    </div>
                                                    <span>info@theparkingdeals.co.uk</span>
                                                </a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="" target='_blank' rel="noreferrer" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i class="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <span>info@theparkingdeals.co.uk</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12 col-xl-8 col-lg-8 col-md-10 col-sm-9 mx-auto">
                                <h6 className='footer-link-head text-center mb-4'>Subscribe our newsletter</h6>

                                <div className="subscribe-input-area">
                                    <form action="">
                                        <input type="email" className='subscribe-input' placeholder='Enter your email address...' />
                                        <button type='submit' className='subscribe-btn'>Subscribe</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4 mt-sm-5">
                            <div className="col-12">
                                <h6 className='footer-link-head text-center mb-4'>Follow us :</h6>
                                <div className="footer-social-container">
                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Facebook">
                                        <i class="ri-facebook-fill"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Twitter">
                                        <i class="ri-twitter-x-line"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Instagram">
                                        <i class="ri-instagram-line"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin">
                                        <i class="ri-linkedin-fill"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sub-footer">
                    <p>© <span className='currentYear'>{currentYear}</span>, The Parking Deals. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer;