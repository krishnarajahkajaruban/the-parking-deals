import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';

const Signup = () => {
    const [showError, setShowError] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checked, setChecked] = useState(false);

    const header = <div className="font-bold mb-3">Password Strength</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="ps-4 mt-0 mb-0 pb-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li className="mb-0">Minimum 8 characters</li>
            </ul>
        </>
    );

    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Sign up</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Sign up</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Sign up Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 mb-4 mb-lg-5">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Sign Up</h3>
                            <div className="mt-5 mb-2 mb-sm-4">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    Join The Parking Deals community today to unlock a world of convenient airport parking solutions. By signing up, you gain access to our secure platform, where you can easily browse and book from a variety of parking options tailored to your travel needs. Whether you prefer short-term convenience or long-term savings, we have the perfect parking solution for you. Don't miss out on exclusive offers and seamless booking experiences—sign up now and simplify your travel plans with The Parking Deals.
                                </p>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6 col-lg-6 my-auto d-lg-none d-xxl-block">
                            <div className="section-main-image-area mb-5 mb-sm-5 mb-lg-0" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/account/signup-pink.svg" className="section-main-image animate-image" alt="Sign up" />
                                </Tilt>
                            </div>
                        </div>
                        <div className="col-12 col-xl-7 col-xxl-6 col-lg-8 col-sm-11 col-md-11 mx-auto">
                            <article className="custom-card" data-aos="fade-up">
                                <div className="custom-card-logo-area">
                                    <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                </div>
                                <h3 className="custom-card-tile">Create Your Account</h3>
                                <h6 className="custom-card-sub-tile">Enter the details below</h6>
                                <form action="" className="custom-card-form">
                                    <div className="row">
                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="firstName" className="custom-form-label form-required">First name</label>
                                                <InputText id="firstName" className="custom-form-input" />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="lastName" className="custom-form-label form-required">Last name</label>
                                                <InputText id="lastName" className="custom-form-input" />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="email" className="custom-form-label form-required">Email</label>
                                                <InputText id="email" keyfilter="email" className="custom-form-input" />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="phoneNumber" className="custom-form-label form-required">Phone number</label>
                                                <InputText id="phoneNumber" keyfilter="num" className="custom-form-input" />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="password" className="custom-form-label form-required">Password</label>
                                                <Password id="password" value={password} className="custom-form-input" onChange={(e) => setPassword(e.target.value)} header={header} footer={footer} toggleMask />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-6 col-xl-6">
                                            <div className="custom-form-group">
                                                <label htmlFor="confirmPassword" className="custom-form-label form-required">Confirm password</label>
                                                <Password id="confirmPassword" value={confirmPassword} className="custom-form-input" onChange={(e) => setConfirmPassword(e.target.value)} feedback={false} toggleMask />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="custom-form-group contains-float-input">
                                        <div className="custom-check-group">
                                            <div className="custom-check-area">
                                                <Checkbox inputId="rememberMe" onChange={e => setChecked(e.checked)} checked={checked}></Checkbox>
                                                <label htmlFor="rememberMe" className="custom-check-label">
                                                    By checking this, you will agree to our <a href="/terms-and-conditions" target="_blank">Terms</a> and <a href="/privacy-policy" target="_blank"> Privacy policy</a>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="custom-form-group contains-float-input">
                                        <Button label="SIGNUP" disabled={!checked}  className="w-100 submit-button" />
                                    </div>

                                    <div className="custom-form-link-area text-center">
                                        <p>Already have account? <a href="/sign-in" className="custom-form-link"><b>Sign in</b></a></p>
                                    </div>
                                </form>
                            </article>
                        </div>
                    </div>
                </div>
            </section>
            {/* Sign up Section End */}

            <Footer />
        </>
    )
}

export default Signup;