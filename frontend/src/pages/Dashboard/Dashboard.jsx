import React, { useState, useEffect, useRef } from "react";
import './Dashboard.css';
import './Dashboard-responsive.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Tooltip } from 'bootstrap';
import SmoothScroll from 'smooth-scroll';

import { Ripple } from 'primereact/ripple';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Panel } from 'primereact/panel';
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from 'primereact/fileupload';
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setLogout } from "../../state";
import { Toast } from 'primereact/toast';
import api from "../../api";

const Dashboard = () => {
    const ref = useRef(null);
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [showError, setShowError] = useState(false);
    const [showEditArea, setShowEditArea] = useState(false);

    const logOut = () => {
        confirmDialog({
            message: 'Are you sure you want to log out?',
            header: 'Logout Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                dispatch(setLogout());
            },
        });
    }
    

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    }, []);

    const titles = [
        { name: 'Mr.' },
        { name: 'Mrs.' },
        { name: 'Ms.' },
        { name: 'Miss.' },
    ];
    const [title, setTitle] = useState(titles[0]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [addressL1, setAddressL1] = useState('');
    const [addressL2, setAddressL2] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postCode, setPostCode] = useState('');

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [imgFile, setImgFile] = useState();
    const [loading, setLoading] = useState(false);

    const initialUserInfo = {
        title: user?.title || titles[0].name,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        mobileNumber: user?.mobileNumber || "",
        addressL1: user?.addressL1 || "",
        addressL2: user?.addressL2 || "",
        city: user?.city || "",
        country: user?.country || "",
        postCode: user?.postCode || "",
      };

      const [userInfo, setUserInfo] = useState(initialUserInfo);

      
      const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
        
    };

    const onUpload = (event) => {
        const uploadedFiles = event.files;
        console.log(uploadedFiles);
        if (uploadedFiles.length > 0) {
            const file = uploadedFiles[0];
            
        }
    };

    const dpUploadHandler = ({files}) => {
        const [file] = files;
        console.log(file);
        setImgFile(file);
        // const fileReader = new FileReader();
        // fileReader.onload = (e) => {
        //     setFile(e.target.result);
        // };
        // fileReader.readAsDataURL(file);
    };

    

    const updatingUserInfo = async(info) => {
        setLoading(true);
        try {
            const response = await api.put("/api/user/update-user-info", info, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            toast.current.show({
                severity: 'success',
                summary: 'User Info Updated',
                detail: "Your user info has been updated successfully",
                life: 3000
            });
            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token
                })
            );
        } catch (err) {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Error in UserInfo Update',
                detail: err.response.data.error,
                life: 3000
            });
        } finally{
            setLoading(false);
        }
    };
    
    const handleProfileUpdate = () => {
        if (!userInfo.firstName || !userInfo.mobileNumber || !userInfo.title || !userInfo.addressL1 || !userInfo.city || !userInfo.country || !userInfo.postCode) {
            setShowError(true);
            toast.current.show({
                severity: 'error',
                summary: 'Error in Submission',
                detail: "Please fill all required fields!",
                life: 3000
            });
            return;
        }
    
        let formData = new FormData();
        formData.append('title', userInfo.title);
        formData.append('firstName', userInfo.firstName);
        formData.append('lastName', userInfo.lastName);
        formData.append('mobileNumber', userInfo.mobileNumber);
        formData.append('addressL1', userInfo.addressL1);
        formData.append('addressL2', userInfo.addressL2);
        formData.append('city', userInfo.city);
        formData.append('country', userInfo.country);
        formData.append('postCode', userInfo.postCode);
    
        if (imgFile) {
            formData.append('dp', imgFile);
        }
    
        updatingUserInfo(formData);
    };
    
    const togglePanel = (e) => {
        setShowEditArea(!showEditArea);
        ref.current.toggle();
        if (showEditArea) {
            e.preventDefault();
            const scroll = new SmoothScroll();
            scroll.animateScroll(ref.current, null, { offset: 100 });
            setShowEditArea(!showEditArea);
        }
    };

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

            <ConfirmDialog />

            {/* Profile section */}
            <section className="section-padding dashboard-section">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-3">
                            <div className="nav dashboard-tab-area tabs panel-sticky" id="dashboard-tab" role="tablist" aria-orientation="vertical">
                                <button className="nav-link dashboard-tab-link p-ripple active" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="true">
                                    <i className="bi bi-person-fill me-3"></i>
                                    Profile
                                    <Ripple />
                                </button>
                                <button className="nav-link dashboard-tab-link p-ripple" id="v-pills-bookings-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bookings" type="button" role="tab" aria-controls="v-pills-bookings" aria-selected="false">
                                    <i className="bi bi-calendar2-check-fill me-3"></i>
                                    My Bookings
                                    <Ripple />
                                </button>
                            </div>
                        </div>

                        <div className="col-12 col-xl-9">
                            <div className="dashboard-tab-area tab-content" id="dashboard-tabContent">
                                <div className="tab-pane dashboard-tab-content fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab" tabindex="0">
                                    <article className="dashboard-profile-card">
                                        <div className="dashboard-profile-head">
                                            <h5>Profile</h5>
                                            <a href="#editProfile" className="prfile-edit-btn" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title={`${showEditArea ? 'Cancel' : 'Edit Profile'}`}
                                                onClick={togglePanel}>
                                                <i className={`bi ${showEditArea ? 'bi-x-lg text-danger' : 'bi-pencil-square'}`}></i>
                                            </a>
                                        </div>
                                        <div className="dashboard-profile-container">
                                            <div className="row">
                                                <div className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-3 my-auto mx-auto h-100">
                                                    <div className="dashboard-profile-image-area">
                                                        {user?.dp && <Image src={user?.dp} className='dashboard-profile-img' alt="Image" preview />}

                                                        {/* if no image */}
                                                        {!user?.dp && <img src="assets/images/user.png" className='dashboard-profile-no-img' alt="" />}
                                                        {/*  */}

                                                    </div>
                                                </div>
                                                <div className="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-9 dash-tab-divider">
                                                    <div className="dashboard-profile-detail-area">
                                                        <div className="dashboard-profile-detail">
                                                            <h6 className="dashboard-profile-detail-title">
                                                                <i className="bi bi-person-lines-fill"></i>
                                                                Name :
                                                            </h6>
                                                            <h6 className="dashboard-profile-content">
                                                                {user?.title}. {user?.firstName} {user?.lastName}
                                                            </h6>
                                                        </div>

                                                        {/* <Divider className='mt-3' /> */}
                                                        <div className="dashboard-profile-detail">
                                                            <h6 className="dashboard-profile-detail-title">
                                                                <i className="bi bi-telephone-fill"></i>
                                                                Mobile No. :
                                                            </h6>
                                                            <h6 className="dashboard-profile-content">
                                                                {user?.mobileNumber}
                                                            </h6>
                                                        </div>

                                                        <div className="dashboard-profile-detail">
                                                            <h6 className="dashboard-profile-detail-title">
                                                                <i className="bi bi-envelope-fill"></i>
                                                                Email :
                                                            </h6>
                                                            <h6 className="dashboard-profile-content">
                                                                {user?.email}
                                                            </h6>
                                                        </div>

                                                        <div className="dashboard-profile-detail mb-0">
                                                            <h6 className="dashboard-profile-detail-title">
                                                                <i className="bi bi-geo-alt-fill"></i>
                                                                Address :
                                                            </h6>
                                                            <h6 className="dashboard-profile-content">
                                                                {user?.addressL1 || "-"} {user?.addressL2}
                                                            </h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dashboard-profile-footer">
                                            <Button label="Change Password" icon="bi bi-lock" className="primary dashboard-action-btn" text />
                                            <Button label="Logout" onClick={logOut} severity="danger" icon="bi bi-box-arrow-right" className="dashboard-action-btn" text />
                                        </div>
                                    </article>

                                    <Toast ref={toast} />

                                    <Panel ref={ref} id="editProfile" header="Edit Profile" className="mt-3 edit-profile-section" toggleable collapsed>
                                        <div className="edit-profile-area">
                                            <div className="row">
                                                <div className="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                                    <div className="custom-form-group mb-3 mb-sm-4">
                                                        <label htmlFor="title" className="custom-form-label">
                                                            Profile Picture
                                                        </label>
                                                        {/* <FileUpload
                                                            mode="basic"
                                                            name="demo[]"
                                                            accept="image/*"
                                                            maxFileSize={5000000}
                                                            className="profil-img-upload"
                                                            // onUpload={onUpload}
                                                            auto
                                                            chooseLabel="Browse"
                                                        /> */}
                                                        <FileUpload name="dp"
                                                            accept="image/*"
                                                            customUpload={true}
                                                            uploadHandler={dpUploadHandler}
                                                            mode="basic"
                                                            auto={true}
                                                            chooseLabel="Browse"/>
                                                        {/* {showError && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2">
                                                    <div className="custom-form-group mb-3 mb-sm-4">
                                                        <label htmlFor="title" className="custom-form-label form-required">
                                                            Title
                                                        </label>
                                                        <Dropdown
                                                            id="title"
                                                            value={{ name: userInfo.title }}
                                                            onChange={(e) => setUserInfo({ ...userInfo, title: e.value?.name })}
                                                            options={titles}
                                                            optionLabel="name"
                                                            placeholder="Select"
                                                            className="w-full w-100 custom-form-dropdown"
                                                        />
                                                        {showError && !userInfo.title && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
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
                                                            value={userInfo.firstName}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError && !userInfo.firstName && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
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
                                                            value={userInfo.lastName}
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
                                                            value={userInfo.mobileNumber}
                                                            onChange={handleInputChange}
                                                        ></InputMask> */}
                                                        <InputText
                                                            id="mobileNumber"
                                                            keyfilter="num"
                                                            className="custom-form-input"
                                                            name="mobileNumber"
                                                            value={userInfo.mobileNumber}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError && !userInfo.mobileNumber && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                        <small className='text-danger form-error-msg'>{(!(/^\d{9,}$/.test(userInfo.mobileNumber)) && userInfo.mobileNumber) ? "Enter valid phone number" : ""}</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-12">
                                                    <label
                                                        htmlFor="address"
                                                        className="custom-form-label form-required"
                                                    >
                                                        Address
                                                    </label>
                                                </div>

                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="custom-form-group mb-3 mb-sm-4">
                                                        <InputText
                                                            id="addressL1"
                                                            className="custom-form-input"
                                                            name="addressL1"
                                                            placeholder="Address Line 1"
                                                            value={userInfo.addressL1}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError && !userInfo.addressL1 && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                                                    <div className="custom-form-group mb-3 mb-sm-0">
                                                        <InputText
                                                            id="addressL2"
                                                            className="custom-form-input"
                                                            name="addressL2"
                                                            placeholder="Address Line 2"
                                                            value={userInfo.addressL2}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                                    <div className="custom-form-group mb-3 mb-sm-0">
                                                        <InputText
                                                            id="city"
                                                            className="custom-form-input   form-required"
                                                            name="city"
                                                            placeholder="City"
                                                            value={userInfo.city}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError && !userInfo.city && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-4">
                                                    <div className="custom-form-group mb-3 mb-sm-0">
                                                        <InputText
                                                            id="country"
                                                            className="custom-form-input"
                                                            name="country"
                                                            placeholder="Country"
                                                            value={userInfo.country}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError  && !userInfo.country && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-3 col-md-3 col-lg-4 col-xl-4">
                                                    <div className="custom-form-group mb-0">
                                                        <InputText
                                                            id="postCode"
                                                            className="custom-form-input"
                                                            name="postCode"
                                                            placeholder="Post Code"
                                                            value={userInfo.postCode}
                                                            onChange={handleInputChange}
                                                        />
                                                        {showError && !userInfo.postCode && (
                                                            <small className="text-danger form-error-msg">
                                                                This field is required
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <Divider className="divider-margin mt-3 mb-3 mt-sm-4 mb-sm-4" />

                                            <div className="row">
                                                <div className="col-12 mx-auto me-0 col-lg-3 col-xl-3 col-md-4 col-sm-4">
                                                    <Button
                                                        label="Update"
                                                        className="custom-btn-primary w-100 result-card-btn"
                                                        onClick={handleProfileUpdate}
                                                        loading={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                </div>
                                <div className="tab-pane dashboard-tab-content fade" id="v-pills-bookings" role="tabpanel" aria-labelledby="v-pills-bookings-tab" tabindex="0">
                                </div>
                            </div>

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