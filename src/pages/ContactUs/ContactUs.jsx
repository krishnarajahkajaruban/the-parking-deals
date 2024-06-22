import React, { useState, useRef } from "react";
import './ContactUs.css';
import './ContactUs-responsive.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const ContactUs = () => {
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const sendMessage = () => {
        setLoading(true);
        setShowError(true);

        setTimeout(() => {
            setLoading(false);
            setShowError(false);
            toast.current.show({severity:'success', summary: 'Success', detail:'Message sent successfully', life: 3000});
        }, 2000);
    }
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Contact us</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Contact us</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Contact us Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Contact Us</h3>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 mx-auto">
                            <div className="section-main-image-area mt-5" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/contact/contact-us-pink.svg" className="section-main-image animate-image" alt="Contact Us" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 mb-4 mb-lg-5">
                            <div className="mt-5">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    At The Parking Deals, we are dedicated to providing exceptional customer service. If you have any questions, need assistance with your reservation, or have any feedback, our customer service team is here to help. You can reach us by email at <a href="mailto:">info@theparkingdeals.uk</a> or by phone at <a href="tel:">+44 000 000 0000</a>. Our team is available 24 hours of operation to ensure your experience with us is seamless and satisfactory. For additional support, you can also visit our website at <a href="https://theparkingdeals.co.uk/" rel="noreferrer" target="_blank">theparkingdeals.co.uk</a>, where you'll find helpful resources and information. We look forward to assisting you and ensuring a smooth and convenient parking experience.
                                </p>
                            </div>
                        </div>

                        <div className="col-12">
                            <article className="contact-card">
                                <div className="row">
                                    <div className="col-12 col-xl-5">
                                        <div className="contact-detail-section">
                                            <h4 className="contact-card-head">
                                                Reach us
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="col-12 col-xl-7">
                                        <div className="contact-form-section">
                                            <h4 className="contact-card-head">
                                                Get in touch with us
                                            </h4>

                                            <form action="" className="contact-form-area">
                                                <Toast ref={toast} />
                                                <div className="row">
                                                    <div className="col-12 col-sm-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="name" className="custom-form-label form-required">Name</label>
                                                            <InputText id="name" className="custom-form-input" placeholder="Enter your name" />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="email" className="custom-form-label form-required">Email</label>
                                                            <InputText id="email" className="custom-form-input" keyfilter="email" placeholder="Enter your email address" />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="phoneNumber" className="custom-form-label form-required">Phone number</label>
                                                            <InputText id="phoneNumber" className="custom-form-input" keyfilter="num" placeholder="Enter your phone number" />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="subject" className="custom-form-label form-required">Subject</label>
                                                            <InputText id="subject" className="custom-form-input" placeholder="Enter the subject" />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="message" className="custom-form-label form-required">Message</label>
                                                            <InputTextarea id="message" className="custom-form-input" rows={5} cols={30} placeholder="Enter your message" />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg mt-0">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <div className="">
                                                            <Button label="SEND" className="submit-button theme-pink ps-5 pe-5" loading={loading} onClick={sendMessage} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/* Contact us Section End */}

            <Footer />
        </>
    )
}

export default ContactUs;