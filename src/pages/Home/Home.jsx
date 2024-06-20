import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import './Home-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Home = () => {


    return (
        <>
            <Header />

            <section className='hero-section overflow-hidden'>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-6">

                        </div>
                        <div className="col-12 col-xl-6">
                            <div className="hero-img-area">
                                <img src="assets/images/parking.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='section-padding overflow-hidden'>

            </section>

            <Footer />
        </>
    )
}

export default Home;