import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'bootstrap';
import { useForm } from 'react-hook-form';
import api from '../api';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Navigate, useNavigate } from 'react-router-dom';
import Preloader from "../Preloader";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

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

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const submit = async (data) => {
        // Handle form submission
        setLoading(true);
        console.log(data);

        try {
            const response = await api.post("/api/user/submit-subscribed-user", data);
            console.log(response.data);
            toast.current.show({
                severity: 'success',
                summary: 'Thanks for subscribing',
                detail: 'You will be notified!',
                life: 3000
            });
            reset();
        } catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'Failed!',
                detail: 'Failed to subscribe!',
                life: 3000
            });
        } finally {
            setLoading(false);

        };

    };

    const goToLink = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Preloader />
            <button className={`back-to-top-btn ${showBackToTop ? 'show' : ''}`} id='back_to_top'
                onClick={handleBackToTop}>
                <svg className="svgIcon" viewBox="0 0 384 512">
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
                                <button onClick={() => goToLink('/')} className='footer-logo-link'>
                                    <img src="../assets/images/logo-light.png" className='footer-logo' alt="The Parking Deals" />
                                </button>
                                <p className='footer-desc'>
                                    Air Travel Extras Limited trades under the name The Parking Deals. We specialize in providing exceptional airport parking solutions to meet the diverse needs of travelers.
                                </p>
                            </div>

                            <div className="col-12 col-xxl-8 col-xl-8 mt-5 mt-xl-0">
                                <div className="row pe-lg-0 ps-lg-0 ps-sm-3 pe-sm-3">
                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                        <h6 className='footer-link-head'>Company</h6>
                                        <ul className='footer-link-area'>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/about-us')} className='footer-link'>About Us</button>
                                            </li>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/contact-us')} className='footer-link'>Contact Us</button>
                                            </li>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/services')} className='footer-link'>Services</button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 mt-4 mt-sm-0">
                                        <h6 className='footer-link-head'>Quick Links</h6>
                                        <ul className='footer-link-area'>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/terms-and-conditions')} className='footer-link'>Terms & Conditions</button>
                                            </li>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/privacy-policy')} className='footer-link'>Privacy Policy</button>
                                            </li>
                                            <li className='footer-link-item'>
                                                <button onClick={() => goToLink('/faq')} className='footer-link'>FAQ</button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-12 col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-4 mt-lg-0">
                                        <h6 className='footer-link-head text-sm-center text-lg-start'>Contact</h6>
                                        <ul className='footer-link-area contact-detail'>
                                            <li className='footer-link-item'>
                                                <a href="tel:07399440027" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i className="bi bi-telephone-fill"></i>
                                                    </div>
                                                    <span>07399440027</span>
                                                </a>
                                            </li>
                                            <li className='footer-link-item'>
                                                <a href="mailto:info@theparkingdeals.co.uk" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </div>
                                                    <span>info@theparkingdeals.co.uk</span>
                                                </a>
                                            </li>
                                            {/* <li className='footer-link-item'>
                                                <a href="mailto:" target='_blank' rel="noreferrer" className='footer-link with-icon'>
                                                    <div className="link-icon-area">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <span>info@theparkingdeals.co.uk</span>
                                                </a>
                                            </li> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Toast ref={toast} />
                        <div className="row mt-4">
                            <div className="col-12 col-xl-8 col-lg-8 col-md-10 col-sm-9 mx-auto">
                                <h6 className='footer-link-head text-center mb-4'>Subscribe our newsletter</h6>

                                <div className="subscribe-input-area">
                                    <form action=""
                                        onSubmit={handleSubmit(submit)}
                                    >
                                        <input type="email" className='subscribe-input' placeholder='Enter your email address...'
                                            id="email"
                                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                                        />
                                        <Button type='submit' className='subscribe-btn'
                                            loading={loading}
                                            label='Subscribe'
                                        />
                                    </form>
                                </div>
                                {errors.email &&
                                    <small className="text-danger text-center form-error-msg">{errors.email.message}</small>
                                }
                            </div>
                        </div>

                        <div className="row mt-4 mt-sm-5">
                            <div className="col-12">
                                <h6 className='footer-link-head text-center mb-4'>Follow us :</h6>
                                <div className="footer-social-container">
                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Facebook">
                                        <i className="ri-facebook-fill"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Twitter">
                                        <i className="ri-twitter-x-line"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Instagram">
                                        <i className="ri-instagram-line"></i>
                                    </a>

                                    <a href="" className='footer-social-link' data-bs-toggle="tooltip" data-bs-placement="top" title="Linkedin">
                                        <i className="ri-linkedin-fill"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sub-footer">
                    <p>© <span className='currentYear'>{currentYear}</span>, Air Travel Extras Limited. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default Footer;