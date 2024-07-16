import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import { Toast } from 'primereact/toast';
import Preloader from "../../Preloader";

const ChangePassword = () => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [showError, setShowError] = useState(false);


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

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <>
            <Preloader />
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <h3 className='breadcrumb-title'>Change password</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="/dashboard">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">Change password</li>
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
                            <h3 className='section-heading text-center mx-auto text-purple' data-aos="zoom-out">Change Password</h3>
                            <div className="mt-5 mb-2 mb-sm-4">
                                <p className='section-paragraph text-center mb-0' data-aos="fade">
                                    To ensure the security of your account, it's important to update your password regularly. Please enter your current password, followed by your new password, and confirm the new password. Your new password should be a combination of letters, numbers, and special characters to enhance security. Once updated, you will use your new password to access your account. If you encounter any issues, please contact our support team for assistance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Toast ref={toast} />

                    <div className="row">
                        <div className="col-12 col-xl-6 col-lg-6 my-auto">
                            <div className="section-main-image-area" data-aos="zoom-out">
                                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                                    <img src="assets/images/account/change-password-pink.svg" className="section-main-image animate-image" alt="Change Password" />
                                </Tilt>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                            <article className="custom-card" data-aos="fade-up">
                                <div className="custom-card-logo-area">
                                    <img src="assets/images/logo.png" className='custom-card-logo' alt="The Parking Deals" />
                                </div>
                                <h3 className="custom-card-tile">Change Your Password</h3>
                                <h6 className="custom-card-sub-tile">Please enter your old password below to change your password.</h6>
                                <form action="" className="custom-card-form">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="password" className="custom-form-label form-required">Old password</label>
                                                <Password id="password" className="custom-form-input" name="oldPassword"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    feedback={false} toggleMask />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="password" className="custom-form-label form-required">New password</label>
                                                <Password id="password" className="custom-form-input" name="newPassword"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    header={header} footer={footer} toggleMask />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="custom-form-group">
                                                <label htmlFor="confirmPassword" className="custom-form-label form-required">Confirm password</label>
                                                <Password id="confirmPassword" className="custom-form-input"
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    feedback={false} toggleMask />
                                                {showError &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="custom-form-group contains-float-input mb-0">
                                        <Button label="CHANGE" className="w-100 submit-button justify-content-center" loading={loading} />
                                    </div>
                                </form>
                            </article>
                        </div>
                    </div>

                </div>
            </section>
            {/* Forgot Password Section End */}

            <Footer />
        </>
    )
}

export default ChangePassword;