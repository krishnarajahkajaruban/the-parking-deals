import React, { useState, useEffect, useRef } from 'react';
import './Booking.css';
import './Booking-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { InputMask } from "primereact/inputmask";
import { Password } from 'primereact/password';
import { InputOtp } from 'primereact/inputotp';

import { Toast } from 'primereact/toast';

const Booking = () => {
    const [showError, setShowError] = useState(false);
    const [showAlert, setShowAlert] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const toast = useRef(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [otp, setOTP] = useState();
    const [seconds, setSeconds] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [departTerminal, setDepartTerminal] = useState();
    const depart_terminals = [
        { name: 'Terminal 1' },
        { name: 'Terminal 2' },
        { name: 'Terminal 3' },
        { name: 'Terminal 4' },
        { name: 'Terminal 5' },
    ];

    const [arrivalTerminal, setArrivalTerminal] = useState();
    const arrival_terminals = [
        { name: 'Terminal 1' },
        { name: 'Terminal 2' },
        { name: 'Terminal 3' },
        { name: 'Terminal 4' },
        { name: 'Terminal 5' },
    ];

    const [title, setTitle] = useState();
    const titles = [
        { name: 'Mr.' },
        { name: 'Mrs.' },
        { name: 'Ms.' },
        { name: 'Miss.' },
    ];

    const [checkedSmsConfirmation, setCheckedSmsConfirmation] = useState(false);
    const [checkedCancellationCover, setCheckedCancellationCover] = useState(false);

    const handleLogin = () => {

    }

    const handleRegister = () => {

    }

    const handleVerify = () => {
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
                            <h3 className='breadcrumb-title'>Booking</h3>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li class="breadcrumb-item active" aria-current="page">Booking</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            <Toast ref={toast} />

            <section className='section-padding overflow-hidden booking-section'>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-8">
                            <article className='booking-card'>
                                <div className="detail-card-label-area main mt-0">
                                    <h5>Booking Details</h5>
                                </div>
                                <div className="booking-card-body">
                                    <div className='booking-card-sub'>
                                        <div className="booking-card-head-area">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-xl-8 mx-auto">
                                                    <div className="custom-form-group mb-3 mb-sm-2">
                                                        <label htmlFor="email" className="custom-form-label form-required text-center" >
                                                            Email Address
                                                        </label>
                                                        <InputText id="email" className="custom-form-input text-center" name="email" placeholder='Enter Email Address' />
                                                        {showError && (
                                                            <small className="text-danger form-error-msg text-center">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Divider className='divider' />

                                            {/* for login */}
                                            {/* <div className="row">
                                                <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                                    <div className="custom-form-group mb-3 mb-sm-4">
                                                        <label htmlFor="email" className="custom-form-label form-required text-center" >
                                                            Password
                                                        </label>
                                                        <Password id="password" value={password} className="custom-form-input text-center" placeholder='Enter the Password' onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask />
                                                        {showError &&
                                                            <small className="text-danger form-error-msg">This field is required</small>
                                                        }
                                                    </div>

                                                    <div className="custom-form-group contains-float-input pt-2 mb-1">
                                                        <Button label="LOGIN" className="w-100 submit-button justify-content-center" onClick={handleLogin} loading={loading} />
                                                    </div>
                                                </div>
                                            </div> */}
                                            {/*  */}

                                            {/* for create account */}
                                            {page === 1 ? (
                                                <div className="row mt-4">
                                                    {showAlert &&
                                                        <div className="col-12">
                                                            <h6 className='account-alert'>
                                                                There is no account in this email, please verify your email to create an account.
                                                            </h6>
                                                        </div>
                                                    }

                                                    <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                                        <div className="custom-form-group contains-float-input pt-2 mb-1">
                                                            <Button label={`${loading ? 'Processing...' : 'VERIFY'}`} className="w-100 submit-button justify-content-center" onClick={handleVerify} loading={loading} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : page === 2 ? (
                                                <div className="row mt-4">
                                                    <div className="col-12">
                                                        <button className="back-page-btn text-sm p-0 mb-3" onClick={goBack} data-aos="fade-left"><i className="ri ri-arrow-left-line me-2"></i>Back</button>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="otp" className="custom-form-label form-required text-center mx-auto">Enter OTP</label>

                                                            <div className="otp-input-area">
                                                                <InputOtp id="otp" className="custom-form-input otp-input" value={otp} onChange={(e) => setOTP(e.value)} integerOnly />
                                                            </div>
                                                            {showError &&
                                                                <small className="text-danger form-error-msg text-center mt-3">This field is required</small>
                                                            }
                                                        </div>

                                                        <div className="custom-form-group contains-float-input mb-3">
                                                            <Button label={`${loading ? 'Verifying...' : 'VERIFY'}`} className="w-100 submit-button justify-content-center" onClick={handleVerifyOTP} loading={loading} />
                                                        </div>

                                                        <div className="custom-form-link-area text-center">
                                                            <p className='text-sm'>
                                                                Didn’t received the code?{' '}
                                                                <button
                                                                    className="custom-form-link"
                                                                    onClick={handleResendCode}
                                                                    disabled={isButtonDisabled}
                                                                >
                                                                    <b> Resend Code {isButtonDisabled && `(${seconds}s)`}</b>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="row mt-4">
                                                    <div className="col-12">
                                                        <button className="back-page-btn text-sm p-0 mb-3" onClick={goBack} data-aos="fade-left"><i className="ri ri-arrow-left-line me-2"></i>Back</button>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-xl-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="password" className="custom-form-label form-required">Password</label>
                                                            <Password id="password" value={password} className="custom-form-input" placeholder='Enter the Password' onChange={(e) => setPassword(e.target.value)} header={header} footer={footer} toggleMask />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-6 col-xl-6">
                                                        <div className="custom-form-group mb-3 mb-sm-4">
                                                            <label htmlFor="confirmPassword" className="custom-form-label form-required">Confirm password</label>
                                                            <Password id="confirmPassword" value={confirmPassword} className="custom-form-input" placeholder='Confirm the Password' onChange={(e) => setConfirmPassword(e.target.value)} feedback={false} toggleMask />
                                                            {showError &&
                                                                <small className="text-danger form-error-msg">This field is required</small>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                                        <div className="custom-form-group contains-float-input pt-2 mb-1">
                                                            <Button label="SIGN UP" className="w-100 submit-button justify-content-center" onClick={handleRegister} loading={loading} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/*  */}

                                        </div>
                                        
                                        {/* Your Details */}
                                        <h4 className="booking-card-head">
                                            Your Details
                                        </h4>

                                        <div className="row mt-4">
                                            <div className="col-12 col-sm-2 col-xl-2">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="title" className="custom-form-label form-required" >
                                                        Title
                                                    </label>
                                                    <Dropdown id="title" value={title} onChange={(e) => setTitle(e.value)} options={titles} optionLabel="name"
                                                        placeholder="Select Terminal" className="w-full w-100 custom-form-dropdown" />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-5 col-xl-5">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="firstName" className="custom-form-label form-required" >
                                                        First Name
                                                    </label>
                                                    <InputText id="firstName" className="custom-form-input" name="firstName" placeholder='Enter First Name' />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-5 col-xl-5">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="lastName" className="custom-form-label form-required" >
                                                        Last Name
                                                    </label>
                                                    <InputText id="lastName" className="custom-form-input" name="lastName" placeholder='Enter Last Name' />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-5 col-xl-5">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="mobileNumber" className="custom-form-label form-required" >
                                                        Mobile Number
                                                    </label>
                                                    <InputMask id="mobileNumber" className="custom-form-input" name="mobileNumber" mask="(999) 9999-9999" placeholder="(020) 1234-5678"></InputMask>
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <label htmlFor="address" className="custom-form-label form-required" >
                                                    Address
                                                </label>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <InputText id="addressLine1" className="custom-form-input" name="addressLine1" placeholder='Address Line 1' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <InputText id="addressLine2" className="custom-form-input" name="addressLine2" placeholder='Address Line 2' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <InputText id="city" className="custom-form-input" name="city" placeholder='City' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <InputText id="country" className="custom-form-input" name="country" placeholder='Country' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-0">
                                                    <InputText id="postCode" className="custom-form-input" name="postCode" placeholder='Post Code' />
                                                </div>
                                            </div>

                                        </div>
                                        {/*  */}

                                        <Divider className='divider-margin' />

                                        {/* Travel Details */}
                                        <h4 className="booking-card-head">
                                            Travel Details
                                        </h4>

                                        <div className="row mt-4">
                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="departTerminal" className="custom-form-label form-required" >
                                                        Depart Terminal
                                                    </label>
                                                    <Dropdown id="departTerminal" value={departTerminal} onChange={(e) => setDepartTerminal(e.value)} options={depart_terminals} optionLabel="name"
                                                        placeholder="Select Terminal" className="w-full w-100 custom-form-dropdown" />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="arrivalTerminal" className="custom-form-label form-required" >
                                                        Arrival Terminal
                                                    </label>
                                                    <Dropdown id="arrivalTerminal" value={arrivalTerminal} onChange={(e) => setArrivalTerminal(e.value)} options={arrival_terminals} optionLabel="name"
                                                        placeholder="Select Terminal" className="w-full w-100 custom-form-dropdown" />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-0">
                                                    <label htmlFor="outBoundFlight" className="custom-form-label" >
                                                        Outbound Flight/Vessel
                                                    </label>
                                                    <InputText id="outBoundFlight" className="custom-form-input" name="outBoundFlight" placeholder='Enter Outbound' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-0">
                                                    <label htmlFor="inBoundFlight" className="custom-form-label" >
                                                        Inbound Flight/Vessel
                                                    </label>
                                                    <InputText id="inBoundFlight" className="custom-form-input" name="inBoundFlight" placeholder='Enter Inbound' />
                                                </div>
                                            </div>
                                        </div>
                                        {/*  */}

                                        <Divider className='divider-margin' />

                                        {/* Vehicle Details */}
                                        <h4 className="booking-card-head">
                                            Vehicle Details
                                        </h4>

                                        <div className="row mt-4">
                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="regNo" className="custom-form-label form-required" >
                                                        Registration Number
                                                    </label>
                                                    <InputText id="regNo" className="custom-form-input" name="regNo" placeholder='Enter Registration No.' />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <label htmlFor="make" className="custom-form-label" >
                                                        Make
                                                    </label>
                                                    <InputText id="make" className="custom-form-input" name="make" placeholder='Enter Make' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-3 mb-sm-0">
                                                    <label htmlFor="model" className="custom-form-label" >
                                                        Model
                                                    </label>
                                                    <InputText id="model" className="custom-form-input" name="model" placeholder='Enter Model' />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-xl-6">
                                                <div className="custom-form-group mb-0">
                                                    <label htmlFor="color" className="custom-form-label form-required" >
                                                        Color
                                                    </label>
                                                    <InputText id="color" className="custom-form-input" name="color" placeholder='Enter Color' />
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                        {/*  */}

                                        <Divider className='divider-margin' />

                                        {/* Optional Extras */}
                                        <h4 className="booking-card-head">
                                            Optional Extras
                                        </h4>

                                        <div className="row mt-4">
                                            <div className="col-12">
                                                <div className="custom-form-group mb-3 mb-sm-4">
                                                    <div className="form-checkbox-area">
                                                        <Checkbox inputId="smsConfirmation" onChange={e => setCheckedSmsConfirmation(e.checked)} checked={checkedSmsConfirmation} name="smsConfirmation" value="1" />
                                                        <label htmlFor="smsConfirmation" className="ml-2">SMS Confirmation - £ 1</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="custom-form-group mb-0">
                                                    <div className="form-checkbox-area">
                                                        <Checkbox inputId="cancellationCover" onChange={e => setCheckedCancellationCover(e.checked)} checked={checkedCancellationCover} name="cancellationCover" value="2" />
                                                        <label htmlFor="cancellationCover" className="ml-2">Cancellation Cover - £ 2</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*  */}

                                        <Divider className='divider-margin' />

                                        {/* Coupon Code */}
                                        <h4 className="booking-card-head">
                                            Coupon Code
                                        </h4>
                                        {/*  */}

                                        <div className="row mt-4">
                                            <div className="col-12 col-sm-7 col-xl-7">
                                                <div className="custom-form-group mb-0">
                                                    <div className="custom-form-flex-group">
                                                        <InputText id="couponCode" className="custom-form-input" name="couponCode" placeholder='Enter Discount Code' />
                                                        <Button label="APPLY" className='aply-btn' />
                                                    </div>
                                                    {showError && (
                                                        <small className="text-danger form-error-msg">
                                                            This field is required
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Divider className='divider-margin' />


                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className="col-12 col-xl-4 ps-xl-2">
                            <article className='detail-card'>
                                <div className="detail-card-label-area main mt-0">
                                    <h5>Your Booking Summary</h5>
                                </div>
                                <div className="detail-card-info-area mb-1">
                                    <div className="detail-card-info-icon-area">
                                        <i class="bi bi-building-fill"></i>
                                    </div>
                                    <div className="detail-card-info-body">
                                        <p>Company :</p>
                                        <h6>Lion Parking</h6>
                                    </div>
                                </div>

                                <div className="detail-card-info-area">
                                    <div className="detail-card-info-icon-area">
                                        <i class="bi bi-geo-alt-fill"></i>
                                    </div>
                                    <div className="detail-card-info-body">
                                        <p>Location :</p>
                                        <h6>Heathrow Airport</h6>
                                    </div>
                                </div>

                                <div className="detail-card-row">
                                    <div className="detail-card-panel">
                                        <div className="detail-card-info-area">
                                            <div className="detail-card-info-icon-area">
                                                <i class="bi bi-calendar2-fill"></i>
                                            </div>
                                            <div className="detail-card-info-body">
                                                <p>Drop Off Date :</p>
                                                <h6>30/6/2024</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-card-panel">
                                        <div className="detail-card-info-area">
                                            <div className="detail-card-info-icon-area">
                                                <i class="bi bi-clock-fill"></i>
                                            </div>
                                            <div className="detail-card-info-body">
                                                <p>Drop Off Time :</p>
                                                <h6>12:00</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-card-row mb-0">
                                    <div className="detail-card-panel">
                                        <div className="detail-card-info-area">
                                            <div className="detail-card-info-icon-area">
                                                <i class="bi bi-calendar2-fill"></i>
                                            </div>
                                            <div className="detail-card-info-body">
                                                <p>Return Date :</p>
                                                <h6>7/7/2024</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-card-panel">
                                        <div className="detail-card-info-area">
                                            <div className="detail-card-info-icon-area">
                                                <i class="bi bi-clock-fill"></i>
                                            </div>
                                            <div className="detail-card-info-body">
                                                <p>Return Time :</p>
                                                <h6>12:00</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Booking;