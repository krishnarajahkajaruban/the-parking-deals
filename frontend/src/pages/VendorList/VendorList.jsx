import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import './VendorList.css';
import './VendorList-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { Tooltip } from 'bootstrap';
import Preloader from '../../Preloader';

import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Rating } from "primereact/rating";
import { Image } from 'primereact/image';
import { fetchAllAirports, getAvailableQuotes } from '../../utils/vendorUtil';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import withComponentName from '../../withComponentName';


const VendorList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useRef(null);
  const { quoteInfo } = location.state || {};
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropOffDate, setDropOffDate] = useState(quoteInfo?.dropOffDate || null);
  const [pickupDate, setPickupDate] = useState(quoteInfo?.pickupDate || null);
  const [showError, setShowError] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(quoteInfo?.selectedAirport || null);
  const today = new Date();
  const [dropOffTime, setDropOffTime] = useState(quoteInfo?.dropOffTime || null);
  const [pickupTime, setPickupTime] = useState(quoteInfo?.pickupTime || null);
  const [couponCode, setCouponCode] = useState(quoteInfo?.couponCode || "");

  const airports = useSelector((state) => state.vendor.airport);
  const quotes = useSelector((state) => state.vendor.quotes);

  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchAllAirports(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (quoteInfo) {
      handleFunctionForApi(quoteInfo.selectedAirport?.name, quoteInfo.dropOffDate, quoteInfo.dropOffTime, quoteInfo.pickupDate, quoteInfo.pickupTime)
    };
  }, [quoteInfo]);

  const handleFunctionForApi = (selectedAirport, dropOffDate, dropOffTime, pickupDate, pickupTime) => {
    const queryParams = new URLSearchParams({
      airport: selectedAirport,
      fromDate: new Date(dropOffDate).toISOString(),
      fromTime: new Date(dropOffTime).toTimeString().split(' ')[0], // Format time to HH:MM:SS
      toDate: new Date(pickupDate).toISOString(),
      toTime: new Date(pickupTime).toTimeString().split(' ')[0], // Format time to HH:MM:SS
    });
    setLoading(true);
    setPageLoading(true);
    getAvailableQuotes(queryParams, dispatch, toast, setLoading, setPageLoading);
  };

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

  const handleEditSearch = async (e) => {
    e.preventDefault();
    setShowError(false);
    if (!selectedAirport || !dropOffDate || !dropOffTime || !pickupDate || !pickupTime) {
      setShowError(true);
      toast.current.show({
        severity: 'error',
        summary: 'Error in Submission',
        detail: "Please fill all required fields!",
        life: 3000
      });
      return;
    }

    handleFunctionForApi(selectedAirport?.name, dropOffDate, dropOffTime, pickupDate, pickupTime);

  }

  const handleBooking = (companyId, companyName, companyImg, bookingQuote, serviceType) => {
    // setPageLoading(true);
    // setTimeout(() => {
    //     // navigate('/booking');
    //     window.location.assign('/booking');
    //     // setPageLoading(false);
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, 800);
    const bookingDetails = {
      airportName: selectedAirport?.name || quoteInfo?.selectedAirport?.name,
      dropOffDate: new Date(dropOffDate || quoteInfo?.dropOffDate).toISOString(),
      dropOffTime: new Date(dropOffTime || quoteInfo?.dropOffTime).toTimeString().split(' ')[0],
      pickUpDate: new Date(pickupDate || quoteInfo?.pickupDate).toISOString(),
      pickUpTime: new Date(pickupTime || quoteInfo?.pickupTime).toTimeString().split(' ')[0],
      couponCode,
      companyId,
      companyName,
      companyImg,
      bookingQuote,
      serviceType
    }
    navigate('/booking', { state: { bookingDetails } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
  }, []);
  return (
    <>
      {!quoteInfo && <Navigate to="/" />}
      {/* {pageLoading && <Preloader />} */}
      <Header />

      {/* Breadcrumb Section Start */}
      <section className="breadcrumb-section overflow-hidden">
        <div className="container-md">
          <div className="row"></div>
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
                                        <i className="bi bi-pencil-square"></i>
                                    </button> */}
                  <Button
                    icon="bi bi-pencil-square"
                    className="edit-float-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#editSearchModal"
                  />
                  <div className="row">
                    <div className="col-12 col-xl-6 col-lg-6 col-md-8 col-sm-8 mx-auto">
                      <div className="custom-form-group mb-0 input-with-icon">
                        <label
                          htmlFor="airport"
                          className="custom-form-label text-sm-center"
                        >
                          Airport
                        </label>
                        <h6
                          data-bs-toggle="modal"
                          data-bs-target="#editSearchModal"
                          className='show-data-head'
                        >
                          <i class="bi bi-airplane-fill input-grp-icon"></i>
                          {selectedAirport?.name || quoteInfo?.selectedAirport.name}
                        </h6>
                        <div className="form-icon-group">
                          {/* <Dropdown
                              id="airport"
                              value={selectedAirport}
                              onChange={(e) => setSelectedAirport(e.value)}
                              options={airports}
                              optionLabel="name"
                              placeholder="Select a Airport"
                              filter
                              valueTemplate={selectedAirportTemplate}
                              itemTemplate={airportOptionTemplate}
                              className="w-full w-100 custom-form-dropdown"
                            /> */}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <Divider className="mt-4 mb-4" />
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-12 col-sm-6 mb-2 mb-sm-0">
                          <div className="results-option-data-area">
                            <h5>Dropoff Detail</h5>
                            <div className="row">
                              <div className="col-12 col-md-6 mb-2 mb-md-0">
                                <h6
                                  data-bs-toggle="modal"
                                  data-bs-target="#editSearchModal"
                                >
                                  <i class="bi bi-calendar-check-fill me-2"></i>
                                  {dropOffDate?.toLocaleDateString('en-GB') || quoteInfo?.dropOffDate.toLocaleDateString('en-GB')}
                                </h6>
                              </div>
                              <div className="col-12 col-md-6">
                                <h6
                                  data-bs-toggle="modal"
                                  data-bs-target="#editSearchModal"
                                >
                                  <i class="bi bi-clock-fill me-2"></i>
                                  {dropOffTime?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) || quoteInfo?.dropOffTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
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
                                <h6
                                  data-bs-toggle="modal"
                                  data-bs-target="#editSearchModal"
                                >
                                  <i class="bi bi-calendar-check-fill me-2"></i>
                                  {pickupDate?.toLocaleDateString('en-GB') || quoteInfo?.pickupDate.toLocaleDateString('en-GB')}
                                </h6>
                              </div>
                              <div className="col-12 col-md-6">
                                <h6
                                  data-bs-toggle="modal"
                                  data-bs-target="#editSearchModal"
                                >
                                  <i class="bi bi-clock-fill me-2"></i>
                                  {pickupTime?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) || quoteInfo?.pickupTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <Divider className="mt-4 mb-4" />
                    </div>

                    <div className="col-12 col-xl-8 col-lg-10 mx-auto">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <div className="custom-form-group mb-3 mb-md-0 input-with-icon">
                            <div className="form-icon-group">
                              <i class="bi bi-p-square input-grp-icon"></i>
                              <Dropdown
                                value={parkingOption}
                                onChange={(e) => setParkingOption(e.value)}
                                options={parking_options}
                                optionLabel="name"
                                placeholder="Select Parking Option"
                                className="w-full w-100 custom-form-dropdown"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6">
                          <div className="custom-form-group mb-3 mb-md-0 input-with-icon">
                            <div className="form-icon-group">
                              <i class="bi bi-arrow-down-up input-grp-icon"></i>
                              <Dropdown
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.value)}
                                options={filter_options}
                                optionLabel="name"
                                placeholder="Select Parking Option"
                                className="w-full w-100 custom-form-dropdown"
                              />
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

      <section className="section-padding results-section overflow-hidden">
        <div className="container-md">
          {(quotes && quotes.length > 0) ?
            <div className="row result-card-view-row">
              {
                quotes.map((quote) => {
                  return (
                    <div
                      className="col-12 col-lg-6 col-sm-10 mx-auto"
                      data-aos="fade-up"
                      key={quote._id}
                    >
                      <article className="result-card">
                        <div className="result-card-label-area">
                          <h5>{quote.type}</h5>
                        </div>
                        <div className="result-card-head-area">
                          <div className="result-card-logo-area">
                            <img src={quote.logo || "assets/images/lion-parking.png"} alt="" />
                          </div>
                          <div className="result-card-head-detail-area">
                            <h4 className="result-card-head">{quote.name}</h4>
                            <div className="result-card-star-area">
                              <Rating value={quote.rating} readOnly cancel={false} />
                            </div>
                            <h3 className="result-card-price">
                              £ {quote.finalQuote}
                              {quote.quote > 0 && <span className="cut-price ms-3">£ {quote.quote}</span>}
                            </h3>
                            <div className="result-card-sub">
                              {quote.quote > 0 && <p>
                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                Save <span>£ {quote.quote - quote.finalQuote}</span> Today
                              </p>}

                              {quote.cancellationCover && <p>
                                <i class="bi bi-lightning-fill me-2"></i>
                                Cancellation Cover Available
                              </p>}
                            </div>
                          </div>
                        </div>
                        <div className="result-card-body-area">
                          <ul>
                            {quote.facilities.map((facility, index) => {
                              return (
                                <li key={index}>{facility}</li>
                              )
                            })}
                          </ul>
                        </div>
                        <div className="result-card-footer-area">
                          <Divider className="mt-3 mb-3" />
                          <div className="result-card-feature-area">
                            <div
                              className="result-card-feature"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Secure Barrier"
                            >
                              <img
                                src="assets/images/features/secure-barrier.png"
                                alt="Secure Barrier"
                              />
                            </div>

                            <div
                              className="result-card-feature"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Disability"
                            >
                              <img
                                src="assets/images/features/disability.png"
                                alt="Disability"
                              />
                            </div>

                            <div
                              className="result-card-feature"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="CCTV Cameras"
                            >
                              <img
                                src="assets/images/features/cctv-camera.png"
                                alt="CCTV Cameras"
                              />
                            </div>

                            <div
                              className="result-card-feature"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Fencing"
                            >
                              <img
                                src="assets/images/features/fence.png"
                                alt="Fencing"
                              />
                            </div>
                          </div>
                          <Divider className="mt-3 mb-3" />

                          <div className="result-card-btn-area">
                            <Button
                              label="VIEW"
                              severity="secondary"
                              className="result-card-btn"
                              data-bs-toggle="modal"
                              data-bs-target="#vendorDetailModal"
                              onClick={() => setSelectedVendor(quote)}
                            />
                            <Button
                              label="BOOK"
                              className="custom-btn-primary result-card-btn"
                              onClick={() => handleBooking(quote._id, quote.name, quote.logo, quote.finalQuote, quote.type)}
                            />
                          </div>

                          <div className="result-card-status-area">
                            <p>
                              <i className="bi bi-eye-fill me-2"></i>
                              13 Currently Viewing
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>
                  )
                })
              }
            </div> : <h6>No Quotes found</h6>
          }
        </div>
      </section>

      <Toast ref={toast} />
      {/* quote form modal */}
      <div
        class="modal fade"
        id="editSearchModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="editSearchModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content custom-modal">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="editSearchModalLabel">
                Edit your search
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form
                action=""
                className="custom-card-form form-2 get-quote-form p-3 mt-0"
                onSubmit={handleEditSearch}
              >
                <div className="form-head-input-area">
                  <div className="row">
                    <div className="col-12 col-xl-8 col-lg-6 mx-auto">
                      <div className="custom-form-group mb-0 input-with-icon">
                        <label
                          htmlFor="airport"
                          className="custom-form-label form-required text-sm-center"
                        >
                          Select airport
                        </label>
                        <div className="form-icon-group">
                          <i class="bi bi-airplane-fill input-grp-icon"></i>
                          <Dropdown
                            id="airport"
                            value={selectedAirport}
                            onChange={(e) => setSelectedAirport(e.value)}
                            options={airports}
                            optionLabel="name"
                            placeholder="Select a Airport"
                            filter
                            valueTemplate={selectedAirportTemplate}
                            itemTemplate={airportOptionTemplate}
                            className="w-full w-100 custom-form-dropdown"
                            invalid={showError}
                          />
                        </div>
                        {(showError && !selectedAirport) && (
                          <small className="text-danger form-error-msg text-sm-center">
                            This field is required
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <Divider className="mt-4 mb-4" />
                  </div>

                  <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                    <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                      <label
                        htmlFor="dropOffDate"
                        className="custom-form-label form-required"
                      >
                        Drop off date
                      </label>
                      <div className="form-icon-group">
                        <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                        <Calendar
                          id="dropOffDate"
                          value={dropOffDate}
                          onChange={handleDropOffDateChange}
                          placeholder="dd/mm/yyyy"
                          minDate={today}
                          className="w-100"
                          invalid={showError}
                        />
                      </div>
                      {(showError && !dropOffDate) && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                    <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                      <label
                        htmlFor="dropOffTime"
                        className="custom-form-label form-required"
                      >
                        Drop off time
                      </label>
                      <div className="form-icon-group">
                        <i class="bi bi-clock-fill input-grp-icon"></i>
                        <Calendar
                          id="dropOffTime"
                          className="w-100"
                          value={dropOffTime}
                          onChange={(e) => setDropOffTime(e.value)}
                          placeholder="hh:mm"
                          timeOnly
                          invalid={showError}
                        />
                      </div>
                      {(showError && !dropOffTime) && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                    <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                      <label
                        htmlFor="pickupDate"
                        className="custom-form-label form-required"
                      >
                        Pickup date
                      </label>
                      <div className="form-icon-group">
                        <i class="bi bi-calendar-check-fill input-grp-icon"></i>
                        <Calendar
                          id="pickupDate"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.value)}
                          placeholder="dd/mm/yyyy"
                          minDate={dropOffDate}
                          disabled={!dropOffDate}
                          className="w-100"
                          invalid={showError}
                        />
                      </div>
                      {(showError && !pickupDate) && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-11 col-lg-6 mx-auto">
                    <div className="custom-form-group mb-3 mb-sm-4 input-with-icon">
                      <label
                        htmlFor="pickupTime"
                        className="custom-form-label form-required"
                      >
                        Pickup time
                      </label>
                      <div className="form-icon-group">
                        <i class="bi bi-clock-fill input-grp-icon"></i>
                        <Calendar
                          id="pickupTime"
                          className="w-100"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.value)}
                          placeholder="hh:mm"
                          timeOnly
                          invalid={showError}
                        />
                      </div>
                      {(showError && !pickupTime) && (
                        <small className="text-danger form-error-msg">
                          This field is required
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-sm-11 col-xl-6 col-lg-6 mx-auto">
                    <div className="custom-form-group mb-2 mb-sm-2 input-with-icon">
                      <label
                        htmlFor="couponCode"
                        className="custom-form-label form-required text-lg-center"
                      >
                        Coupon Code
                      </label>
                      <div className="form-icon-group">
                        <i class="bi bi-gift-fill input-grp-icon"></i>
                        <InputText
                          id="couponCode"
                          className="custom-form-input"
                          placeholder="Enter promo code"
                          invalid={showError}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </div>
                      {/* {showError && (
                          <small className="text-danger form-error-msg text-sm-center">
                            This field is required
                          </small>
                        )} */}
                    </div>
                  </div>

                  <div className="col-12">
                    <Divider className="mb-4" />
                  </div>
                </div>

                <div className="custom-form-group contains-float-input d-flex justify-content-center mb-0">
                  <Button
                    label="SUBMIT"
                    className="submit-button justify-content-center btn-width"
                    loading={loading}
                    data-bs-dismiss="modal"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*  */}

      {/* vendor detail modal */}
      <div
        class="modal fade"
        id="vendorDetailModal"
        tabindex="-1"
        aria-labelledby="vendorDetailModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
          <div class="modal-content custom-modal">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="vendorDetailModalLabel">
                {selectedVendor?.name}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body pt-0 p-3">
              <div className="tab-detail-tabs-area mt-3">
                <ul
                  class="nav nav-tabs tab-detail-tabs"
                  id="companyDetailTab"
                  role="tablist"
                >
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn active"
                      id="overview-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#overview-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="overview-tab-pane"
                      aria-selected="true"
                    >
                      Overview
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="drop-off-procedure-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#drop-off-procedure-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="drop-off-procedure-tab-pane"
                      aria-selected="false"
                    >
                      Drop-Off Procedure
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="return-procedure-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#return-procedure-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="return-procedure-tab-pane"
                      aria-selected="false"
                    >
                      Return Procedure
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="view-map-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#view-map-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="view-map-tab-pane"
                      aria-selected="false"
                    >
                      View Map
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="photos-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#photos-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="photos-tab-pane"
                      aria-selected="false"
                    >
                      Photos
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="reviews-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#reviews-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="reviews-tab-pane"
                      aria-selected="false"
                    >
                      Reviews
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link tab-detail-btn"
                      id="terms-conditions-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#terms-conditions-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="terms-conditions-tab-pane"
                      aria-selected="false"
                    >
                      Terms & Conditions
                    </button>
                  </li>
                </ul>
              </div>
              <div className="row tab-detail-row">
                <div className="col-12 col-xl-8 pe-xl-2">
                  <article
                    class="tab-content tab-detail-area mt-3"
                    id="companyDetailTabContent"
                  >
                    {/* Overview */}
                    <div
                      class="tab-pane tab-detail-content fade show active"
                      id="overview-tab-pane"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-content-area">
                        <h1>Why Use Lion Parking?</h1>
                        <ul>
                          <li>
                            Lion Parking Meet and Greet airport parking
                            service offers the best option for those who are
                            traveling with heavy luggage or families traveling
                            with kids.
                          </li>
                          <li>
                            Lion Parking at Heathrow Airport lets you drop
                            your car in the nearest car park, so you can just
                            walk inside and board your flight while your car
                            is parked in a car park away from the terminal.
                          </li>
                          <li>
                            Lion Parking aims to offer the best prices for
                            both short stay airport parking as well as long
                            term airport parking.
                          </li>
                          <li>
                            Our aim is to provide a stress-free and affordable
                            parking solution for all your travels to and from
                            Airport.
                          </li>
                          <li>
                            Meet and Greet parking service is available at
                            Heathrow Terminal 1, Heathrow Terminal 2, Heathrow
                            Terminal 3, Heathrow Terminal 4 and Heathrow
                            Terminal 5.
                          </li>
                        </ul>
                        <br />

                        <h2>Disabled Info</h2>
                        <p>Disabled & Family Friendly.</p>
                        <br />

                        <h2>Insurance</h2>
                        <p>Drivers are fully insured to drive any vehicle.</p>
                        <br />

                        <h2>Additional Info</h2>
                        <ul>
                          <li>Drop off and pick up at the terminal.</li>
                          <li>
                            Operating Hours - 4.00 to 23.59 / 7 Days A Week.
                          </li>
                          <li>
                            Please check booking confirmation for Company
                            details.
                          </li>
                          <li>
                            Valet Service for an additional £30.00, on
                            request.
                          </li>
                          <li>
                            <u>
                              "Customer has to pay for the entry and exit
                              fee".
                            </u>
                          </li>
                        </ul>
                        <br />

                        <h2>Important</h2>
                        <ul>
                          <li>
                            Lion Parking is a trading name of Lion Parking
                            ltd. Full instructions will be provided in booking
                            confirmation email.
                          </li>
                          <li>
                            Our platform operate as a comparison site/booking
                            agent. Your chosen Service provider will take the
                            vehicle, park to their car park and return the
                            vehicle. You must raise any issues regarding
                            parking service ( Delay, Damage etc.) with service
                            provider.
                          </li>
                          <li>
                            We do our best to tell you as much about available
                            products as possible before you purchase. All
                            product specific information is provided by
                            Service Providers. Therefore, we can't always keep
                            track of changes to how they run. If you find
                            anything that's not completely accurate in our
                            information, Please let us know and we will take
                            the necessary steps.
                          </li>
                        </ul>
                        <br />

                        <p>
                          Ultra Low Emission Zone (ULEZ) has expanded across
                          all London boroughs including Heathrow Airport from
                          29 August 2023. If you drive anywhere within the
                          ULEZ, including the Heathrow Airport from 29 August
                          2023, and your vehicle does not meet the emissions
                          standards, you will have to pay a charge of £12.50.
                          Please make sure to setup AUTO PAY when coming to
                          the airport to avoid any penalty tickets. The
                          operator will not be liable in case you receive a
                          penalty for not paying the ULEZ charge.
                        </p>
                      </div>
                    </div>
                    {/*  */}

                    {/* Drop-Off Procedure */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="drop-off-procedure-tab-pane"
                      role="tabpanel"
                      aria-labelledby="drop-off-procedure-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-content-area">
                        <p>
                          Beginning on August 29, 2023, the Ultra Low Emission
                          Zone (ULEZ) in London has been extended to cover the
                          entire Greater London area, Heathrow Airport
                          included.
                        </p>

                        <p>
                          This expansion, executed by Transport for London
                          (TfL), seeks to mitigate air pollution across the
                          city. As of this date, Heathrow Airport and its
                          terminals (2, 3, 4 and 5) fall within the boundaries
                          of ULEZ. Consequently, vehicles entering the airport
                          are required to comply with specific emission
                          criteria to avoid incurring a daily fee.
                        </p>
                        <br />
                        <p>
                          To check if your car is ULEZ complaint please visit:
                        </p>

                        <a
                          href="https://tfl.gov.uk/modes/driving/check-your-vehicle/ "
                          target="_blank"
                          rel="noreferrer"
                        >
                          https://tfl.gov.uk/modes/driving/check-your-vehicle/{" "}
                        </a>

                        <br />

                        <p>
                          Please be aware that if your vehicle does not meet
                          ULEZ compliance standards, you will be responsible
                          for set up auto pay in TFL website. To set this up,
                          please visit:
                        </p>

                        <a
                          href="https://tfl.gov.uk/modes/driving/pay-to-drive-in-london"
                          target="_blank"
                          rel="noreferrer"
                        >
                          https://tfl.gov.uk/modes/driving/pay-to-drive-in-london
                        </a>
                        <br />
                        <p>
                          <b>
                            Once your holiday parking has been booked and
                            confirmed via email you are ready to go. Please do
                            call us on 07479259475 when you are 30 minutes
                            away so we can allocate a driver to collect your
                            car, one of our friendly chauffeurs will be
                            waiting to accept your car.
                          </b>
                        </p>

                        <p>
                          <b>
                            <u>
                              <em>
                                "Customer has to pay for the entry and exit
                                fee".
                              </em>
                            </u>
                          </b>
                        </p>

                        <p>
                          Please see the directions for each Terminal we serve
                          below.
                        </p>

                        <br />

                        <h2>Terminal 2 - sat-nav postcode: TW6 1EW</h2>

                        <h2>Terminal 2 - Departure Instructions:</h2>

                        <ul>
                          <li>
                            From the M25 exit at Junction 15, follow the signs
                            for Terminals 1, 2 & 3 all the way round following
                            onto the Western Perimeter Road.
                          </li>
                          <li>
                            Go through the main tunnel to the Central Terminal
                            Area for Terminals 1, 2 & 3. Exiting the tunnel,
                            keep right, passing the Central Bus Station,
                            joining the final approaches to Terminal 2 on
                            Cosmopolitan Way.
                          </li>
                          <li>
                            Please keep to the right, as the road to Terminal
                            2 will move away from the building before turning
                            back as the road ramps up to Terminal 2 Departures
                            & the Short Stay 2 car park on Constellation Way.
                          </li>
                          <li>
                            Once you are on the rising ramp, continue to keep
                            right as the ramp will lead directly into the
                            "Short stay car park" entry barriers.
                          </li>
                          <li>
                            Please make sure you are in lane 6, (towards the
                            ticket machine), which will take you to Level 4 of
                            the Short Stay car park. Take a ticket at the
                            barrier and enter the car park.
                          </li>
                          <li>
                            Once you enter the car park on Level 4, keep to
                            the RIGHT following the signs for 'Off Airport
                            Parking Meet & Greet' and then please park your
                            car in "row B" Off Airport Parking Meet & Greet
                            bays.
                          </li>
                          <li>
                            Here you see our chauffeurs who are based near the
                            ticket pay machine. They will be wearing black
                            jackets and be expecting you.
                          </li>
                        </ul>
                        <br />

                        <h2>Terminal 3 - sat-nav postcode: TW6 1QG</h2>

                        <h2>Terminal 3 - Departure Instructions</h2>

                        <ul>
                          <li>
                            From the M25 exit at Junction 15, follow the signs
                            for Terminals 1, 2 & 3 all the way round following
                            onto the Western Perimeter Road.
                          </li>
                          <li>
                            Go through the main tunnel to the Central Terminal
                            Area for Terminals 1, 2 & 3.
                          </li>
                          <li>
                            Exiting the tunnel, keep in the 1st lane and
                            follow signs for Terminal 3 Short Stay Carpark
                            (Carpark 3).
                          </li>
                          <li>
                            Take a ticket from the barrier and follow signs to
                            Level 4, then please park your car in "row A" Off
                            Airport Parking Meet & Greet bays.
                          </li>
                          <li>
                            Here you see our chauffeurs who are based near the
                            ticket pay machine. They will be wearing black
                            jackets and be expecting you.
                          </li>
                        </ul>
                        <br />

                        <h2>Terminal 4 - sat-nav postcode: TW6 3XA</h2>

                        <h2>Terminal 4 - Departure Instructions</h2>

                        <ul>
                          <li>
                            Please follow directions to the Short Stay car
                            park and then drive up to Level 2, Row E or F.
                            Look for the "Off Airport Meet and Greet' sign and
                            park your car in Off Airport Parking Meet & Greet
                            bays.
                          </li>
                          <li>
                            Please have your email booking confirmation ready,
                            together with your return flight details.
                          </li>
                          <li>
                            From level 2 it's just a short walk to the
                            terminal.
                          </li>
                        </ul>
                        <br />

                        <h2>Terminal 5 - sat-nav postcode: TW6 2GA</h2>

                        <h2>Terminal 5 - Departure Instructions</h2>

                        <ul>
                          <li>
                            Please follow the signs for the "Short Stay
                            Passenger Pickup", which is located on the
                            right-hand side of the ramp, as you take the exit
                            for Terminal 5 from the roundabout.
                          </li>
                          <li>
                            On arrival at the Short Stay car park, please move
                            to the left-hand lane, following directions to
                            "LEVEL 4" AVIS.
                          </li>
                          <li>
                            Take a ticket from the barrier and follow signs
                            for Off Airport Parking and make your way to zones
                            "R-S". Please Park your car in these designated
                            areas, sign posted as "Off Airport Meet & Greet”.
                          </li>
                          <li>
                            Here you see our chauffeurs who are based near the
                            ticket pay machine. They will be wearing black
                            jackets and be expecting you.
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/*  */}

                    {/* Return Procedure */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="return-procedure-tab-pane"
                      role="tabpanel"
                      aria-labelledby="return-procedure-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-content-area">
                        <p>
                          Please do call us on 07479 259 475 once arrived at
                          the airport.
                        </p>

                        <br />

                        <h2>Terminal 2 Return Instructions</h2>

                        <p>
                          On your return, once you have collected your luggage
                          and are about to clear Customs, please call the
                          number provided when your car was dropped off.
                        </p>
                        <p>
                          Make your way to the same place where you dropped
                          the vehicle off, (Level 4 of the Short Stay car
                          park) and your car will be ready and waiting for you
                          in row B next to the lift/pay machine.
                        </p>
                        <br />

                        <h2>Terminal 3 Return Instructions</h2>
                        <p>
                          On your return, once you have collected your luggage
                          and are about to clear Customs, please call the
                          number provided when your car was dropped off.
                        </p>

                        <p>
                          As you arrive in the arrivals, just before the Exit
                          door on the Right-Hand Side, please take the lift to
                          Short stay 3 Level 4 Car Park and your car will be
                          ready and waiting for you in row A Off Airport
                          Parking Meet & Greet bays.
                        </p>
                        <br />

                        <h2>Terminal 4 Return Instructions</h2>

                        <p>
                          On your return, once you have collected your luggage
                          and are about to clear Customs, please call the
                          number provided when your car was dropped off. Walk
                          back to the Short Stay car park (Level 2, E or F Off
                          Airport Parking Meet & Greet bays) where your car
                          will be ready and waiting for you.
                        </p>
                        <br />

                        <h2>Terminal 5 Return Instructions</h2>

                        <p>
                          On your return, once you have collected your luggage
                          and are about to clear Customs, please call the
                          number provided when your car was dropped off.
                        </p>

                        <p>
                          Make your way to where you dropped the car off,
                          (Level 4, Short Stay car park), where your car will
                          be ready and waiting for you in Row R or S Off
                          Airport Parking Meet & Greet bays.
                        </p>
                      </div>
                    </div>
                    {/*  */}

                    {/* View Map */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="view-map-tab-pane"
                      role="tabpanel"
                      aria-labelledby="view-map-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-map-view-area">
                        <iframe
                          width="100%"
                          height="100%"
                          frameborder="0"
                          scrolling="no"
                          marginheight="0"
                          marginwidth="0"
                          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=London+(The%20Parking%20Deals)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        ></iframe>
                      </div>
                    </div>
                    {/*  */}

                    {/* Photos */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="photos-tab-pane"
                      role="tabpanel"
                      aria-labelledby="photos-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-image-content">
                        <Image
                          src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg"
                          alt="Image"
                          width="200"
                          height="150"
                          preview
                        />
                        <Image
                          src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg"
                          alt="Image"
                          width="200"
                          height="150"
                          preview
                        />
                        <Image
                          src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg"
                          alt="Image"
                          width="200"
                          height="150"
                          preview
                        />
                        <Image
                          src="https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg"
                          alt="Image"
                          width="200"
                          height="150"
                          preview
                        />
                      </div>
                    </div>
                    {/*  */}

                    {/* Reviews */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="reviews-tab-pane"
                      role="tabpanel"
                      aria-labelledby="reviews-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-review-area">
                        <article className="review-data-area">
                          <div className="review-data-header-area">
                            <div className="review-avatar-image-area">
                              <img src="assets/images/user.png" alt="" />
                            </div>
                            <div className="w-100">
                              <h5>Maddy P</h5>
                              <div className="review-data-rating">
                                <Rating value={4} readOnly cancel={false} />
                              </div>
                            </div>
                          </div>
                          <div className="review-data-body">
                            <p>
                              The team are polite, efficient and lovely. No
                              issues whatsoever, they even called me
                              proactively to check we were on track and all
                              okay. Thank you, will definitely use again.
                            </p>
                          </div>
                        </article>

                        <article className="review-data-area">
                          <div className="review-data-header-area">
                            <div className="review-avatar-image-area">
                              <img src="assets/images/user.png" alt="" />
                            </div>
                            <div className="w-100">
                              <h5>Maddy P</h5>
                              <div className="review-data-rating">
                                <Rating value={4} readOnly cancel={false} />
                              </div>
                            </div>
                          </div>
                          <div className="review-data-body">
                            <p>
                              The team are polite, efficient and lovely. No
                              issues whatsoever, they even called me
                              proactively to check we were on track and all
                              okay. Thank you, will definitely use again.
                            </p>
                          </div>
                        </article>

                        <article className="review-data-area">
                          <div className="review-data-header-area">
                            <div className="review-avatar-image-area">
                              <img src="assets/images/user.png" alt="" />
                            </div>
                            <div className="w-100">
                              <h5>Maddy P</h5>
                              <div className="review-data-rating">
                                <Rating value={4} readOnly cancel={false} />
                              </div>
                            </div>
                          </div>
                          <div className="review-data-body">
                            <p>
                              The team are polite, efficient and lovely. No
                              issues whatsoever, they even called me
                              proactively to check we were on track and all
                              okay. Thank you, will definitely use again.
                            </p>
                          </div>
                        </article>

                        <article className="review-data-area">
                          <div className="review-data-header-area">
                            <div className="review-avatar-image-area">
                              <img src="assets/images/user.png" alt="" />
                            </div>
                            <div className="w-100">
                              <h5>Maddy P</h5>
                              <div className="review-data-rating">
                                <Rating value={4} readOnly cancel={false} />
                              </div>
                            </div>
                          </div>
                          <div className="review-data-body">
                            <p>
                              The team are polite, efficient and lovely. No
                              issues whatsoever, they even called me
                              proactively to check we were on track and all
                              okay. Thank you, will definitely use again.
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
                    {/*  */}

                    {/* Terms & Conditions */}
                    <div
                      class="tab-pane tab-detail-content fade"
                      id="terms-conditions-tab-pane"
                      role="tabpanel"
                      aria-labelledby="terms-conditions-tab"
                      tabindex="0"
                    >
                      <div className="tab-detail-content-area">
                        <p>
                          For <b>The Parking Deals</b> T&Cs, please visit{" "}
                          <a
                            href="https://theparkingdeals.co.uk/terms-and-conditions"
                            target="_blank"
                            rel="noreferrer"
                          >
                            https://theparkingdeals.co.uk/terms-and-conditions
                          </a>
                        </p>
                      </div>
                    </div>
                    {/*  */}
                  </article>
                </div>

                <div className="col-12 col-xl-4 ps-xl-2">
                  <article className="detail-card mt-3 card-sticky">
                    <div className="detail-card-logo-area">
                      <img src={selectedVendor?.logo} alt="" />
                    </div>
                    <div className="detail-card-label-area">
                      <h5>{selectedVendor?.type}</h5>
                    </div>
                    <div className="detail-card-info-area mb-1">
                      <div className="detail-card-info-icon-area">
                        <i class="bi bi-building-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Company :</p>
                        <h6>{selectedVendor?.name}</h6>
                      </div>
                    </div>

                    <div className="detail-card-info-area">
                      <div className="detail-card-info-icon-area">
                        <i class="bi bi-geo-alt-fill"></i>
                      </div>
                      <div className="detail-card-info-body">
                        <p>Location :</p>
                        <h6>{selectedAirport?.name}</h6>
                      </div>
                    </div>

                    <div className="detail-card-price-area">
                      <p>Price</p>
                      <h5>
                        £ {selectedVendor?.finalQuote}
                        {selectedVendor?.quote > 0 && <span>£ {selectedVendor.quote}</span>}
                      </h5>
                    </div>

                    <div className="detail-card-feature-area">
                          {selectedVendor?.quote > 0 && <p>
                                <i class="bi bi-hand-thumbs-up-fill me-2"></i>
                                Save <span>£ {selectedVendor.quote - selectedVendor.finalQuote}</span> Today
                              </p>}

                              {selectedVendor?.cancellationCover &&<p>
                        <i class="bi bi-lightning-fill me-2"></i>
                        Cancellation Cover Available
                      </p>}
                    </div>

                    <Divider className="mt-2 mb-2" />

                    <Button
                      label="BOOK"
                      className="custom-btn-primary w-100 result-card-btn"
                      onClick={() => handleBooking(selectedVendor?._id, selectedVendor?.name, selectedVendor?.logo, selectedVendor?.finalQuote, selectedVendor?.type)}
                    />
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
  );
}

export default withComponentName(VendorList, 'VenderList');