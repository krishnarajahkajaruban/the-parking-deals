import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import Tilt from 'react-parallax-tilt';

const Services = () => {
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Services</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Services</li>
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

                </div>
            </section>
            {/* Services Section End */}

            <Footer />
        </>
    )
}

export default Services;