import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from 'primereact/password';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);

    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Sign in</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Sign in</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Sign in Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 mb-4 mb-lg-5">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Sign In</h3>
                            <div className="mt-5 mb-2 mb-sm-4">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    Welcome back! Please sign in to access your bookings and manage your parking reservations effortlessly. Your convenience is our priority, and our secure platform ensures that your experience with us is smooth and hassle-free. If you have any questions or need assistance, our support team is here to help. Thank you for choosing The Parking Deals.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 my-auto">
                            <div className="section-main-image-area mb-5 mb-sm-5 mb-lg-0" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/account/signin-pink.svg" className="section-main-image animate-image" alt="Sign in" />
                                </Tilt>
                            </div>
                        </div>
                        <div className="col-12 col-xl-6 col-lg-6 col-sm-10 col-md-10 mx-auto">
                            <article className="custom-card" data-aos="fade-up">
                                <div className="custom-card-logo-area">
                                    <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                </div>
                                <h3 className="custom-card-tile">Welcome to <span>The Parking Deals</span></h3>
                                <h6 className="custom-card-sub-tile">Please sign in your account</h6>
                                <form action="" className="custom-card-form">
                                    <div className="custom-form-group contains-float-input">
                                        <FloatLabel>
                                            <InputText id="email" keyfilter="email" className="custom-form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <label htmlFor="email" className="custom-float-label">Email</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="custom-form-group contains-float-input">
                                        <FloatLabel>
                                            <Password value={password} className="custom-form-input" onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />
                                            <label htmlFor="username" className="custom-float-label">Password</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="custom-form-group contains-float-input">
                                        <div className="custom-check-group">
                                            <div className="custom-check-area">
                                                <Checkbox inputId="rememberMe" onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                                                <label htmlFor="rememberMe" className="custom-check-label">Remember me</label>
                                            </div>

                                            <a href="/forgot-password" className="custom-form-link">Forgot password?</a>
                                        </div>
                                    </div>

                                    <div className="custom-form-group contains-float-input">
                                        <Button label="LOGIN" className="w-100 submit-button justify-content-center" />
                                    </div>

                                    <div className="custom-form-link-area text-center">
                                        <p>Don't have an account? <a href="/sign-up" className="custom-form-link"><b>Sign up</b></a></p>
                                    </div>
                                </form>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/* Sign in Section End */}

            <Footer />
        </>
    )
}

export default Signin;