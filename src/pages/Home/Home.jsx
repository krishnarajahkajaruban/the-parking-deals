import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

const Home = () => {


    return (
        <>
            <Header />

            <section className='hero-section overflow-hidden'>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12"></div>
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