import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { Accordion, AccordionTab } from 'primereact/accordion';
import Preloader from "../../Preloader";

const FaQ = () => {
    return (
        <>
            <Preloader />
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>FaQ</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">FaQ</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* FaQ Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Frequently Asked Questions (FAQs)</h3>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 mx-auto">
                            <div className="section-main-image-area mt-5" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/faq/faq-pink.svg" className="section-main-image animate-image" alt="FaQ" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 mb-4 mb-lg-5">
                            <div className="mt-4 mt-sm-4 mt-lg-5">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    At The Parking Deals, we strive to address all your questions and concerns. Here are some frequently asked questions to help you navigate our services. You can easily make a reservation through our website, and we accept all major credit cards for payment. If you need to cancel or modify your reservation, our Cancellation and Refund Policy provides detailed instructions. We partner with secure parking facilities, but we recommend removing valuables from your vehicle. Complimentary shuttle service to and from the airport is typically available, and you will receive detailed instructions in your confirmation email. If your flight is delayed or you need to extend your stay, contact the parking facility directly. For any other questions or assistance, our customer service team is ready to help via email or phone. Don’t forget to sign up for our newsletter or follow us on social media for the latest discounts and promotions.
                                </p>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="content-collapse-section" data-aos="fade-up">
                                <Accordion activeIndex={0}>
                                    <AccordionTab header="01. What services does The Parking Deals offer?">
                                        <p className="m-0">
                                            The Parking Deals specializes in providing exceptional airport parking solutions. We evaluate available parking options to ensure you receive top-notch service at competitive rates. Our services include secure and reliable parking near major airports, with options for short-term and long-term stays.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="02. How do I make a reservation?">
                                        <p className="m-0">
                                            To make a reservation, simply visit our website at www.theparkingdeals.com, enter your travel details, choose your preferred parking option, and complete the booking process. You will receive a confirmation email with your reservation details.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="03. What payment methods do you accept?">
                                        <p className="m-0">
                                            We accept all major credit cards, including Visa, MasterCard, American Express, and Discover. Payments are processed securely at the time of reservation.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="04. Can I cancel or modify my reservation?">
                                        <p className="m-0">
                                            Yes, you can cancel or modify your reservation. Please refer to our Cancellation and Refund Policy on our website for specific details regarding time frames and potential fees. To cancel or modify your reservation, contact our customer service team at <a href="mailto:">info@theparkingdeals.uk</a>, <a href="tel:">07399440027</a>.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="05. Is my vehicle safe while parked?">
                                        <p className="m-0">
                                            We partner with reputable parking facilities that prioritize security. While we strive to ensure the safety of your vehicle, The Parking Deals is not responsible for any damage or theft. We recommend removing valuables from your vehicle and locking it securely.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="06. How do I find the parking facility?">
                                        <p className="m-0">
                                            After completing your reservation, you will receive a confirmation email with detailed instructions, including the address and directions to the parking facility. You can also find this information in your account on our website.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="07. What should I do when I arrive at the parking facility?">
                                        <p className="m-0">
                                            When you arrive at the parking facility, present your reservation confirmation (printed or on your mobile device) to the attendant. They will direct you to your parking spot and provide any necessary instructions for shuttle service to the airport.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="08. Is shuttle service to the airport available?">
                                        <p className="m-0">
                                            Yes, most of our partner parking facilities offer complimentary shuttle service to and from the airport. The shuttle schedules and pick-up locations will be provided in your reservation confirmation email.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="09. What if my flight is delayed or I need to extend my parking stay?">
                                        <p className="m-0">
                                            If your flight is delayed or you need to extend your parking stay, please contact the parking facility directly as soon as possible. Additional charges may apply, and availability may vary. The contact information for the facility will be included in your reservation details.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="10. How can I contact customer service?">
                                        <p className="m-0">
                                            If you have any questions or need assistance, our customer service team is here to help. You can reach us by email at [customer service email] or by phone at [customer service phone number]. We are available [hours of operation].
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="11. Do you offer discounts or promotions?">
                                        <p className="m-0">
                                            Yes, we occasionally offer discounts and promotions. Sign up for our newsletter or follow us on social media to stay updated on the latest deals and special offers.
                                        </p>
                                    </AccordionTab>

                                    <AccordionTab header="12. What if I have a complaint or feedback?">
                                        <p className="m-0">
                                            We value your feedback and strive to provide the best service possible. If you have any complaints or suggestions, please contact our customer service team at [customer service email/phone number]. We will address your concerns promptly and work to improve your experience.
                                        </p>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* FaQ Section End */}

            <Footer />
        </>
    )
}

export default FaQ;