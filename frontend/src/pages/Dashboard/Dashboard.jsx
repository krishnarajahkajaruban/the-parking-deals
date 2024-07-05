import React, { useState, useEffect } from "react";
import './Dashboard.css';
import './Dashboard-responsive.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Dashboard = () => {
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Dashboard</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Profile section */}
            <section className="section-padding dashboard-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">

                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            <Footer />
        </>
    )
}

export default Dashboard;