import React, { useState, useEffect, useRef } from 'react';
import './Booking.css';
import './Booking-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { InputIcon } from 'primereact/inputicon';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { InputMask } from "primereact/inputmask";
import { Password } from 'primereact/password';
import { InputOtp } from 'primereact/inputotp';
import { IconField } from "primereact/iconfield";

import { Toast } from 'primereact/toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api';
import { sendVerificationEmail, verifyOTP } from '../../utils/authUtil';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { setLogin } from '../../state';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingDetails } = location.state || {};
  const [showError, setShowError] = useState(false);
  const [showCouponError, setShowCouponError] = useState(false);
  const [couponValid, setCouponValid] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const toast = useRef(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

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

  const titles = [
    { name: 'Mr.' },
    { name: 'Mrs.' },
    { name: 'Ms.' },
    { name: 'Miss.' },
  ];
  const [title, setTitle] = useState(titles[0]);

  const [checkedSmsConfirmation, setCheckedSmsConfirmation] = useState(false);
  const [checkedCancellationCover, setCheckedCancellationCover] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  console.log(bookingDetails);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);


  const initalUserDetails = {
    email: "",
    password: "",
    confirmPassword: "",
    title: titles[0].name,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    // addressL1: "",
    // addressL2: "",
    // city: "",
    // country: "",
    // postCode: "",
    role: "User"
  };

  const initialTravelDetails = {
    departureTerminal: "",
    arrivalTerminal: "",
    // outBoundFlight: "",
    inBoundFlight: ""
  };

  const initialVehiclesDetails = [
    {
      regNo: "",
      color: "",
      make: "",
      model: ""
    }
  ];

  const initialCardDetails = {
    name: "",
    postCode: "",
    cardNo: "",
    expDate: "",
    cvv: ""
  };

  const [userDetails, setUserDetails] = useState(initalUserDetails);
  const [emailExist, setEmailExist] = useState(false);
  const [reSendLoading, setReSendLoading] = useState(false);
  const [travelDetails, setTravelDetails] = useState(initialTravelDetails);
  const [vehiclesDetails, setVehiclesDetails] = useState(initialVehiclesDetails);
  const [couponCode, setCouponCode] = useState(bookingDetails?.couponCode);
  const [cardDetails, setCardDetails] = useState(initialCardDetails);
  const [bookingCharge, setBookingCharge] = useState();

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BASEURL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents
      });

      const { clientSecret } = await response.json();

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>Pay</button>
        {/* <Button
        type='submit'
        label="CONFIRM BOOKING"
        className="custom-btn-primary w-100 result-card-btn"
        // onClick={handleBooking}
        disabled={!isAgreed || !stripe}
        /> */}
        {error && <div>{error}</div>}
        {success && <div>Payment successful!</div>}
      </form>
    );
  };

  const PaymentForm = () => {
    return (
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    );
  };

  const calculatingBookingCharge = async () => {
    // setBookingCharge();
    try {
      const response = await api.post("/api/user/calculate-total-booking-charge",
        {
          bookingQuote: bookingDetails?.bookingQuote,
          couponCode,
          smsConfirmation: checkedSmsConfirmation,
          cancellationCover: checkedCancellationCover
        }
      );
      console.log(response.data);
      setBookingCharge(response.data);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Error in Booking charge calculation!',
        detail: err.response.data.error,
        life: 3000
      });
    };
  };

  useEffect(() => {
    if (bookingDetails?.bookingQuote) {

      calculatingBookingCharge();
    }
  }, [bookingDetails, checkedCancellationCover, checkedSmsConfirmation]);

  const checkingCouponCodeValidity = async () => {
    try {
      const response = await api.post("/api/user/checking-couponcode-validity",
        {
          couponCode
        }
      );
      console.log(response.data);
      setCouponValid(true);
    } catch (err) {
      console.log(err);
      setCouponValid(false);
    };
  };

  useEffect(() => {
    if (couponCode) {
      checkingCouponCodeValidity();
    }
  }, [couponCode]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
    if (name === "email") {
      setShowError(false);
      setEmailExist(false);
      try {
        const response = await api.post("/api/auth/check-user-registerd", { email: value });
        console.log(response.data);
        setEmailExist(response.data?.emailExists);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleInputTravelDetailChange = async (e) => {
    const { name, value } = e.target;
    setTravelDetails({ ...travelDetails, [name]: value });
  };

  const handleInputVechicleDetailChange = async (index, e) => {
    const { name, value } = e.target;
    const newVehicleDetails = [...vehiclesDetails];
    newVehicleDetails[index][name] = value;
    setVehiclesDetails(newVehicleDetails);
  };

  const addVehicle = () => {
    setVehiclesDetails([...vehiclesDetails, { regNo: '', make: '', model: '', color: '' }]);
  };

  const removeVehicle = (index) => {
    const newVehicleDetails = vehiclesDetails.filter((_, i) => i !== index);
    setVehiclesDetails(newVehicleDetails);
  };

  const handleInputCardDetailChange = async (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };


  const handleLogin = () => {

  }

  const handleRegister = () => {

  }

  const handleApplyCoupon = () => {
    if (couponCode) {
      checkingCouponCodeValidity();
      calculatingBookingCharge();
    };
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    await sendVerificationEmail(
      userDetails.email,
      setShowError,
      setLoading,
      setReSendLoading,
      setPage,
      setSeconds,
      setIsButtonDisabled,
      null,
      setUserDetails,
      toast
    );
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    await verifyOTP(otp, setShowError, setOTP, userDetails.email, setLoading, setPage, toast, false, setVerified);
  };

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
    setOTP();
    setSeconds(60);
    setIsButtonDisabled(true);
    handleVerify();
  };

  const goBack = () => {
    if (page === 2) {
      setPage(1);
    } else if (page === 3) {
      setPage(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };


  const bookTheCarParkingSlot = async (details) => {
    console.log(details);
    setLoading(true);
    try {
      const response = await api.post("/api/user/car-park-booking", details);
      console.log(response.data);

      dispatch(
        setLogin({
          user: response.data.user,
          token: response.data.token
        })
      );
      setLoading(false);
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });

      console.log(result);

      toast.current.show({
        severity: 'success',
        summary: 'Booking Successful',
        detail: "You have booked your parking slot successfully",
        life: 3000
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);


    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Failed to Book',
        detail: err.response.data.error,
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };



  function validateUserDetails(userDetails, isUserPresent, doesEmailExist) {
    // Check if user is present
    if (isUserPresent) {
      return true; // No validation needed if user is already present
    }

    // Check if email exists in the system
    if (doesEmailExist) {
      if (!userDetails.email || !userDetails.password) {
        setShowError(true);
        toast.current.show({
          severity: 'error',
          summary: 'Error in Your Details Submission',
          detail: "Please fill all required fields!",
          life: 3000
        });
        return false;
      }
    } else {
      // Validate all required fields
      if (!userDetails.email || !userDetails.firstName || !userDetails.password || !userDetails.confirmPassword || !userDetails.mobileNumber || !userDetails.title) {
        setShowError(true);
        toast.current.show({
          severity: 'error',
          summary: 'Error in Your Details Submission',
          detail: "Please fill all required fields!",
          life: 3000
        });
        return false;
      }
    }

    // Check if passwords match
    if (!doesEmailExist && (userDetails.password !== userDetails.confirmPassword)) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Your Details Submission',
        detail: "Password & Confirm Password do not match!",
        life: 3000
      });
      return false;
    }

    // Check if password length is at least 8 characters
    if (userDetails.password.length < 8) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Your Details Submission',
        detail: "Password must be at least 8 characters long!",
        life: 3000
      });
      return false;
    }

    return true; // All validations passed
  }

  const handleBooking = () => {
    console.log(userDetails, user, emailExist);

    if (!validateUserDetails(userDetails, user, emailExist)) {
      return; // Exit if validation fails
    }

    // Check if travel details are filled
    if (!travelDetails.departureTerminal || !travelDetails.arrivalTerminal) {
      setShowError(true);
      toast.current.show({
        severity: 'error',
        summary: 'Error in Travel Detail Submission',
        detail: "Please fill all required fields!",
        life: 3000
      });
      return;
    }

    // Check if all vehicle details are filled
    const hasError = vehiclesDetails.some(vehicle => !vehicle.regNo || !vehicle.color);
    if (hasError) {
      setShowError(true);
      toast.current.show({
        severity: 'error',
        summary: 'Error in Vehicle Detail Submission',
        detail: "Please fill all required fields!",
        life: 3000
      });
      return;
    }

    // Check if terms and privacy policy are agreed
    if (!isAgreed) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "You have to agree to the Terms & Privacy Policy before the Booking",
        life: 3000
      });
      return;
    }

    // Prepare user details object
    let userDetail = {};
    if (user) {
      userDetail.accessToken = token;
    } else if (emailExist) {
      userDetail = {
        email: userDetails.email,
        password: userDetails.password,
        registeredStatus: true
      };
    } else {
      userDetail = {
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        password: userDetails.password,
        mobileNumber: userDetails.mobileNumber,
        title: userDetails.title,
        // addressL1: userDetails.addressL1,
        // addressL2: userDetails.addressL2,
        // city: userDetails.city,
        // country: userDetails.country,
        // postCode: userDetails.postCode,
      };
    }

    // Prepare booking details object
    const carParkingSlotBookingDetails = {
      airportName: bookingDetails?.airportName,
      dropOffDate: bookingDetails?.dropOffDate,
      dropOffTime: bookingDetails?.dropOffTime,
      pickUpDate: bookingDetails?.pickUpDate,
      pickUpTime: bookingDetails?.pickupTime,
      companyId: bookingDetails?.companyId,
      userDetail: userDetail,
      travelDetail: travelDetails,
      vehicleDetail: vehiclesDetails,
      // cardDetail: cardDetails,
      bookingQuote: bookingDetails?.bookingQuote,
      couponCode: bookingDetails?.couponCode,
      smsConfirmation: checkedSmsConfirmation,
      cancellationCover: checkedCancellationCover
    };

    bookTheCarParkingSlot(carParkingSlotBookingDetails);
  };

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

  const [cardNumber, setCardNumber] = useState();
  const [cardDate, setCardDate] = useState();
  const [cardCVV, setCardCVV] = useState();

  return (
    <>
      {!bookingDetails && <Navigate to="/" />}
      <Header />

      {/* Breadcrumb Section Start */}
      <section className="breadcrumb-section overflow-hidden">
        <div className="container-md">
          <div className="row">
            <div className="col-12">
              <h3 className="breadcrumb-title">Booking</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Booking
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      {/* Breadcrumb Section End */}

      <Toast ref={toast} />

      <section className="section-padding booking-section">
        <div className="container-md">
          <div className="row">
            <div className="col-12 col-xl-8 col-lg-7 card-in-reverse-order">
              <article className="booking-card">
                <div className="detail-card-label-area main mt-0">
                  <h5>Booking Details</h5>
                </div>
                <div className="booking-card-body">
                  <div className="booking-card-sub">
                    {!user && (
                      <>
                        <div className="booking-card-head-area">
                          <div className="row">
                            <div className="col-12 col-lg-10 col-md-8 col-xl-8 col-sm-9 mx-auto">
                              <div className="custom-form-group mb-3 mb-sm-2">
                                <label
                                  htmlFor="email"
                                  className="custom-form-label form-required text-center"
                                >
                                  Email Address
                                </label>
                                <InputText
                                  id="email"
                                  className="custom-form-input text-center"
                                  name="email"
                                  placeholder="Enter Email Address"
                                  value={userDetails.email}
                                  onChange={handleInputChange}
                                />
                                {(showError && !userDetails.email) && (
                                  <small className="text-danger form-error-msg text-center">
                                    This field is required
                                  </small>
                                )}
                                <small className="text-danger form-error-msg">
                                  {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                    userDetails.email
                                  ) && userDetails.email
                                    ? "Enter valid email"
                                    : ""}
                                </small>
                              </div>
                            </div>
                          </div>

                          <Divider className="divider" />

                          {/* for login */}
                          {(emailExist &&
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              userDetails.email
                            ) &&
                            userDetails.email) && <div className="row">
                              <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="email"
                                    className="custom-form-label form-required text-center"
                                  >
                                    Password
                                  </label>
                                  <Password
                                    id="password"
                                    name='password'
                                    value={userDetails.password}
                                    className="custom-form-input text-center"
                                    placeholder="Enter the Password"
                                    onChange={handleInputChange
                                    }
                                    feedback={false}
                                    toggleMask
                                  />
                                  {(showError && !userDetails.password) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>

                                {/* <div className="custom-form-group contains-float-input pt-2 mb-1">
                                  <Button
                                    label="LOGIN"
                                    className="w-100 submit-button justify-content-center"
                                    onClick={handleLogin}
                                    loading={loading}
                                  />
                                </div> */}
                              </div>
                            </div>}
                          {/*  */}

                          {/* for create account */}
                          {(page === 1 && !emailExist &&
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              userDetails.email
                            ) &&
                            userDetails.email) ? (
                            <div className="row mt-4">
                              <div className="col-12">
                                <h6 className="account-alert">
                                  There is no account in this email,
                                  please verify your email to create an
                                  account.
                                </h6>
                              </div>
                              <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                <div className="custom-form-group contains-float-input pt-2 mb-1">
                                  <Button
                                    label={`${loading ? "Processing..." : "VERIFY"
                                      }`}
                                    className="w-100 submit-button justify-content-center"
                                    onClick={handleVerify}
                                    loading={loading}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : page === 2 ? (
                            <div className="row mt-4">
                              <div className="col-12">
                                <button
                                  className="back-page-btn text-sm p-0 mb-3"
                                  onClick={goBack}
                                  data-aos="fade-left"
                                >
                                  <i className="ri ri-arrow-left-line me-2"></i>
                                  Back
                                </button>
                              </div>
                              <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="otp"
                                    className="custom-form-label form-required text-center mx-auto"
                                  >
                                    Enter OTP
                                  </label>

                                  <div className="otp-input-area">
                                    <InputOtp
                                      id="otp"
                                      className="custom-form-input otp-input"
                                      value={otp}
                                      onChange={(e) => {
                                        setShowError(false);
                                        setOTP(e.value);
                                      }}
                                    />
                                  </div>
                                  {(showError && !otp) && (
                                    <small className="text-danger form-error-msg text-center mt-3">
                                      This field is required
                                    </small>
                                  )}
                                </div>

                                <div className="custom-form-group contains-float-input mb-3">
                                  <Button
                                    label={`${reSendLoading
                                      ? "Processing..."
                                      : loading
                                        ? "Verifying..."
                                        : "VERIFY"
                                      }`}
                                    className="w-100 submit-button justify-content-center"
                                    onClick={handleVerifyOTP}
                                    loading={loading}
                                    disabled={!otp}
                                  />
                                </div>

                                <div className="custom-form-link-area text-center">
                                  <p className="text-sm">
                                    Didn’t received the code?{" "}
                                    <button
                                      className="custom-form-link"
                                      onClick={handleResendCode}
                                      disabled={isButtonDisabled}
                                    >
                                      <b>
                                        {" "}
                                        Resend Code{" "}
                                        {isButtonDisabled && `(${seconds}s)`}
                                      </b>
                                    </button>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : page === 3 ? (
                            <div className="row mt-4">
                              <div className="col-12">
                                <button
                                  className="back-page-btn text-sm p-0 mb-3"
                                  onClick={goBack}
                                  data-aos="fade-left"
                                >
                                  <i className="ri ri-arrow-left-line me-2"></i>
                                  Back
                                </button>
                              </div>
                              <div className="col-12 col-sm-6 col-lg-10 col-xl-6 mx-auto">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="password"
                                    className="custom-form-label form-required"
                                  >
                                    Password
                                  </label>
                                  <Password
                                    id="password"
                                    name='password'
                                    value={userDetails.password}
                                    className="custom-form-input"
                                    placeholder="Enter the Password"
                                    onChange={handleInputChange
                                    }
                                    header={header}
                                    footer={footer}
                                    toggleMask
                                  />
                                  {(showError && !userDetails.password) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                  <small className='text-danger form-error-msg'>{(userDetails.password.length < 8 && userDetails.password) ? "Password must be atleast 8 characters long" : ""}</small>
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-lg-10 col-xl-6 mx-auto">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="confirmPassword"
                                    className="custom-form-label form-required"
                                  >
                                    Confirm password
                                  </label>
                                  <Password
                                    id="confirmPassword"
                                    name='confirmPassword'
                                    value={userDetails.confirmPassword}
                                    className="custom-form-input"
                                    placeholder="Confirm the Password"
                                    onChange={handleInputChange
                                    }
                                    feedback={false}
                                    toggleMask
                                  />
                                  {(showError && !userDetails.confirmPassword) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                  <small className='text-danger text-capitalized form-error-message'>{(userDetails.password !== userDetails.confirmPassword && userDetails.confirmPassword) ? "Password & Confirm Password must be equal" : ""}</small>
                                </div>
                              </div>

                              {/* <div className="col-12 col-sm-6 col-xl-6 mx-auto">
                                  <div className="custom-form-group contains-float-input pt-2 mb-1">
                                    <Button
                                      label="SIGN UP"
                                      className="w-100 submit-button justify-content-center"
                                      onClick={handleRegister}
                                      loading={loading}
                                    />
                                  </div>
                                </div> */}
                            </div>
                          ) : null}
                          {/*  */}
                        </div>
                        {(!emailExist &&
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            userDetails.email
                          ) &&
                          userDetails.email && verified) && <>
                            {/* Your Details */}
                            <h4 className="booking-card-head">Your Details</h4>

                            <div className="row mt-4">
                              <div className="col-6 col-sm-3 col-md-3 col-lg-3 col-xl-2">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="title"
                                    className="custom-form-label form-required"
                                  >
                                    Title
                                  </label>
                                  <Dropdown
                                    id="title"
                                    value={{ name: userDetails.title }}
                                    onChange={(e) => setUserDetails({ ...userDetails, title: e.value?.name })}
                                    options={titles}
                                    optionLabel="name"
                                    placeholder="Select"
                                    className="w-full w-100 custom-form-dropdown"
                                  />
                                  {(showError && !userDetails.title) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-sm-9 col-md-9 col-lg-9 col-xl-5">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="firstName"
                                    className="custom-form-label form-required"
                                  >
                                    First Name
                                  </label>
                                  <InputText
                                    id="firstName"
                                    className="custom-form-input"
                                    name="firstName"
                                    placeholder="Enter First Name"
                                    value={userDetails.firstName}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.firstName) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-md-6 col-lg-9 offset-lg-3 offset-xl-0 col-xl-5">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="lastName"
                                    className="custom-form-label"
                                  >
                                    Last Name
                                  </label>
                                  <InputText
                                    id="lastName"
                                    className="custom-form-input"
                                    name="lastName"
                                    placeholder="Enter Last Name"
                                    value={userDetails.lastName}
                                    onChange={handleInputChange}
                                  />
                                  {/* {showError && (
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                        )} */}
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <label
                                    htmlFor="mobileNumber"
                                    className="custom-form-label form-required"
                                  >
                                    Mobile Number
                                  </label>
                                  {/* <InputMask
                                    id="mobileNumber"
                                    className="custom-form-input"
                                    name="mobileNumber"
                                    mask="(999) 9999-9999"
                                    placeholder="(020) 1234-5678"
                                    value={userDetails.mobileNumber}
                                    onChange={handleInputChange}
                                  ></InputMask> */}
                                  <InputText
                                    id="mobileNumber"
                                    keyfilter="num"
                                    className="custom-form-input"
                                    name="mobileNumber"
                                    value={userDetails.mobileNumber}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.mobileNumber) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* <div className="row">
                              <div className="col-12">
                                <label
                                  htmlFor="address"
                                  className="custom-form-label form-required"
                                >
                                  Address
                                </label>
                              </div>

                              <div className="col-12 col-sm-6 col-lg-12 col-xl-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <InputText
                                    id="addressLine1"
                                    className="custom-form-input"
                                    name="addressL1"
                                    placeholder="Address Line 1"
                                    value={userDetails.addressL1}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.addressL1) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-lg-12 col-xl-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <InputText
                                    id="addressLine2"
                                    className="custom-form-input"
                                    name="addressL2"
                                    placeholder="Address Line 2"
                                    value={userDetails.addressL2}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-xl-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <InputText
                                    id="city"
                                    className="custom-form-input"
                                    name="city"
                                    placeholder="City"
                                    value={userDetails.city}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.city) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-xl-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                  <InputText
                                    id="country"
                                    className="custom-form-input"
                                    name="country"
                                    placeholder="Country"
                                    value={userDetails.country}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.country) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>

                              <div className="col-12 col-sm-6 col-xl-6">
                                <div className="custom-form-group mb-0">
                                  <InputText
                                    id="postCode"
                                    className="custom-form-input"
                                    name="postCode"
                                    placeholder="Post Code"
                                    value={userDetails.postCode}
                                    onChange={handleInputChange}
                                  />
                                  {(showError && !userDetails.postCode) && (
                                    <small className="text-danger form-error-msg">
                                      This field is required
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div> */}
                            {/*  */}

                            <Divider className="divider-margin" />
                          </>}
                      </>
                    )}
                    {/* Travel Details */}
                    <h4 className="booking-card-head">Travel Details</h4>

                    <div className="row mt-4">
                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="departTerminal"
                            className="custom-form-label form-required"
                          >
                            Depart Terminal
                          </label>
                          <Dropdown
                            id="departTerminal"
                            value={{ name: travelDetails.departureTerminal }}
                            onChange={(e) => setTravelDetails({ ...travelDetails, departureTerminal: e.value?.name })}
                            options={depart_terminals}
                            optionLabel="name"
                            placeholder="Select Terminal"
                            className="w-full w-100 custom-form-dropdown"
                          />
                          {(showError && !travelDetails.departureTerminal) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="arrivalTerminal"
                            className="custom-form-label form-required"
                          >
                            Arrival Terminal
                          </label>
                          <Dropdown
                            id="arrivalTerminal"
                            value={{ name: travelDetails.arrivalTerminal }}
                            onChange={(e) => setTravelDetails({ ...travelDetails, arrivalTerminal: e.value?.name })}
                            options={arrival_terminals}
                            optionLabel="name"
                            placeholder="Select Terminal"
                            className="w-full w-100 custom-form-dropdown"
                          />
                          {(showError && !travelDetails.arrivalTerminal) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      {/* <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-0">
                          <label
                            htmlFor="outBoundFlight"
                            className="custom-form-label"
                          >
                            Outbound Flight/Vessel
                          </label>
                          <InputText
                            id="outBoundFlight"
                            className="custom-form-input"
                            name="outBoundFlight"
                            value={travelDetails.outBoundFlight}
                            onChange={handleInputTravelDetailChange}
                            placeholder="Enter Outbound"
                          />
                        </div>
                      </div> */}

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-0">
                          <label
                            htmlFor="inBoundFlight"
                            className="custom-form-label"
                          >
                            Inbound Flight/Vessel
                          </label>
                          <InputText
                            id="inBoundFlight"
                            className="custom-form-input"
                            name="inBoundFlight"
                            value={travelDetails.inBoundFlight}
                            onChange={handleInputTravelDetailChange}
                            placeholder="Enter Inbound"
                          />
                        </div>
                      </div>
                    </div>
                    {/*  */}

                    <Divider className="divider-margin" />

                    {/* Vehicle Details */}
                    <h4 className="booking-card-head">Vehicle Details</h4>

                    {vehiclesDetails.map((vehicle, index) => (
                      <div className="row mt-4" key={index}>
                        <div className="col-12 col-sm-6 col-xl-6">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor={`regNo-${index}`}
                              className="custom-form-label form-required"
                            >
                              Registration Number
                            </label>
                            <InputText
                              id={`regNo-${index}`}
                              className="custom-form-input"
                              name="regNo"
                              placeholder="Enter Registration No."
                              value={vehicle.regNo}
                              onChange={(event) => handleInputVechicleDetailChange(index, event)}
                            />
                            {showError && !vehicle.regNo && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-6">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label htmlFor={`make-${index}`} className="custom-form-label">
                              Make
                            </label>
                            <InputText
                              id={`make-${index}`}
                              className="custom-form-input"
                              name="make"
                              placeholder="Enter Make"
                              value={vehicle.make}
                              onChange={(event) => handleInputVechicleDetailChange(index, event)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-6">
                          <div className="custom-form-group mb-3 mb-sm-0">
                            <label
                              htmlFor={`model-${index}`}
                              className="custom-form-label"
                            >
                              Model
                            </label>
                            <InputText
                              id={`model-${index}`}
                              className="custom-form-input"
                              name="model"
                              placeholder="Enter Model"
                              value={vehicle.model}
                              onChange={(event) => handleInputVechicleDetailChange(index, event)}
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-xl-6">
                          <div className="custom-form-group mb-0">
                            <label
                              htmlFor={`color-${index}`}
                              className="custom-form-label form-required"
                            >
                              Color
                            </label>
                            <InputText
                              id={`color-${index}`}
                              className="custom-form-input"
                              name="color"
                              placeholder="Enter Color"
                              value={vehicle.color}
                              onChange={(event) => handleInputVechicleDetailChange(index, event)}
                            />
                            {showError && !vehicle.color && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="col-12">
                          <Button
                            label="Add Vehicle"
                            className="aply-btn mt-3"
                            onClick={addVehicle}
                          />
                          {index !== 0 && (
                            <Button
                              label="Remove Vehicle"
                              onClick={() => removeVehicle(index)}
                              className="btn btn-danger mt-3 ml-2 mx-2"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    {/*  */}

                    <Divider className="divider-margin" />

                    {/* Optional Extras */}
                    <h4 className="booking-card-head">Optional Extras</h4>

                    <div className="row mt-4">
                      {/* <div className="col-12">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <div className="form-checkbox-area">
                            <Checkbox
                              inputId="smsConfirmation"
                              onChange={(e) =>{
                                setCheckedSmsConfirmation(e.checked)
                              }
                              }
                              checked={checkedSmsConfirmation}
                              name="smsConfirmation"
                              value="1"
                            />
                            <label htmlFor="smsConfirmation" className="ml-2">
                              SMS Confirmation - £ 1
                            </label>
                          </div>
                        </div>
                      </div> */}

                      <div className="col-12">
                        <div className="custom-form-group mb-0">
                          <div className="form-checkbox-area">
                            <Checkbox
                              inputId="cancellationCover"
                              onChange={(e) => {
                                // setBookingCharge();
                                setCheckedCancellationCover(e.checked)
                              }
                              }
                              checked={checkedCancellationCover}
                              name="cancellationCover"
                              value="2"
                            />
                            <label
                              htmlFor="cancellationCover"
                              className="ml-2"
                            >
                              Cancellation Cover - £ 5
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*  */}

                    <Divider className="divider-margin" />

                    {/* Coupon Code */}
                    <h4 className="booking-card-head">Coupon Code</h4>

                    <div className="row mt-4">
                      <div className="col-12 col-sm-7 col-lg-9 col-xl-7">
                        <div className="custom-form-group mb-0">
                          <div className="custom-form-flex-group">
                            <InputText
                              id="couponCode"
                              className="custom-form-input"
                              name="couponCode"
                              placeholder="Enter Discount Code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <Button
                              label="APPLY"
                              className="aply-btn"
                              onClick={handleApplyCoupon}
                              disabled={!couponCode}
                            />
                          </div>
                          {/* {showCouponError && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )} */}

                          {(couponCode && couponValid) ? (
                            <h6 className="coupon-valid success">
                              <i className="bi bi-check-circle-fill me-2"></i>
                              Coupon is valid.
                            </h6>)
                            : (couponCode && !couponValid) ? (
                              <h6 className='coupon-valid error'>
                                <i className='bi bi-x-circle-fill me-2'></i>
                                Coupon is invalid.
                              </h6>
                            ) : null
                          }
                        </div>
                      </div>
                    </div>
                    {/*  */}

                    <Divider className="divider-margin" />

                    <div className="total-price-area">
                      <h5 className="total-price-text">Total :</h5>
                      <h5 className="total-price">£ {bookingCharge?.totalPayable || 0}</h5>
                    </div>

                    {/* <Divider className="divider-margin" /> */}

                    {/* Coupon Code */}
                    {/* <div className="booking-card-head-area">
                      <h4 className="booking-card-head">Card Details</h4>

                      <div className="row mt-4">
                        <div className="col-12 col-sm-6 col-lg-8 col-xl-6">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor="cardName"
                              className="custom-form-label form-required"
                            >
                              Name on Card
                            </label>
                            <InputText
                              id="cardName"
                              className="custom-form-input"
                              name="name"
                              value={cardDetails.name}
                              onChange={handleInputCardDetailChange}
                              placeholder="Name on Card"
                            />
                            {(showError && !cardDetails.name) && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4 col-xl-6">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor="cardPostCode"
                              className="custom-form-label form-required"
                            >
                              Post code
                            </label>
                            <InputText
                              id="cardPostCode"
                              className="custom-form-input"
                              name="postCode"
                              value={cardDetails.postCode}
                              onChange={handleInputCardDetailChange}
                              placeholder="Post code"
                            />
                            {(showError && !cardDetails.postCode) && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-12 col-sm-7 col-lg-12 col-xl-7">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor="cardNumber"
                              className="custom-form-label form-required"
                            >
                              Card Number
                            </label>
                            <IconField iconPosition="left">
                              <InputIcon className="bi bi-credit-card-fill opacity-50">
                                {" "}
                              </InputIcon>
                              <InputMask
                                name='cardNo'
                                value={cardDetails.cardNo}
                                v-model="value1"
                                className="custom-form-input input-padding"
                                onChange={handleInputCardDetailChange}
                                mask="9999 9999 9999 9999"
                                placeholder="0000 0000 0000 0000"
                              />
                            </IconField>
                            {(showError && !cardDetails.cardNo) && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="col-6 col-sm-3 col-lg-4 col-xl-3">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor="cardDate"
                              className="custom-form-label form-required"
                            >
                              Expiry Date
                            </label>
                            <InputMask
                              name='expDate'
                              value={cardDetails.expDate}
                              className="custom-form-input"
                              onChange={handleInputCardDetailChange}
                              mask="99/99"
                              placeholder="MM/YY"
                              slotChar="MM/YY"
                            />
                            {(showError && !cardDetails.expDate) && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-6 col-sm-2 col-lg-3 col-xl-2">
                          <div className="custom-form-group mb-3 mb-sm-4">
                            <label
                              htmlFor="cardCVV"
                              className="custom-form-label form-required"
                            >
                              CVV
                            </label>
                            <InputMask
                            name='cvv'
                              value={cardDetails.cvv}
                              className="custom-form-input"
                              onChange={handleInputCardDetailChange}
                              mask="999"
                              placeholder="CVV"
                            />
                            {(showError && !cardDetails.cvv) && (
                              <small className="text-danger form-error-msg">
                                This field is required
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <p className="page-warning-text">
                            <span className="form-required me-2"></span>Please
                            do not reload or close the page while the payment
                            is being processed
                          </p>
                        </div>
                      </div>
                    </div> */}
                    {/*  */}

                    <Divider className="divider-margin" />

                    <div className="account-agree-area">
                      <Checkbox
                        inputId="isAgreed"
                        onChange={(e) => setIsAgreed(e.checked)}
                        checked={isAgreed}
                        name="isAgreed"
                        value="1"
                      />
                      <label htmlFor="isAgreed" className="ml-2">
                        On making payment you agree to The Parking Deals&nbsp;
                        <a href="/terms-and-conditions" target="_blank">
                          Terms and Conditions
                        </a>
                        &nbsp;and&nbsp;
                        <a href="/privacy-policy" target="_blank">
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    <div className="row mt-5">
                      <div className="col-12 col-xl-4 col-md-6 col-lg-7 col-sm-6 mx-auto">
                        <Button
                          label="CONFIRM BOOKING"
                          loading={loading}
                          className="custom-btn-primary w-100 result-card-btn"
                          onClick={handleBooking}
                          disabled={!isAgreed}
                        />
                        {/* {PaymentForm()} */}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-12 col-lg-5 col-xl-4 ps-xl-2 position-relative book-summary-section mt-lg-0">
              <article className="detail-card">
                <div className="detail-card-label-area main mt-0">
                  <h5>Your Booking Summary</h5>
                </div>
                <div className="detail-card-info-area mb-1">
                  <div className="detail-card-info-icon-area">
                    <i className="bi bi-building-fill"></i>
                  </div>
                  <div className="detail-card-info-body">
                    <p>Company :</p>
                    <h6>{bookingDetails?.companyName}</h6>
                  </div>
                </div>

                <div className="detail-card-info-area">
                  <div className="detail-card-info-icon-area">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <div className="detail-card-info-body">
                    <p>Location :</p>
                    <h6>{bookingDetails?.airportName}</h6>
                  </div>
                </div>

                <div className="detail-card-row">
                  <div className="detail-card-panel">
                    <div className="detail-card-info-area">
                      <div className="detail-card-info-icon-area">
                        <i className="bi bi-calendar2-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Drop Off Date :</p>
                        <h6>{formatDate(bookingDetails?.dropOffDate)}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="detail-card-panel">
                    <div className="detail-card-info-area">
                      <div className="detail-card-info-icon-area">
                        <i className="bi bi-clock-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Drop Off Time :</p>
                        <h6>{bookingDetails?.dropOffTime}</h6>
                        {/* <h6>{formatTime(bookingDetails?.dropOffTime)}</h6> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-card-row mb-0">
                  <div className="detail-card-panel">
                    <div className="detail-card-info-area">
                      <div className="detail-card-info-icon-area">
                        <i className="bi bi-calendar2-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Return Date :</p>
                        <h6>{formatDate(bookingDetails?.pickUpDate)}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="detail-card-panel">
                    <div className="detail-card-info-area">
                      <div className="detail-card-info-icon-area">
                        <i className="bi bi-clock-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Return Time :</p>
                        <h6>{bookingDetails?.pickupTime}</h6>
                        {/* <h6>{formatTime(bookingDetails?.pickUpTime)}</h6> */}
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="detail-card mt-3 card-position-sticky mb-3 mb-sm-0">
                <div className="detail-card-label-area main mt-0">
                  <h5>{bookingDetails?.serviceType}</h5>
                </div>
                <div className="detail-card-logo-area">
                  <img src={bookingDetails?.companyImg} alt="" />
                  {/* <img src="assets/images/lion-parking.png" alt="" /> */}
                </div>
                <div className="detail-card-label-area">
                  <h5>{bookingDetails?.airportName}</h5>
                </div>

                <div className="total-detail-area">
                  <div className="total-detail">
                    <h5 className="total-detail-head">Booking Quote</h5>
                    <h5 className="total-detail-price">£ {bookingDetails?.bookingQuote}</h5>
                  </div>

                  <Divider className="divider-primary" />

                  <div className="total-detail">
                    <h5 className="total-detail-head">Booking Fee</h5>
                    <h5 className="total-detail-price">£ {bookingCharge?.bookingFee || 0}</h5>
                  </div>

                  {checkedSmsConfirmation && <>
                    <Divider className="divider-primary" />

                    <div className="total-detail">
                      <h5 className="total-detail-head">SMS Confirmation</h5>
                      <h5 className="total-detail-price">£ {bookingCharge?.smsConfirmation || 0}</h5>
                    </div>
                  </>}

                  {(checkedCancellationCover && bookingCharge?.cancellationCover>0) && <>
                    <Divider className="divider-primary" />

                    <div className="total-detail">
                      <h5 className="total-detail-head">Cancellation Cover</h5>
                      <h5 className="total-detail-price">£ {bookingCharge?.cancellationCover}</h5>
                    </div>
                  </>}

                  {((couponCode && couponValid) || !couponCode) && <>
                    <Divider className="divider-primary" />

                    <div className="total-detail">
                      <h5 className="total-detail-head text-bold">
                        Total before discount
                      </h5>
                      {couponCode ? <h5 className="total-detail-price text-bold">£ {bookingCharge?.totalBeforeDiscount || 0}</h5> : <h5 className="total-detail-price text-bold">-</h5>}
                    </div>

                    <Divider className="divider-primary" />

                    <div className="total-detail">
                      <h5 className="total-detail-head">Coupon Discount</h5>
                      {couponCode ? <h5 className="total-detail-price">- {bookingCharge?.couponDiscount || 0} %</h5> : <h5 className="total-detail-price">-</h5>}
                    </div>
                  </>}


                  <Divider className="divider-primary" />

                  <div className="total-detail">
                    <h5 className="total-detail-head text-bold">
                      Total Payable
                    </h5>
                    <h5 className="total-detail-price text-bold">£ {bookingCharge?.totalPayable || 0}</h5>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Booking;