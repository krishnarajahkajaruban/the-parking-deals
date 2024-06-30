import React, { useState, useEffect } from 'react';
import './VendorList.css';
import './VendorList-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Tooltip } from 'bootstrap';

import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Rating } from "primereact/rating";


const VendorList = () => {
    const [loading, setLoading] = useState(false);
    const [dropOffDate, setDropOffDate] = useState(null);
    const [pickupDate, setPickupDate] = useState(null);
    const [showError, setShowError] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState(null);
    const today = new Date();
    const [dropOffTime, setDropOffTime] = useState(null);
    const [pickupTime, setPickupTime] = useState(null);

    const airports = [
        { name: 'Birmingham Airport' },
        { name: 'Bristol Airport' },
        { name: 'Gatwick Airport' },
        { name: 'Heathrow Airport' },
        { name: 'Liverpool Airport' },
        { name: 'Luton Airport' },
        { name: 'Stansted Airport' },
        { name: 'Manchester Airport' },
        { name: 'Southend Airport' }
    ];

    const selectedAirportTemplate = (option, props) => {
        if (option) {
            return (
                <div className="">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const airportOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const parking_options = [
        { name: 'All Parking' },
        { name: 'Meet and Greet' },
        { name: 'Park and Ride' },
    ];

    const filter_options = [
        { name: 'Recommended' },
        { name: 'Price: Low to High' },
        { name: 'Price: High to Low' },
    ];

    const [parkingOption, setParkingOption] = useState(parking_options[0]);
    const [filterOption, setFilterOption] = useState(filter_options[0]);

    const handleDropOffDateChange = (e) => {
        const newDropOffDate = e.value;
        setDropOffDate(newDropOffDate);

        if (newDropOffDate) {
            const newPickupDate = new Date(newDropOffDate);
            newPickupDate.setDate(newPickupDate.getDate() + 7);
            setPickupDate(newPickupDate);
        } else {
            setPickupDate(null);
        }
    };

    const handleEditSearch = () => {
        setLoading(true);
        setShowError(true);

        setTimeout(() => {
            setLoading(false);
            setShowError(false);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    }

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    }, []);
    return (
        <>
            <Header />

            {/* Breadcrumb Section Start */}
            <section className="breadcrumb-section overflow-hidden">
                <div className="container-md">
                    <div className="row">
                    </div>
                </div>
            </section>
            {/* Breadcrumb Section End */}

            <section className='results-option-section' data-aos="fade-up">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="results-option-area">
                                <div className="custom-card-form form-2 results-option-form mt-0 p-4">
                                    {/* <button className='edit-float-btn' onClick={() => setVisible(true)}>
                                        <i class="bi bi-pencil-square"></i>
                                    </button> */}
                                    <Button icon="bi bi-pencil-square" className='edit-float-btn' data-bs-toggle="modal" data-bs-target="#editSearchModal" />
                                    <div className="row">
                                        <div className="col-12 col-xl-6 col-lg-6 col-md-8 col-sm-8 mx-auto">
                                            <div className="custom-form-group mb-0 input-with-icon">
                                                <label htmlFor="airport" className="custom-form-label text-sm-center">Airport</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-airplane-fill input-grp-icon"></i>
                                                    <Dropdown id='airport' value={selectedAirport} onChange={(e) => setSelectedAirport(e.value)} options={airports} optionLabel="name" placeholder="Select a Airport"
                                                        filter valueTemplate={selectedAirportTemplate} itemTemplate={airportOptionTemplate} className="w-full w-100 custom-form-dropdown" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Divider className='mt-4 mb-4' />
                                        </div>

                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                                                    <div className="results-option-data-area">
                                                        <h5>Dropoff Detail</h5>
                                                        <div className="row">
                                                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                                                <h6 data-bs-toggle="modal" data-bs-target="#editSearchModal">
                                                                    <i class="bi bi-calendar-check-fill me-2"></i>
                                                                    12/06/2024
                                                                </h6>
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <h6 data-bs-toggle="modal" data-bs-target="#editSearchModal">
                                                                    <i class="bi bi-clock-fill me-2"></i>
                                                                    11:20
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6">
                                                    <div className="results-option-data-area">
                                                        <h5>Pickup Detail</h5>
                                                        <div className="row">
                                                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                                                <h6 data-bs-toggle="modal" data-bs-target="#editSearchModal">
                                                                    <i class="bi bi-calendar-check-fill me-2"></i>
                                                                    12/06/2024
                                                                </h6>
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <h6 data-bs-toggle="modal" data-bs-target="#editSearchModal">
                                                                    <i class="bi bi-clock-fill me-2"></i>
                                                                    11:20
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Divider className='mt-4 mb-4' />
                                        </div>

                                        <div className="col-12 col-xl-8 col-lg-10 mx-auto">
                                            <div className="row">
                                                <div className="col-12 col-sm-6">
                                                    <div className="custom-form-group mb-3 mb-md-0 input-with-icon">
                                                        <div className="form-icon-group">
                                                            <i class="bi bi-p-square input-grp-icon"></i>
                                                            <Dropdown value={parkingOption} onChange={(e) => setParkingOption(e.value)} options={parking_options} optionLabel="name"
                                                                placeholder="Select Parking Option" className="w-full w-100 custom-form-dropdown" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6">
                                                    <div className="custom-form-group mb-3 mb-md-0 input-with-icon">
                                                        <div className="form-icon-group">
                                                            <i class="bi bi-arrow-down-up input-grp-icon"></i>
                                                            <Dropdown value={filterOption} onChange={(e) => setFilterOption(e.value)} options={filter_options} optionLabel="name"
                                                                placeholder="Select Parking Option" className="w-full w-100 custom-form-dropdown" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            <section className='section-padding results-section overflow-hidden'>
                <div className="container-md">
                    <div className="row result-card-view-row">
                        <div className="col-12 col-lg-6 col-sm-10 mx-auto" data-aos="fade-up">
                            <article className='result-card'>
                                <div className="result-card-label-area">
                                    <h5>Meet and Greet</h5>
                                </div>
                                <div className="result-card-head-area">
                                    <div className="result-card-logo-area">
                                        <img src="assets/images/lion-parking.png" alt="" />
                                    </div>
                                    <div className="result-card-head-detail-area">
                                        <h4 className='result-card-head'>Lion Parking</h4>
                                        <div className="result-card-star-area">
                                            <Rating value={4} readOnly cancel={false} />
                                        </div>
                                        <h3 className='result-card-price'>
                                            £ 76.78
                                            <span className='cut-price ms-3'>
                                                £ 83.00
                                            </span>
                                        </h3>
                                        <div className='result-card-sub'>
                                            <p>
                                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                                Save <span>£ 6.23</span> Today
                                            </p>

                                            <p>
                                                <i class="bi bi-lightning-fill me-2"></i>
                                                Cancellation Cover Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="result-card-body-area">
                                    <ul>
                                        <li>Airport Access Fee not Included.</li>
                                        <li>Uniformed & CRB Checked Staff.</li>
                                        <li>Disabled & Family Friendly.</li>
                                        <li>Meet & Greet at LHR Terminals.</li>
                                        <li>Affordable Price</li>
                                        <li>Friendly drivers and excellent customer service</li>
                                    </ul>
                                </div>
                                <div className="result-card-footer-area">

                                    <Divider className='mt-3 mb-3' />
                                    <div className="result-card-feature-area">
                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Secure Barrier">
                                            <img src="assets/images/features/secure-barrier.png"
                                                alt="Secure Barrier" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Disability">
                                            <img src="assets/images/features/disability.png"
                                                alt="Disability" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="CCTV Cameras">
                                            <img src="assets/images/features/cctv-camera.png"
                                                alt="CCTV Cameras" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Fencing">
                                            <img src="assets/images/features/fence.png"
                                                alt="Fencing" />
                                        </div>
                                    </div>
                                    <Divider className='mt-3 mb-3' />

                                    <div className="result-card-btn-area">
                                        <Button label="VIEW" severity="secondary" className="result-card-btn" data-bs-toggle="modal" data-bs-target="#vendorDetailModal" />
                                        <Button label="BOOK" className="custom-btn-primary result-card-btn" />
                                    </div>

                                    <div className="result-card-status-area">
                                        <p>
                                            <i className='bi bi-eye-fill me-2'></i>
                                            13 Currently Viewing
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className="col-12 col-lg-6 col-sm-10 mx-auto" data-aos="fade-up">
                            <article className='result-card'>
                                <div className="result-card-label-area">
                                    <h5>Meet and Greet</h5>
                                </div>
                                <div className="result-card-head-area">
                                    <div className="result-card-logo-area">
                                        <img src="assets/images/lion-parking.png" alt="" />
                                    </div>
                                    <div className="result-card-head-detail-area">
                                        <h4 className='result-card-head'>Lion Parking</h4>
                                        <div className="result-card-star-area">
                                            <Rating value={4} readOnly cancel={false} />
                                        </div>
                                        <h3 className='result-card-price'>
                                            £ 76.78
                                            <span className='cut-price ms-3'>
                                                £ 83.00
                                            </span>
                                        </h3>
                                        <div className='result-card-sub'>
                                            <p>
                                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                                Save <span>£ 6.23</span> Today
                                            </p>

                                            <p>
                                                <i class="bi bi-lightning-fill me-2"></i>
                                                Cancellation Cover Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="result-card-body-area">
                                    <ul>
                                        <li>Airport Access Fee not Included.</li>
                                        <li>Uniformed & CRB Checked Staff.</li>
                                        <li>Disabled & Family Friendly.</li>
                                        <li>Meet & Greet at LHR Terminals.</li>
                                        <li>Affordable Price</li>
                                        <li>Friendly drivers and excellent customer service</li>
                                    </ul>
                                </div>
                                <div className="result-card-footer-area">

                                    <Divider className='mt-3 mb-3' />
                                    <div className="result-card-feature-area">
                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Secure Barrier">
                                            <img src="assets/images/features/secure-barrier.png"
                                                alt="Secure Barrier" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Disability">
                                            <img src="assets/images/features/disability.png"
                                                alt="Disability" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="CCTV Cameras">
                                            <img src="assets/images/features/cctv-camera.png"
                                                alt="CCTV Cameras" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Fencing">
                                            <img src="assets/images/features/fence.png"
                                                alt="Fencing" />
                                        </div>
                                    </div>
                                    <Divider className='mt-3 mb-3' />

                                    <div className="result-card-btn-area">
                                        <Button label="VIEW" severity="secondary" className="result-card-btn" data-bs-toggle="modal" data-bs-target="#vendorDetailModal" />
                                        <Button label="BOOK" className="custom-btn-primary result-card-btn" />
                                    </div>

                                    <div className="result-card-status-area">
                                        <p>
                                            <i className='bi bi-eye-fill me-2'></i>
                                            13 Currently Viewing
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className="col-12 col-lg-6 col-sm-10 mx-auto" data-aos="fade-up">
                            <article className='result-card'>
                                <div className="result-card-label-area">
                                    <h5>Meet and Greet</h5>
                                </div>
                                <div className="result-card-head-area">
                                    <div className="result-card-logo-area">
                                        <img src="assets/images/lion-parking.png" alt="" />
                                    </div>
                                    <div className="result-card-head-detail-area">
                                        <h4 className='result-card-head'>Lion Parking</h4>
                                        <div className="result-card-star-area">
                                            <Rating value={4} readOnly cancel={false} />
                                        </div>
                                        <h3 className='result-card-price'>
                                            £ 76.78
                                            <span className='cut-price ms-3'>
                                                £ 83.00
                                            </span>
                                        </h3>
                                        <div className='result-card-sub'>
                                            <p>
                                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                                Save <span>£ 6.23</span> Today
                                            </p>

                                            <p>
                                                <i class="bi bi-lightning-fill me-2"></i>
                                                Cancellation Cover Available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="result-card-body-area">
                                    <ul>
                                        <li>Airport Access Fee not Included.</li>
                                        <li>Uniformed & CRB Checked Staff.</li>
                                        <li>Disabled & Family Friendly.</li>
                                        <li>Meet & Greet at LHR Terminals.</li>
                                        <li>Affordable Price</li>
                                        <li>Friendly drivers and excellent customer service</li>
                                    </ul>
                                </div>
                                <div className="result-card-footer-area">

                                    <Divider className='mt-3 mb-3' />
                                    <div className="result-card-feature-area">
                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Secure Barrier">
                                            <img src="assets/images/features/secure-barrier.png"
                                                alt="Secure Barrier" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Disability">
                                            <img src="assets/images/features/disability.png"
                                                alt="Disability" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="CCTV Cameras">
                                            <img src="assets/images/features/cctv-camera.png"
                                                alt="CCTV Cameras" />
                                        </div>

                                        <div className="result-card-feature" data-bs-toggle="tooltip" data-bs-placement="top" title="Fencing">
                                            <img src="assets/images/features/fence.png"
                                                alt="Fencing" />
                                        </div>
                                    </div>
                                    <Divider className='mt-3 mb-3' />

                                    <div className="result-card-btn-area">
                                        <Button label="VIEW" severity="secondary" className="result-card-btn" data-bs-toggle="modal" data-bs-target="#vendorDetailModal" />
                                        <Button label="BOOK" className="custom-btn-primary result-card-btn" />
                                    </div>

                                    <div className="result-card-status-area">
                                        <p>
                                            <i className='bi bi-eye-fill me-2'></i>
                                            13 Currently Viewing
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* quote form modal */}
            <div class="modal fade" id="editSearchModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="editSearchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content custom-modal">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="editSearchModalLabel">Edit your search</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form action="" className="custom-card-form form-2 get-quote-form p-3 mt-0">
                                <div className="form-head-input-area">
                                    <div className="row">
                                        <div className="col-12 col-xl-8 col-lg-6 mx-auto">
                                            <div className="custom-form-group mb-0 input-with-icon">
                                                <label htmlFor="airport" className="custom-form-label form-required text-sm-center">Select airport</label>
                                                <div className="form-icon-group">
                                                    <i class="bi bi-airplane-fill input-grp-icon"></i>
                                                    <Dropdown id='airport' value={selectedAirport} onChange={(e) => setSelectedAirport(e.value)} options={airports} optionLabel="name" placeholder="Select a Airport"
                                                        filter valueTemplate={selectedAirportTemplate} itemTemplate={airportOptionTemplate} className="w-full w-100 custom-form-dropdown" invalid={showError} />
                                                </div>
                                                {showError &&
                                                    <small className="text-danger form-error-msg text-sm-center">This field is required</small>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <Divider className='mt-4 mb-4' />
                                    </div>

                                    <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                                        <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                            <label htmlFor="dropOffDate" className="custom-form-label form-required">Drop off date</label>
                                            <div className="form-icon-group">
                                                <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                                                <Calendar id="dropOffDate" value={dropOffDate} onChange={handleDropOffDateChange} placeholder='dd/mm/yyyy' minDate={today} className='w-100' invalid={showError} />
                                            </div>
                                            {showError &&
                                                <small className="text-danger form-error-msg">This field is required</small>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                                        <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                            <label htmlFor="dropOffTime" className="custom-form-label form-required">Drop off time</label>
                                            <div className="form-icon-group">
                                                <i class="bi bi-clock-fill input-grp-icon"></i>
                                                <Calendar id="dropOffTime" className='w-100' value={dropOffTime} onChange={(e) => setDropOffTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} />
                                            </div>
                                            {showError &&
                                                <small className="text-danger form-error-msg">This field is required</small>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                                        <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                            <label htmlFor="pickupDate" className="custom-form-label form-required">Pickup date</label>
                                            <div className="form-icon-group">
                                                <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                                                <Calendar id="pickupDate" value={pickupDate} onChange={(e) => setPickupDate(e.value)} placeholder='dd/mm/yyyy' minDate={dropOffDate} disabled={!dropOffDate} className='w-100' invalid={showError} />
                                            </div>
                                            {showError &&
                                                <small className="text-danger form-error-msg">This field is required</small>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                                        <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                                            <label htmlFor="pickupTime" className="custom-form-label form-required">Pickup time</label>
                                            <div className="form-icon-group">
                                                <i class="bi bi-clock-fill input-grp-icon"></i>
                                                <Calendar id="pickupTime" className='w-100' value={pickupTime} onChange={(e) => setPickupTime(e.value)} placeholder='hh:mm' timeOnly invalid={showError} />
                                            </div>
                                            {showError &&
                                                <small className="text-danger form-error-msg">This field is required</small>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-11 col-xl-6 col-lg-6 mx-auto">
                                        <div className="custom-form-group mb-2 mb-sm-2 input-with-icon">
                                            <label htmlFor="couponCode" className="custom-form-label form-required text-lg-center">Coupon Code</label>
                                            <div className="form-icon-group">
                                                <i class="bi bi-gift-fill input-grp-icon"></i>
                                                <InputText id="couponCode" className="custom-form-input" placeholder='Enter promo code' invalid={showError} />
                                            </div>
                                            {showError &&
                                                <small className="text-danger form-error-msg text-sm-center">This field is required</small>
                                            }
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <Divider className='mb-4' />
                                    </div>
                                </div>

                                <div className="custom-form-group contains-float-input d-flex justify-content-center mb-0">
                                    <Button label="SUBMIT" className="submit-button justify-content-center btn-width" loading={loading} onClick={handleEditSearch} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}

            {/* vendor detail modal */}
            <div class="modal fade" id="vendorDetailModal" tabindex="-1" aria-labelledby="vendorDetailModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                    <div class="modal-content custom-modal">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="vendorDetailModalLabel">Lion Parking</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-0 p-3">
                            <ul class="nav nav-tabs tab-detail-tabs mt-3" id="companyDetailTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview-tab-pane" type="button" role="tab" aria-controls="overview-tab-pane" aria-selected="true">
                                        Overview
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="drop-off-procedure-tab" data-bs-toggle="tab" data-bs-target="#drop-off-procedure-tab-pane" type="button" role="tab" aria-controls="drop-off-procedure-tab-pane" aria-selected="false">
                                        Drop-Off Procedure
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="return-procedure-tab" data-bs-toggle="tab" data-bs-target="#return-procedure-tab-pane" type="button" role="tab" aria-controls="return-procedure-tab-pane" aria-selected="false">
                                        Return Procedure
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="view-map-tab" data-bs-toggle="tab" data-bs-target="#view-map-tab-pane" type="button" role="tab" aria-controls="view-map-tab-pane" aria-selected="false">
                                        View Map
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="photos-tab" data-bs-toggle="tab" data-bs-target="#photos-tab-pane" type="button" role="tab" aria-controls="photos-tab-pane" aria-selected="false">
                                        Photos
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews-tab-pane" type="button" role="tab" aria-controls="reviews-tab-pane" aria-selected="false">
                                        Reviews
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link tab-detail-btn" id="terms-conditions-tab" data-bs-toggle="tab" data-bs-target="#terms-conditions-tab-pane" type="button" role="tab" aria-controls="terms-conditions-tab-pane" aria-selected="false">
                                        Terms & Conditions
                                    </button>
                                </li>
                            </ul>
                            <div className="row">
                                <div className="col-12 col-xl-8 pe-xl-2">
                                    <article class="tab-content tab-detail-area mt-3" id="companyDetailTabContent">
                                        <div class="tab-pane tab-detail-content fade show active" id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab" tabindex="0">...</div>

                                        <div class="tab-pane tab-detail-content fade" id="drop-off-procedure-tab-pane" role="tabpanel" aria-labelledby="drop-off-procedure-tab" tabindex="0">...</div>

                                        <div class="tab-pane tab-detail-content fade" id="return-procedure-tab-pane" role="tabpanel" aria-labelledby="return-procedure-tab" tabindex="0">...</div>

                                        <div class="tab-pane tab-detail-content fade" id="view-map-tab-pane" role="tabpanel" aria-labelledby="view-map-tab" tabindex="0">
                                            <div className="tab-detail-map-view-area">
                                                <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=London+(The%20Parking%20Deals)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                                                </iframe>
                                            </div>
                                        </div>

                                        <div class="tab-pane tab-detail-content fade" id="photos-tab-pane" role="tabpanel" aria-labelledby="photos-tab" tabindex="0">...</div>

                                        <div class="tab-pane tab-detail-content fade" id="reviews-tab-pane" role="tabpanel" aria-labelledby="reviews-tab" tabindex="0">
                                            <div className="tab-detail-content-area">
                                                <article className='review-data-area'>
                                                    <div className="review-data-header-area">
                                                        <div className="review-avatar-image-area">
                                                            <img src="assets/images/user.png" alt="" />
                                                        </div>
                                                        <div className='w-100'>
                                                            <h5>Maddy P</h5>
                                                            <div className="review-data-rating">
                                                                <Rating value={4} readOnly cancel={false} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-data-body">
                                                        <p>
                                                            The team are polite, efficient and lovely. No issues whatsoever, they even called me proactively to check we were on track and all okay. Thank you, will definitely use again.
                                                        </p>
                                                    </div>
                                                </article>

                                                <article className='review-data-area'>
                                                    <div className="review-data-header-area">
                                                        <div className="review-avatar-image-area">
                                                            <img src="assets/images/user.png" alt="" />
                                                        </div>
                                                        <div className='w-100'>
                                                            <h5>Maddy P</h5>
                                                            <div className="review-data-rating">
                                                                <Rating value={4} readOnly cancel={false} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-data-body">
                                                        <p>
                                                            The team are polite, efficient and lovely. No issues whatsoever, they even called me proactively to check we were on track and all okay. Thank you, will definitely use again.
                                                        </p>
                                                    </div>
                                                </article>

                                                <article className='review-data-area'>
                                                    <div className="review-data-header-area">
                                                        <div className="review-avatar-image-area">
                                                            <img src="assets/images/user.png" alt="" />
                                                        </div>
                                                        <div className='w-100'>
                                                            <h5>Maddy P</h5>
                                                            <div className="review-data-rating">
                                                                <Rating value={4} readOnly cancel={false} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-data-body">
                                                        <p>
                                                            The team are polite, efficient and lovely. No issues whatsoever, they even called me proactively to check we were on track and all okay. Thank you, will definitely use again.
                                                        </p>
                                                    </div>
                                                </article>

                                                <article className='review-data-area'>
                                                    <div className="review-data-header-area">
                                                        <div className="review-avatar-image-area">
                                                            <img src="assets/images/user.png" alt="" />
                                                        </div>
                                                        <div className='w-100'>
                                                            <h5>Maddy P</h5>
                                                            <div className="review-data-rating">
                                                                <Rating value={4} readOnly cancel={false} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-data-body">
                                                        <p>
                                                            The team are polite, efficient and lovely. No issues whatsoever, they even called me proactively to check we were on track and all okay. Thank you, will definitely use again.
                                                        </p>
                                                    </div>
                                                </article>

                                                {/*  */}
                                                {/* <div className="no-data-area">
                                                    <img src="assets/images/no-data/no-data-found.png" className='no-data-img' alt="" />
                                                    <h4>No review data!</h4>
                                                </div> */}
                                                {/*  */}
                                            </div>
                                        </div>

                                        <div class="tab-pane tab-detail-content fade" id="terms-conditions-tab-pane" role="tabpanel" aria-labelledby="terms-conditions-tab" tabindex="0">...</div>
                                    </article>
                                </div>

                                <div className="col-12 col-xl-4 ps-xl-2">
                                    <article className='detail-card mt-3'>
                                        <div className="detail-card-logo-area">
                                            <img src="assets/images/lion-parking.png" alt="" />
                                        </div>
                                        <div className="detail-card-label-area">
                                            <h5>Meet and Greet</h5>
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

                                        <div className="detail-card-price-area">
                                            <p>Price</p>
                                            <h5>
                                                £ 76.78
                                                <span>£ 83.00</span>
                                            </h5>
                                        </div>

                                        <div className="detail-card-feature-area">
                                            <p>
                                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                                Save <span>£ 6.23</span> Today
                                            </p>

                                            <p>
                                                <i class="bi bi-lightning-fill me-2"></i>
                                                Cancellation Cover Available
                                            </p>
                                        </div>

                                        <Divider className='mt-2 mb-2' />

                                        <Button label="BOOK" className="custom-btn-primary w-100 result-card-btn" />
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}

            <Footer />
        </>
    )
}

export default VendorList;