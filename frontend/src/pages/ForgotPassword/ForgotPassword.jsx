import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';

import { Toast } from 'primereact/toast';

const ForgotPassword = () => {
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [otp, setOTP] = useState();
    const [seconds, setSeconds] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [showError, setShowError] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleVerifyEmail = () => {
        setLoading(true);
        setShowError(true);

        setTimeout(() => {
            setLoading(false);
            setShowError(false);
            setPage(2);
            setSeconds(60);
            setIsButtonDisabled(true);
            toast.current.show({
                severity: 'success',
                summary: 'Email sent successfully.',
                detail: 'Please check your email.',
                life: 3000
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }

    const handleVerifyOTP = () => {
        setLoading(true);
        setShowError(true);

        setTimeout(() => {
            setLoading(false);
            setShowError(false);
            setPage(3);
            toast.current.show({
                severity: 'success',
                summary: 'OTP verified successfully.',
                detail: 'You can reset your password',
                life: 3000
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }

    useEffect(() => {
        if (seconds > 0) {
            const timerId = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            setIsButtonDisabled(false);
        }
    }, [seconds]);

    const handleResendCode = () => {
        setSeconds(60);
        setIsButtonDisabled(true);
    };


    const goBack = () => {
        if (page === 2) {
            setPage(1);
        } else if (page === 3) {
            setPage(2);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Forgot password</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a href="/sign-in">Sign in</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Forgot password</li>
                                </ol>
                            </nav>

                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            {/* Forgot Password Section Start */}
            <section className="section-padding overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 mb-4 mb-lg-5">
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Forgot Password</h3>
                            <div className="mt-5 mb-2 mb-sm-4">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    If you’ve forgotten your password, don’t worry—we’re here to help. Please enter your registered email address below, and we will send you an OTP verification code to reset your password. Follow the instructions in the email to create a new password and regain access to your account. If you do not receive the email within a few minutes, please check your spam or junk folder. For further assistance, contact our customer support team.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Toast ref={toast} />

                    {page === 1 ? (
                        <div className="row">
                            <div className="col-12 col-xl-6 col-lg-6 my-auto">
                                <div className="section-main-image-area" data-aos="zoom-out">
                                    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                        <img src="assets/images/account/account-verification-pink.svg" className="section-main-image animate-image" alt="Email Verification" />
                                    </Tilt>
                                </div>
                            </div>

                            <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                                <article className="custom-card" data-aos="fade-up">
                                    <div className="custom-card-logo-area">
                                        <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                    </div>
                                    <h3 className="custom-card-tile">Email Verification</h3>
                                    <h6 className="custom-card-sub-tile">Enter your registered email address below for verification</h6>
                                    <form action="" className="custom-card-form">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="verify_email" className="custom-form-label form-required">Email</label>
                                                    <InputText id="verify_email" keyfilter="email" className="custom-form-input" placeholder="Enter your email address" />

                                                    {showError &&
                                                        <small className="text-danger form-error-msg">This field is required</small>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="custom-form-group contains-float-input mb-0">
                                            <Button label={`${loading ? 'Processing...' : 'VERIFY'}`} className="w-100 submit-button justify-content-center" loading={loading} onClick={handleVerifyEmail} />
                                        </div>
                                    </form>
                                </article>
                            </div>
                        </div>
                    ) : page === 2 ? (
                        <div className="row">
                            <div className="col-12 col-xl-6 col-lg-6 my-auto">
                                <div className="section-main-image-area " data-aos="zoom-out">
                                    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                        <img src="assets/images/account/enter-otp-pink.svg" className="section-main-image animate-image" alt="OTP Verification" />
                                    </Tilt>
                                </div>
                            </div>

                            <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                                <button className="back-page-btn" onClick={goBack} data-aos="fade-left"><i className="ri ri-arrow-left-line me-2"></i>Back</button>
                                <article className="custom-card" data-aos="fade-up">
                                    <div className="custom-card-logo-area">
                                        <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                    </div>
                                    <h3 className="custom-card-tile">OTP Verification</h3>
                                    <h6 className="custom-card-sub-tile">Enter the OTP verification code sent to your email address</h6>
                                    <form action="" className="custom-card-form">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="otp" className="custom-form-label form-required text-center mx-auto">Enter OTP</label>

                                                    <div className="otp-input-area">
                                                        <InputOtp id="otp" className="custom-form-input otp-input" value={otp} onChange={(e) => setOTP(e.value)} integerOnly />
                                                    </div>
                                                    {showError &&
                                                        <small className="text-danger form-error-msg text-center mt-3">This field is required</small>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="custom-form-group contains-float-input">
                                            <Button label={`${loading ? 'Verifying...' : 'VERIFY'}`} className="w-100 submit-button justify-content-center" onClick={handleVerifyOTP} loading={loading} />
                                        </div>

                                        <div className="custom-form-link-area text-center">
                                            <p>
                                                Didn’t received the code?{' '}
                                                <button
                                                    className="custom-form-link"
                                                    onClick={handleResendCode}
                                                    disabled={isButtonDisabled}
                                                >
                                                    <b>Resend Code {isButtonDisabled && `(${seconds}s)`}</b>
                                                </button>
                                            </p>
                                        </div>
                                    </form>
                                </article>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-12 col-xl-6 col-lg-6 my-auto">
                                <div className="section-main-image-area" data-aos="zoom-out">
                                    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                        <img src="assets/images/account/reset-password-pink.svg" className="section-main-image animate-image" alt="Reset Password" />
                                    </Tilt>
                                </div>
                            </div>

                            <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                                <button className="back-page-btn" onClick={goBack} data-aos="fade-left"><i className="ri ri-arrow-left-line me-2"></i>Back</button>
                                <article className="custom-card" data-aos="fade-up">
                                    <div className="custom-card-logo-area">
                                        <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                    </div>
                                    <h3 className="custom-card-tile">Reset Your Password</h3>
                                    <h6 className="custom-card-sub-tile">Please enter your new password below.</h6>
                                    <form action="" className="custom-card-form">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="password" className="custom-form-label form-required">New password</label>
                                                    <Password id="password" value={password} className="custom-form-input" onChange={(e) => setPassword(e.target.value)} header={header} footer={footer} toggleMask />
                                                    {showError &&
                                                        <small className="text-danger form-error-msg">This field is required</small>
                                                    }
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="custom-form-group">
                                                    <label htmlFor="confirmPassword" className="custom-form-label form-required">Confirm password</label>
                                                    <Password id="confirmPassword" value={confirmPassword} className="custom-form-input" onChange={(e) => setConfirmPassword(e.target.value)} feedback={false} toggleMask />
                                                    {showError &&
                                                        <small className="text-danger form-error-msg">This field is required</small>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="custom-form-group contains-float-input mb-0">
                                            <Button label="RESET" className="w-100 submit-button justify-content-center" loading={loading} />
                                        </div>
                                    </form>
                                </article>
                            </div>
                        </div>
                    )}

                </div>
            </section>
            {/* Forgot Password Section End */}

            <Footer />
        </>
    )
}

export default ForgotPassword;