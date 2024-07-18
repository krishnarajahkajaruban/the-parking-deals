import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import { Toast } from 'primereact/toast';
import Preloader from "../../Preloader";
import api from "../../api";
import { setLogout } from "../../state";
import { useDispatch, useSelector } from "react-redux";

const ChangePassword = () => {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
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

    const initialChangePasswordInfo = {
        currentPassword: '', 
        newPassword: '',
        confirmPassword: ''
    };
    const [changePasswordInfo, setChangePasswordInfo] = useState(initialChangePasswordInfo);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setChangePasswordInfo({ ...changePasswordInfo, [name]: value });
    };

    const changePassword = async (changeInfo) => {
        setLoading(true);
        try {
            const response = await api.patch("/api/user/update-user-password", changeInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            toast.current.show({
                severity: 'success',
                summary: 'Updated Successfully',
                detail: "Your account password updated successfully, Please Login again!",
                life: 3000
            });
            setTimeout(() => {
                dispatch(
                    setLogout()
                )
            }, 2000);
        } catch (err) {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Failed to Update!',
                detail: err.response.data.error,
                life: 3000
            });
        }finally{
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!changePasswordInfo.currentPassword || !changePasswordInfo.newPassword || !changePasswordInfo.confirmPassword) {
            setShowError(true);
            toast.current.show({
                severity: 'error',
                summary: 'Error in Submission',
                detail: "Please fill all required fields!",
                life: 3000
            });
            return;
        }
        if (changePasswordInfo.newPassword !== changePasswordInfo.confirmPassword) {
            toast.current.show({
                severity: 'error',
                summary: 'Error in Submission',
                detail: "New Password & Confirm Password do not match!",
                life: 3000
            });
            return;
        }
        if (changePasswordInfo.newPassword.length < 8) {
            toast.current.show({
                severity: 'error',
                summary: 'Error in Submission',
                detail: "New Password must be atleast 8 characters long!",
                life: 3000
            });
            return;
        }

        const { confirmPassword, ...updatedChangeInfo } = changePasswordInfo;

        await changePassword(updatedChangeInfo);

        setChangePasswordInfo(initialChangePasswordInfo);

    };

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
                                <form action="" className="custom-card-form"
                                onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="password" className="custom-form-label form-required">Old password</label>
                                                <Password id="password" className="custom-form-input" name="currentPassword"
                                                    value={changePasswordInfo.currentPassword}
                                                    onChange={handleInputChange}
                                                    feedback={false} toggleMask />
                                                {showError && !changePasswordInfo.currentPassword &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="custom-form-group mb-3 mb-sm-4">
                                                <label htmlFor="password" className="custom-form-label form-required">New password</label>
                                                <Password id="password" className="custom-form-input" name="newPassword"
                                                    value={changePasswordInfo.newPassword}
                                                    onChange={handleInputChange}
                                                    header={header} footer={footer} toggleMask />
                                                {showError && !changePasswordInfo.newPassword &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                                <small className='text-danger form-error-msg'>{(changePasswordInfo.newPassword.length < 8 && changePasswordInfo.newPassword) ? "Password must be atleast 8 characters long" : ""}</small>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="custom-form-group">
                                                <label htmlFor="confirmPassword" className="custom-form-label form-required">Confirm password</label>
                                                <Password id="confirmPassword" className="custom-form-input"
                                                    name="confirmPassword"
                                                    value={changePasswordInfo.confirmPassword}
                                                    onChange={handleInputChange}
                                                    feedback={false} toggleMask />
                                                {showError && !changePasswordInfo.confirmPassword &&
                                                    <small className="text-danger form-error-msg">This field is required</small>
                                                }
                                                <small className='text-danger text-capitalized form-error-message'>{(changePasswordInfo.newPassword !== changePasswordInfo.confirmPassword && changePasswordInfo.confirmPassword) ? "Password & Confirm Password must be equal" : ""}</small>
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