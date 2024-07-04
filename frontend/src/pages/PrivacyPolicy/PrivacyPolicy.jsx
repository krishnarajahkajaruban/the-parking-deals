import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { Divider } from 'primereact/divider';

const PrivacyPolicy = () => {
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Privacy Policy</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Privacy Policy</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Privacy policy Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Privacy Policy</h3>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 mx-auto">
                            <div className="section-main-image-area mt-5" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/terms-privacy/privacy-policy-pink.svg" className="section-main-image animate-image" alt="Privacy Policy" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 mb-4 mb-lg-5">
                            <div className="mt-4 mt-sm-4 mt-lg-5">
                                <p className='section-paragraph text-center' data-aos="fade">
                                    At The Parking Deals, we are committed to protecting your privacy and ensuring the security of your personal information. We collect and store data that is necessary to provide you with our services, such as processing bookings and improving our website's functionality. This may include information such as your name, contact details, payment information, and booking history.
                                </p>

                                <p className='section-paragraph text-center' data-aos="fade">
                                    We use industry-standard security measures to safeguard your data against unauthorized access, disclosure, or alteration. Your information is only shared with trusted third-party service providers who assist us in delivering our services, and they are bound by confidentiality agreements to protect your information.
                                </p>

                                <p className='section-paragraph text-center' data-aos="fade">
                                    We may also use your information to send you important updates about your bookings, promotions, and marketing communications that we believe may be of interest to you. However, you have the right to opt-out of receiving such communications at any time.
                                </p>

                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy. If you have any questions or concerns about our privacy practices, please contact us.
                                </p>
                            </div>
                        </div>

                        <div className="col-12">
                            <article className="content-card" data-aos="fade-up">
                                <p className="content-info">Last updated: June 18, 2024</p>

                                <div className="content-section">
                                    <h4>01. Introduction</h4>
                                    <p>
                                        Welcome to The Parking Deals. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our website and services.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>02. Information We Collect</h4>
                                    <p>
                                        We may collect the following types of information:
                                    </p>

                                    <ul>
                                        <li>
                                            <b>Personal Information:</b> Name, email address, phone number, and payment information when you make a reservation.
                                        </li>

                                        <li>
                                            <b>Non-Personal Information:</b> Browser type, IP address, and usage data when you visit our website.
                                        </li>
                                    </ul>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>03. How We Use Your Information</h4>
                                    <p>
                                        We use the information we collect to:
                                    </p>

                                    <ul>
                                        <li>Provide and manage your reservations and parking services.</li>

                                        <li>Process payments and send confirmation emails.</li>

                                        <li>Improve our website and services based on user feedback.</li>

                                        <li>Communicate with you about updates, promotions, and special offers.</li>

                                        <li>Comply with legal obligations and resolve disputes.</li>
                                    </ul>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>04. Information Sharing and Disclosure</h4>
                                    <p>
                                        We do not sell or rent your personal information to third parties. We may share your information with:
                                    </p>

                                    <ul>
                                        <li>
                                            <b>Service Providers:</b> Third parties that assist us in providing services, such as payment processors and customer support.
                                        </li>

                                        <li>
                                            <b>Legal Requirements:</b> If required by law, to protect our rights, or to comply with a judicial proceeding, court order, or legal process.
                                        </li>
                                    </ul>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>05. Data Security</h4>
                                    <p>
                                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>06. Cookies and Tracking Technologies</h4>
                                    <p>
                                        We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us understand how you use our site and improve its functionality.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>07. Your Rights</h4>
                                    <p>
                                        You have the right to:
                                    </p>

                                    <ul>
                                        <li>Access and update your personal information.</li>
                                        <li>Request the deletion of your personal data.</li>
                                        <li>Object to the processing of your information for marketing purposes.</li>
                                        <li>Withdraw your consent at any time, where processing is based on consent.</li>
                                    </ul>

                                    <p>To exercise these rights, please contact us at [contact email/phone number].</p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>08. Third-Party Links</h4>
                                    <p>
                                        Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these sites. We encourage you to read the privacy policies of any linked websites.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>09. Children's Privacy</h4>
                                    <p>
                                        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently received personal information from a child, we will delete such information from our records.
                                    </p>
                                </div>

                                <Divider />

                                <div className="content-section">
                                    <h4>10. Changes to This Privacy Policy</h4>
                                    <p>
                                        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we are protecting your information.
                                    </p>
                                </div>

                                <div className="content-section has-bg mb-0">
                                    <h4>11. Contact Us</h4>

                                    <p>
                                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                                    </p>

                                    <Divider />

                                    <h6 className="content-contact-head mt-4">The Parking Deals</h6>
                                    <div className="content-contact-detail">
                                        <i className="bi bi-geo-alt-fill"></i>
                                        <a href="#">
                                            9-13 Wensum St, Burnham-on-Sea <br />
                                            Somerset County <br />
                                            TA8 1AL
                                        </a>
                                    </div>

                                    <div className="content-contact-detail">
                                        <i className="bi bi-envelope-fill"></i>
                                        <a href="mailto:">info@theparkingdeals.uk</a>
                                    </div>

                                    <div className="content-contact-detail">
                                        <i className="bi bi-telephone-fill"></i>
                                        <a href="tel:">+44 000 000 0000</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/* Privacy policy Section End */}

            <Footer />
        </>
    )
}
export default PrivacyPolicy;