import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Tilt from 'react-parallax-tilt';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';
import { InputOtp } from 'primereact/inputotp';

import { Toast } from 'primereact/toast';
import api from "../../api";
import { sendVerificationEmail, verifyOTP } from "../../utils/authUtil";
import withComponentName from "../../withComponentName";


const Signup = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reSendLoading, setReSendLoading] = useState(false);

  const [otp, setOTP] = useState();
  const [seconds, setSeconds] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [showError, setShowError] = useState(false);
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

  const titles = [
    { name: 'Mr.' },
    { name: 'Mrs.' },
    { name: 'Ms.' },
    { name: 'Miss.' },
  ];

  
   
  const initialSignUpInfo = {
    email: 'pragashconstantine13@gmail.com',
    title: titles[0].name,
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    addressL1: "",
    addressL2: "",
    city: "",
    country: "",
    postCode: "",
    role: "User"
  };
  const [signUpInfo, setSignUpInfo] = useState(initialSignUpInfo);
  const [emailExists, setEmailExist] = useState(false);

  // console.log(signUpInfo);
  const [title, setTitle] = useState(titles[0]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setSignUpInfo({ ...signUpInfo, [name]: value });
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

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    await sendVerificationEmail(
      signUpInfo.email,
      setShowError,
      setLoading,
      setReSendLoading,
      setPage,
      setSeconds,
      setIsButtonDisabled,
      null,
      setSignUpInfo,
      toast
    );
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    await verifyOTP(otp, setShowError, setOTP, signUpInfo.email, setLoading, setPage, toast);
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
    handleVerifyEmail()
  };

  const goBack = () => {
    if (page === 2) {
      setPage(1);
    } else if (page === 3) {
      setPage(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const register = async (signUpInfo) => {
    try {
      const response = await api.post("/api/auth/register", signUpInfo);
      console.log(response.data);
      toast.current.show({
        severity: 'success',
        summary: 'Register Success',
        detail: "You have been registered successfully",
        life: 3000
      });
      // window.location.href = "/sign-in";
      setTimeout(() => {
        navigate("/sign-in")
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: 'error',
        summary: 'Failed to Register',
        detail: err.response.data.error,
        life: 3000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signUpInfo.email || !signUpInfo.firstName || !signUpInfo.password || !signUpInfo.confirmPassword || !signUpInfo.mobileNumber) {
      setShowError(true);
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "Please fill all required fields!",
        life: 3000
      });
      return;
    }
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "Password & Confirm Password do not match!",
        life: 3000
      });
      return;
    }
    if (signUpInfo.password.length < 8) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "Password must be atleast 8 characters long!",
        life: 3000
      });
      return;
    }
    if (!checked) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "You have to agree the Terms & Privacy Policy before Register",
        life: 3000
      });
      return;
    }

    const { confirmPassword, ...updatedSignUpInfo } = signUpInfo;

    await register(updatedSignUpInfo);

    setSignUpInfo(initialSignUpInfo);

  };

  return (
    <>
      <Header />

      {/* Breadcrumb Section Start */}
      <section className="breadcrumb-section overflow-hidden">
        <div className="container-md">
          <div className="row">
            <div className="col-12">
              <h3 className="breadcrumb-title">Sign up</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Sign up
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      {/* Breadcrumb Section End */}

      <Toast ref={toast} />

      {/* Sign up Section Start */}
      <section className="section-padding overflow-hidden">
        <div className="container-md">
          <div className="row">
            <div className="col-12 mb-4 mb-lg-5">
              <h3
                className="section-heading text-center mx-auto text-purple"
                data-aos="zoom-out"
              >
                Sign Up
              </h3>
              <div className="mt-5 mb-2 mb-sm-4">
                <p
                  className="section-paragraph text-center mb-0"
                  data-aos="fade"
                >
                  Join The Parking Deals community today to unlock a world of
                  convenient airport parking solutions. By signing up, you
                  gain access to our secure platform, where you can easily
                  browse and book from a variety of parking options tailored
                  to your travel needs. Whether you prefer short-term
                  convenience or long-term savings, we have the perfect
                  parking solution for you. Don't miss out on exclusive offers
                  and seamless booking experiences—sign up now and simplify
                  your travel plans with The Parking Deals.
                </p>
              </div>
            </div>
          </div>

          {page === 1 ? (
            <div className="row">
              <div className="col-12 col-xl-6 col-lg-6 my-auto">
                <div className="section-main-image-area" data-aos="zoom-out">
                  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                    <img
                      src="assets/images/account/account-verification-pink.svg"
                      className="section-main-image animate-image"
                      alt="Account Verification"
                    />
                  </Tilt>
                </div>
              </div>

              <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                <article className="custom-card" data-aos="fade-up">
                  <div className="custom-card-logo-area">
                    <img
                      src="assets/images/logo.png"
                      className="custom-card-logo"
                      alt="The Parking Deals"
                    />
                  </div>
                  <h3 className="custom-card-tile">Account Verification</h3>
                  <h6 className="custom-card-sub-tile">
                    Enter your email address below for verification
                  </h6>
                  <form action="" className="custom-card-form">
                    <div className="row">
                      <div className="col-12">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="verify_email"
                            className="custom-form-label form-required"
                          >
                            Email
                          </label>
                          <InputText
                            id="verify_email"
                            keyfilter="email"
                            className="custom-form-input"
                            placeholder="Enter your email address"
                            name="email"
                            value={signUpInfo.email}
                            onChange={handleInputChange}
                          />

                          {(showError && !signUpInfo.email) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                          <small className="text-danger form-error-msg">
                            {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                              signUpInfo.email
                            ) && signUpInfo.email
                              ? "Enter valid email"
                              : ""}
                          </small>
                          <small className="text-danger form-error-msg">
                            {emailExists ? "Email already exists" : ""}
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="custom-form-group contains-float-input mb-0">
                      <Button
                        label={`${loading ? "Processing..." : "VERIFY"}`}
                        className="w-100 submit-button justify-content-center"
                        loading={loading}
                        onClick={handleVerifyEmail}
                        disabled={!signUpInfo.email}
                      />
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
                    <img
                      src="assets/images/account/enter-otp-pink.svg"
                      className="section-main-image animate-image"
                      alt="OTP Verification"
                    />
                  </Tilt>
                </div>
              </div>

              <div className="col-12 col-xl-6 col-xxl-6 col-lg-6 col-sm-11 col-md-11 mx-auto">
                <button
                  className="back-page-btn"
                  onClick={goBack}
                  data-aos="fade-left"
                >
                  <i className="ri ri-arrow-left-line me-2"></i>Back
                </button>
                <article className="custom-card" data-aos="fade-up">
                  <div className="custom-card-logo-area">
                    <img
                      src="assets/images/logo.png"
                      className="custom-card-logo"
                      alt="The Parking Deals"
                    />
                  </div>
                  <h3 className="custom-card-tile">OTP Verification</h3>
                  <h6 className="custom-card-sub-tile">
                    Enter the OTP verification code sent to your email address
                  </h6>
                  <form action="" className="custom-card-form">
                    <div className="row">
                      <div className="col-12">
                        <div className="custom-form-group mb-4">
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
                              integerOnly
                            />
                          </div>
                          {(showError && !otp) && (
                            <small className="text-danger form-error-msg text-center mt-3">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="custom-form-group contains-float-input">
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
                      <p>
                        Didn’t received the code?{" "}
                        <button
                          className="custom-form-link"
                          onClick={handleResendCode}
                          disabled={isButtonDisabled}
                        >
                          <b>
                            Resend Code {isButtonDisabled && `(${seconds}s)`}
                          </b>
                        </button>
                      </p>
                    </div>
                  </form>
                </article>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* <div className="col-12 col-xl-6 col-lg-6 my-auto d-lg-none d-xxl-block">
                <div
                  className="section-main-image-area mb-5 mb-sm-5 mb-lg-0"
                  data-aos="zoom-out"
                >
                  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8}>
                    <img
                      src="assets/images/account/signup-pink.svg"
                      className="section-main-image animate-image"
                      alt="Sign up"
                    />
                  </Tilt>
                </div>
              </div> */}

              <div className="col-12 col-xl-9 col-xxl-8 col-lg-11 col-sm-11 col-md-11 mx-auto">
                <button
                  className="back-page-btn"
                  onClick={goBack}
                  data-aos="fade-left"
                >
                  <i className="ri ri-arrow-left-line me-2"></i>Back
                </button>
                <article className="custom-card" data-aos="fade-up">
                  <div className="custom-card-logo-area">
                    <img
                      src="assets/images/logo.png"
                      className="custom-card-logo center-panel-logo"
                      alt="The Parking Deals"
                    />
                  </div>
                  <h3 className="custom-card-tile">Create Your Account</h3>
                  <h6 className="custom-card-sub-tile">
                    Enter the details below
                  </h6>
                  <form action="" className="custom-card-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="row">
                      <div className="col-12 col-sm-3 col-xl-2 col-lg-2 col-md-3">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="title"
                            className="custom-form-label form-required"
                          >
                            Title
                          </label>
                          <Dropdown id="title" value={{name:signUpInfo.title}} onChange={(e) => setSignUpInfo({...signUpInfo, title:e.value?.name})} options={titles} optionLabel="name"
                            placeholder="Select" className="w-full w-100 custom-form-dropdown" />
                          {/* <select id="title" className="custom-form-input"
                            name="title"
                            value={signUpInfo.title}
                            onChange={handleInputChange}
                          >
                            <option value="">Select</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                          </select> */}
                          {(showError && !signUpInfo.title) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-9 col-xl-5 col-lg-5 col-md-9">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="firstName"
                            className="custom-form-label form-required"
                          >
                            First name
                          </label>
                          <InputText
                            id="firstName"
                            className="custom-form-input"
                            name="firstName"
                            value={signUpInfo.firstName}
                            onChange={handleInputChange}
                          />
                          {(showError && !signUpInfo.firstName) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-5 col-lg-5">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="lastName"
                            className="custom-form-label"
                          >
                            Last name
                          </label>
                          <InputText
                            id="lastName"
                            className="custom-form-input"
                            name="lastName"
                            value={signUpInfo.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="email"
                            className="custom-form-label form-required"
                          >
                            Email
                          </label>
                          <InputText
                            id="email"
                            keyfilter="email"
                            className="custom-form-input"
                            value={signUpInfo.email}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="mobileNumber"
                            className="custom-form-label form-required"
                          >
                            Mobile number
                          </label>
                          <InputText
                            id="mobileNumber"
                            keyfilter="num"
                            className="custom-form-input"
                            name="mobileNumber"
                            value={signUpInfo.mobileNumber}
                            onChange={handleInputChange}
                          />
                          {(showError && !signUpInfo.mobileNumber) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                          <small className='text-danger form-error-msg'>{(!(/^\d{9,}$/.test(signUpInfo.mobileNumber)) && signUpInfo.mobileNumber) ? "Enter valid phone number" : ""}</small>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="password"
                            className="custom-form-label form-required"
                          >
                            Password
                          </label>
                          <Password
                            id="password"
                            className="custom-form-input"
                            name="password"
                            value={signUpInfo.password}
                            onChange={handleInputChange}
                            header={header}
                            footer={footer}
                            toggleMask
                          />
                          {(showError && !signUpInfo.password) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                          <small className='text-danger form-error-msg'>{(signUpInfo.password.length < 8 && signUpInfo.password) ? "Password must be atleast 8 characters long" : ""}</small>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group">
                          <label
                            htmlFor="confirmPassword"
                            className="custom-form-label form-required"
                          >
                            Confirm password
                          </label>
                          <Password
                            id="confirmPassword"
                            className="custom-form-input"
                            name="confirmPassword"
                            value={signUpInfo.confirmPassword}
                            onChange={handleInputChange}
                            feedback={false}
                            toggleMask
                          />
                          {(showError && !signUpInfo.confirmPassword) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                          <small className='text-danger text-capitalized form-error-message'>{(signUpInfo.password !== signUpInfo.confirmPassword && signUpInfo.confirmPassword) ? "Password & Confirm Password must be equal" : ""}</small>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="addressLine1"
                            className="custom-form-label form-required"
                          >
                            Address Line 1
                          </label>
                          <InputText
                            id="addressLine1"
                            className="custom-form-input"
                            name="addressL1"
                            value={signUpInfo.addressL1}
                            onChange={handleInputChange}
                            
                          />
                          {(showError && !signUpInfo.addressL1) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-6">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="addressLine2"
                            className="custom-form-label"
                          >
                            Address Line 2
                          </label>
                          <InputText
                            id="addressLine2"
                            className="custom-form-input"
                            name="addressL2"
                            value={signUpInfo.addressL2}
                            onChange={handleInputChange}
                          />
                          {/* {showError && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )} */}
                        </div>
                      </div>

                      {/* <div className="col-12">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="address"
                            className="custom-form-label"
                          >
                            Address
                          </label>
                          <textarea
                            id="address"
                            className="custom-form-input"
                            name="address"
                            value={signUpInfo.address}
                            onChange={handleInputChange}
                          ></textarea>
                          {showError && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div> */}

                      <div className="col-12 col-sm-6 col-xl-4 col-lg-4">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="city"
                            className="custom-form-label form-required"
                          >
                            City
                          </label>
                          <InputText
                            id="city"
                            className="custom-form-input"
                            name="city"
                            value={signUpInfo.city}
                            onChange={handleInputChange}
                          />
                          {(showError && !signUpInfo.city) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-4 col-lg-4">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="country"
                            className="custom-form-label form-required"
                          >
                            Country
                          </label>
                          <InputText
                            id="country"
                            className="custom-form-input"
                            name="country"
                            value={signUpInfo.country}
                            onChange={handleInputChange}
                          />
                          {(showError && !signUpInfo.country) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-sm-6 col-xl-4 col-lg-4">
                        <div className="custom-form-group mb-3 mb-sm-4">
                          <label
                            htmlFor="postcode"
                            className="custom-form-label form-required"
                          >
                            Postcode
                          </label>
                          <InputText
                            id="postcode"
                            className="custom-form-input"
                            name="postCode"
                            value={signUpInfo.postCode}
                            onChange={handleInputChange}
                          />
                          {(showError && !signUpInfo.postCode) && (
                            <small className="text-danger form-error-msg">
                              This field is required
                            </small>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="custom-form-group contains-float-input">
                      <div className="custom-check-group">
                        <div className="custom-check-area">
                          <Checkbox
                            inputId="rememberMe"
                            onChange={(e) => setChecked(e.checked)}
                            checked={checked}
                          ></Checkbox>
                          <label
                            htmlFor="rememberMe"
                            className="custom-check-label"
                          >
                            By checking this, you will agree to our{" "}
                            <a href="/terms-and-conditions" target="_blank">
                              Terms
                            </a>{" "}
                            and{" "}
                            <a href="/privacy-policy" target="_blank">
                              {" "}
                              Privacy policy
                            </a>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="custom-form-group contains-float-input">
                      <Button
                        label="SIGNUP"
                        disabled={!checked}
                        className="w-100 submit-button justify-content-center"
                        loading={loading}
                      />
                    </div>

                    <div className="custom-form-link-area text-center">
                      <p>
                        Already have account?{" "}
                        <a href="/sign-in" className="custom-form-link">
                          <b>Sign in</b>
                        </a>
                      </p>
                    </div>
                  </form>
                </article>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Sign up Section End */}

      <Footer />
    </>
  );
}

export default withComponentName(Signup, 'Signup');