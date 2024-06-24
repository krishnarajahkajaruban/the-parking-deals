import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { Divider } from 'primereact/divider';

const TermsAndConditions = () => {
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Terms & Conditions</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Terms & Conditions</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Terms & Conditions Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Terms & Conditions</h3>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 mx-auto">
                            <div className="section-main-image-area mt-5" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/terms-privacy/terms-conditions-pink.svg" className="section-main-image animate-image" alt="Terms & Conditions" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 mb-4 mb-lg-5">
                            <div className="mt-4 mt-sm-4 mt-lg-5">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    Welcome to The Parking Deals! By using our website and services, you agree to comply with the following terms and conditions:
                                </p>
                            </div>
                        </div>

                        <div className="col-12">
                            <article className="content-card" data-aos="fade-up">
                                <p className="content-info">Last updated: June 18, 2024</p>

                                <div className="content-section">
                                    <h4>01. Booking Conditions</h4>

                                    <h5>1.1 Confirmation and Receipt:</h5>
                                    <p>
                                        Upon completing your booking, a confirmation voucher will be sent to the email address you provided. If you do not receive this voucher, please contact our support team immediately. Refunds are not available for no-shows or cancellations made less than 48 hours before your scheduled service.
                                    </p>

                                    <h5>1.2 Agency Role:</h5>
                                    <p>
                                        Our company acts as an agent for various service providers, including car parks. Your agreement will be directly with the individual service provider, and you will be bound by their specific terms and conditions, which include limitations and exclusions of liability. Full details are available upon request from the respective service provider.
                                    </p>

                                    <h5>1.3 Liability for Vehicle:</h5>
                                    <p>
                                        Service providers will accept liability for any proven negligence on their part. We advise you to inspect your vehicle upon collection thoroughly, as claims cannot be considered once the vehicle leaves the premises.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>02. Complaints Procedure</h4>

                                    <h5>2.1 Submitting Complaints:</h5>
                                    <p>
                                        Please submit any grievances in writing with as much detail as possible.
                                    </p>

                                    <h5>2.2 Response Time:</h5>
                                    <p>
                                        We aim to respond to all complaints within 7 business days.
                                    </p>

                                    <h5>2.3 Handling Delays:</h5>
                                    <p>
                                        If there is a delay in responding to your complaint, we will inform you of the reason and expected response time.
                                    </p>

                                    <h5>2.4 Vehicle Safety:</h5>
                                    <p>
                                        Our company is not responsible for the safety of vehicles or items left within while under the care of a service provider. Customers should use their insurance for claims concerning damages or losses.
                                    </p>

                                    <h5>2.5 Vehicle Conditions:</h5>
                                    <p>
                                        Service providers are not liable for mechanical, structural, or electrical failures of your vehicle. Ensure your vehicle is roadworthy and meets all legal requirements.
                                    </p>

                                    <h5>2.6 Key Handling:</h5>
                                    <p>
                                        Ensure that the correct keys and instructions are provided to the service operator. The service providers are not liable for issues arising from incorrect keys or instructions provided.
                                    </p>

                                    <h5>2.7 Immediate Reporting:</h5>
                                    <p>
                                        Any damages identified at the time of vehicle return should be reported to the service operator before leaving the site to be eligible for potential claims.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>03. Cancellation Policy</h4>

                                    <h5>3.1 Cancellation Process:</h5>
                                    <p>
                                        Cancellations must be made directly through our platform to be considered valid.
                                    </p>

                                    <h5>3.2 Cancellation Notice:</h5>
                                    <p>
                                        Full refunds are provided for cancellations made more than 48 hours before the scheduled service. Cancellations made within 48 hours of the service date will not be eligible for a refund.
                                    </p>

                                    <h5>3.3 Non-refundable Fees:</h5>
                                    <p>
                                        Booking fees, SMS charges, and special promotional offers are non-refundable.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section mb-0">
                                    <h4>04. Limitation of Liability</h4>

                                    <h5>4.1 Booking Liability:</h5>
                                    <p className="mb-0">
                                        Our company, acting solely as a booking agent, is liable only for direct damages caused by our negligence in processing bookings. Our total liability is limited to the cost of your booking, including any fees paid.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/* Terms & Conditions Section End */}

            <Footer />
        </>
    )
}
export default TermsAndConditions;