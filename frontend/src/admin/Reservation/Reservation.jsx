import React, { useEffect, useState, useRef } from "react";
import "./Reservation.css";

import { useNavigate } from "react-router-dom";

import Preloader from "../../Preloader";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAirports, getAvailableQuotes } from "../../utils/vendorUtil";
import api from "../../api";
import { loadStripe } from "@stripe/stripe-js";

const Reservation = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const times = [
    { time: "00:00" },
    { time: "00:30" },
    { time: "01:00" },
    { time: "01:30" },
    { time: "02:00" },
    { time: "02:30" },
    { time: "03:00" },
    { time: "03:30" },
    { time: "04:00" },
    { time: "04:30" },
    { time: "05:00" },
    { time: "05:30" },
    { time: "06:00" },
    { time: "06:30" },
    { time: "07:00" },
    { time: "07:30" },
    { time: "08:00" },
    { time: "08:30" },
    { time: "09:00" },
    { time: "09:30" },
    { time: "10:00" },
    { time: "10:30" },
    { time: "11:00" },
    { time: "11:30" },
    { time: "12:00" },
    { time: "12:30" },
    { time: "13:00" },
    { time: "13:30" },
    { time: "14:00" },
    { time: "14:30" },
    { time: "15:00" },
    { time: "15:30" },
    { time: "16:00" },
    { time: "16:30" },
    { time: "17:00" },
    { time: "17:30" },
    { time: "18:00" },
    { time: "18:30" },
    { time: "19:00" },
    { time: "19:30" },
    { time: "20:00" },
    { time: "20:30" },
    { time: "21:00" },
    { time: "21:30" },
    { time: "22:00" },
    { time: "22:30" },
    { time: "23:00" },
    { time: "23:30" },
  ];

  const airports = useSelector((state) => state.vendor.airport);
  const token = useSelector((state) => state.auth.token);

  const vendors = [{ name: "Airport Parking Bay" }, { name: "Luton 247" }];

  const quotes = useSelector((state) => state.vendor.quotes);

  const today = new Date();

  /* Quote details */
  const parking_options = [
    { name: "All Parking" },
    { name: "Meet and Greet" },
    { name: "Park and Ride" },
  ];
  const [parkingOption, setParkingOption] = useState(parking_options[0]);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [dropOffDateStr, setDropOffDateStr] = useState("");
  const [pickupDateStr, setPickupDateStr] = useState("");
  const [dayDifference, setDayDifference] = useState(0);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [couponValid, setCouponValid] = useState(false);

  /* Travel details */
  const [departTerminal, setDepartTerminal] = useState();
  const depart_terminals = [
    { name: "Terminal 1" },
    { name: "Terminal 2" },
    { name: "Terminal 3" },
    { name: "Terminal 4" },
    { name: "Terminal 5" },
  ];

  const [arrivalTerminal, setArrivalTerminal] = useState();
  const arrival_terminals = [
    { name: "Terminal 1" },
    { name: "Terminal 2" },
    { name: "Terminal 3" },
    { name: "Terminal 4" },
    { name: "Terminal 5" },
  ];
  const [inBoundFlight, setInBoundFlight] = useState("");

  /* Customer details */
  const titles = [
    { name: "Mr." },
    { name: "Mrs." },
    { name: "Ms." },
    { name: "Miss." },
  ];

  const initalCustomerDetails = {
    title: titles[0].name,
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  };

  const [customerDetails, setCustomerDetails] = useState(initalCustomerDetails);

  const initialTravelDetails = {
    departureTerminal: "",
    arrivalTerminal: "",
    // outBoundFlight: "",
    inBoundFlight: "",
  };

  /* Vechile details */
  const initialVehiclesDetails = [
    {
      regNo: "",
      color: "",
      make: "",
      model: "",
    },
  ];
  const [vehiclesDetails, setVehiclesDetails] = useState(
    initialVehiclesDetails
  );
  const [travelDetails, setTravelDetails] = useState(initialTravelDetails);

  const [checkedCancellationCover, setCheckedCancellationCover] =
    useState(false);
  const [bookingCharge, setBookingCharge] = useState(null);
  const [emailExists, setEmailExist] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [airportName, setAirportName] = useState("");
  const [showAddError, setShowAddError] = useState(false);

  function validateUserDetails(userDetails) {
    // Validate all required fields
    if (
      !userDetails.email ||
      !userDetails.firstName ||
      !userDetails.mobileNumber ||
      !userDetails.title
    ) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Your Details Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return false;
    }
    return true; // All validations passed
  }

  const bookTheCarParkingSlot = async (details) => {
    setBookingLoading(true);
    try {
      const response = await api.post("/api/user/car-park-booking", details);
      console.log(response.data);

      setLoading(false);
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      console.log(result);

      toast.current.show({
        severity: "success",
        summary: "Booking Successful",
        detail: "You have booked a parking slot for customer successfully",
        life: 3000,
      });
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Failed to Book",
        detail: err.response.data.error,
        life: 3000,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBooking = () => {
    setShowError(false);
    if (!validateUserDetails(customerDetails)) {
      return; // Exit if validation fails
    }

    // Check if travel details are filled
    if (!travelDetails.departureTerminal || !travelDetails.arrivalTerminal) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Travel Detail Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }

    // Check if all vehicle details are filled
    const hasError = vehiclesDetails.some(
      (vehicle) => !vehicle.regNo || !vehicle.color
    );
    if (hasError) {
      setShowError(true);
      toast.current.show({
        severity: "error",
        summary: "Error in Vehicle Detail Submission",
        detail: "Please fill all required fields!",
        life: 3000,
      });
      return;
    }

    const userDetail = {
      email: customerDetails.email,
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      mobileNumber: customerDetails.mobileNumber,
      title: customerDetails.title,
      adminBooking: true,
      accessToken: token,
    };

    // Prepare booking details object
    const carParkingSlotBookingDetails = {
      airportName: selectedAirport?.name,
      dropOffDate: dropOffDateStr,
      dropOffTime: dropOffTime?.time,
      pickUpDate: pickupDateStr,
      pickUpTime: pickupTime?.time,
      companyId: selectedVendor?._id,
      userDetail: userDetail,
      travelDetail: travelDetails,
      vehicleDetail: vehiclesDetails,
      bookingQuote: selectedVendor?.finalQuote,
      couponCode,
      smsConfirmation: false,
      cancellationCover: checkedCancellationCover,
    };

    bookTheCarParkingSlot(carParkingSlotBookingDetails);
  };

  const handleFunctionForApi = (
    selectedAirport,
    dropOffDate,
    dropOffTime,
    pickupDate,
    pickupTime
  ) => {
    // const queryParams = new URLSearchParams({
    //     airport: selectedAirport,
    //     fromDate: new Date(dropOffDate).toISOString(),
    //     fromTime: dropOffTime,
    //     toDate: new Date(pickupDate).toISOString(),
    //     toTime: pickupTime
    // });
    const queryParams = {
      airportId: selectedAirport?._id || "",
      serviceType: parkingOption.name || "",
      day: dayDifference,
    };
    setSelectedVendor(null);
    getAvailableQuotes(queryParams, dispatch, toast, null, null, null);
  };

  const calculatingBookingCharge = async () => {
    setLoading(true);
    try {
      const response = await api.post(
        "/api/user/calculate-total-booking-charge",
        {
          bookingQuote: selectedVendor?.finalQuote,
          couponCode,
          smsConfirmation: false,
          cancellationCover: checkedCancellationCover,
          numOfVehicle: vehiclesDetails.length,
        }
      );
      console.log(response.data);
      setBookingCharge(response.data);
    } catch (err) {
      console.log(err);
      toast.current.show({
        severity: "error",
        summary: "Error in Booking charge calculation!",
        detail: err.response.data.error,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkingCouponCodeValidity = async () => {
    try {
      const response = await api.post(
        "/api/user/checking-couponcode-validity",
        {
          couponCode,
        }
      );
      console.log(response.data);
      setCouponValid(true);
    } catch (err) {
      console.log(err);
      setCouponValid(false);
    }
  };

  const handleDropOffDateChange = (e) => {
    const newDropOffDate = e.value;
    setDropOffDate(newDropOffDate);
    setDropOffDateStr(newDropOffDate.toLocaleDateString("en-GB"));

    if (newDropOffDate) {
      const newPickupDate = new Date(newDropOffDate);
      newPickupDate.setDate(newPickupDate.getDate() + 7);
      setPickupDate(newPickupDate);
      setPickupDateStr(newPickupDate.toLocaleDateString("en-GB"));
    } else {
      setPickupDate(null);
      setPickupDate("");
    }
  };

  const parseTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date;
  };

  const selectedTimeTemplate = (option, props) => {
    if (option) {
      const time = parseTime(option.time);
      return time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return props.placeholder;
  };

  const timeTemplate = (option) => {
    const time = parseTime(option.time);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  function normalizeDate(dateString) {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const handleInputVechicleDetailChange = async (index, e) => {
    const { name, value } = e.target;
    const newVehicleDetails = [...vehiclesDetails];
    newVehicleDetails[index][name] = value;
    setVehiclesDetails(newVehicleDetails);
  };

  const addVehicle = () => {
    setVehiclesDetails([
      ...vehiclesDetails,
      { regNo: "", make: "", model: "", color: "" },
    ]);
  };

  const removeVehicle = (index) => {
    const newVehicleDetails = vehiclesDetails.filter((_, i) => i !== index);
    setVehiclesDetails(newVehicleDetails);
  };
  const handleInputTravelDetailChange = async (e) => {
    const { name, value } = e.target;
    setTravelDetails({ ...travelDetails, [name]: value });
  };

  const handleCustomerInputChange = async (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
    if (name === "email") {
      setShowError(false);
      setEmailExist(false);
      try {
        const response = await api.post("/api/auth/check-user-registerd", {
          email: value,
        });
        console.log(response.data);
        setEmailExist(response.data?.emailExists);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchAllAirports(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (
      selectedAirport &&
      dropOffDate &&
      dropOffTime &&
      pickupDate &&
      pickupTime &&
      dispatch &&
      toast &&
      dayDifference
    )
      handleFunctionForApi(
        selectedAirport,
        dropOffDate,
        dropOffTime,
        pickupDate,
        pickupTime
      );
  }, [
    selectedAirport,
    dropOffDate,
    dropOffTime,
    pickupDate,
    pickupTime,
    dispatch,
    toast,
    dayDifference,
    parkingOption,
  ]);

  useEffect(() => {
    const normalizedPickupDate = normalizeDate(pickupDate);
    const normalizedDropOffDate = normalizeDate(dropOffDate);

    const timeDifference = normalizedPickupDate - normalizedDropOffDate;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

    console.log(dayDifference);

    setDayDifference(dayDifference);
  }, [dropOffDate, pickupDate]);

  useEffect(() => {
    if (selectedVendor) calculatingBookingCharge();
  }, [selectedVendor, couponCode, checkedCancellationCover, vehiclesDetails]);

  useEffect(() => {
    if (couponCode) {
      checkingCouponCodeValidity();
    }
  }, [couponCode]);

  const handleAddAirport = () => {
    setShowAddDataModal(false);
  };

  const addDataModalHeader = () => {
    return (
      <div className="modal-header p-2">
        <h1 className="modal-title fs-5">Add new airport</h1>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowAddDataModal(false)}
        ></button>
      </div>
    );
  };

  const addDataModalFooter = () => {
    return (
      <div className="custom_modal_footer p-2">
        <Button
          label="Cancel"
          severity="secondary"
          className="modal_btn"
          onClick={() => setShowAddDataModal(false)}
        />
        <Button
          label={loading ? "Processing" : "Add"}
          className="submit-button modal_btn"
          loading={loading}
          onClick={handleAddAirport}
        />
      </div>
    );
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
      <Preloader />
      <div>
        <div className="page_header_area">
          <h4 className="page_heading">Reservation</h4>
        </div>
        <Toast ref={toast} />
        <div className="filter_area">
          <h6 className="section_part_heading">Quote details</h6>
          <div className="row">
            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="airport"
                  className="custom-form-label form-required"
                >
                  Select airport:{" "}
                </label>
                <Dropdown
                  id="airport"
                  value={selectedAirport}
                  onChange={(e) => {
                    setSelectedAirport(e.value);
                    setTravelDetails({
                      ...travelDetails,
                      departureTerminal: "",
                      arrivalTerminal: "",
                    });
                  }}
                  options={
                    Array.isArray(airports)
                      ? airports.map((airport) => ({
                          ...airport,
                          name: capitalizeFirstLetter(airport.name),
                        }))
                      : []
                  }
                  optionLabel="name"
                  placeholder="Select a Airport"
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />
                {showError && !selectedAirport && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}

                {/* <button
                  className="add_data_btn p-ripple"
                  onClick={() => setShowAddDataModal(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Add new airport
                  <Ripple />
                </button> */}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="dropOffDate"
                  className="custom-form-label form-required"
                >
                  Drop off date:{" "}
                </label>
                <Calendar
                  id="dropOffDate"
                  value={dropOffDate}
                  onChange={handleDropOffDateChange}
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                  minDate={today}
                  className="w-100"
                  invalid={showError}
                />
                {showError && !dropOffDate && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="dropOffTime"
                  className="custom-form-label form-required"
                >
                  Drop off time:{" "}
                </label>
                <Dropdown
                  id="dropOffTime"
                  value={dropOffTime}
                  onChange={(e) => setDropOffTime(e.value)}
                  options={times}
                  optionLabel="time"
                  placeholder="Select the time"
                  valueTemplate={selectedTimeTemplate}
                  itemTemplate={timeTemplate}
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />
                {showError && !dropOffTime && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="pickupDate"
                  className="custom-form-label form-required"
                >
                  Pickup date:{" "}
                </label>
                <Calendar
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.value);
                    setPickupDateStr(e.value.toLocaleDateString("en-GB"));
                  }}
                  placeholder="dd/mm/yyyy"
                  dateFormat="dd/mm/yy"
                  minDate={dropOffDate}
                  disabled={!dropOffDate}
                  className="w-100"
                  invalid={showError}
                />
                {showError && !pickupDate && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="pickupTime"
                  className="custom-form-label form-required"
                >
                  Pickup time:{" "}
                </label>
                <Dropdown
                  id="pickupTime"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.value)}
                  options={times}
                  optionLabel="time"
                  placeholder="Select the time"
                  valueTemplate={selectedTimeTemplate}
                  itemTemplate={timeTemplate}
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />
                {showError && !pickupTime && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label htmlFor="couponCode" className="custom-form-label">
                  Coupon Code:{" "}
                </label>
                <InputText
                  id="couponCode"
                  className="custom-form-input"
                  placeholder="Enter promo code"
                  invalid={showError}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                {/* {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                } */}

                {couponCode && couponValid ? (
                  <h6 className="coupon-valid success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Coupon is valid.
                  </h6>
                ) : couponCode && !couponValid ? (
                  <h6 className="coupon-valid error">
                    <i className="bi bi-x-circle-fill me-2"></i>
                    Coupon is invalid.
                  </h6>
                ) : null}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-0 mb-0">
                <label htmlFor="serviceType" className="custom-form-label">
                  Select Parking Type:{" "}
                </label>
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

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-0 mb-0">
                <label
                  htmlFor="vendor"
                  className="custom-form-label form-required"
                >
                  Select vendor:{" "}
                </label>
                <Dropdown
                  id="vendor"
                  value={selectedVendor?.companyName}
                  onChange={(e) =>
                    setSelectedVendor(
                      quotes?.find((q) => q.companyName === e.value)
                    )
                  }
                  options={quotes?.map((q) => q?.companyName)}
                  optionLabel="name"
                  placeholder="Select a Vendor"
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />
                {showError && !selectedVendor && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="filter_area">
          <h6 className="section_part_heading">Customer details</h6>

          <div className="row">
            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="title"
                  className="custom-form-label form-required"
                >
                  Title:{" "}
                </label>
                <Dropdown
                  id="title"
                  value={{ name: customerDetails.title }}
                  onChange={(e) =>
                    setCustomerDetails({
                      ...customerDetails,
                      title: e.value?.name,
                    })
                  }
                  options={titles}
                  optionLabel="name"
                  placeholder="Select"
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />
                {showError && !customerDetails.title && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label
                  htmlFor="firstName"
                  className="custom-form-label form-required"
                >
                  First Name:{" "}
                </label>
                <InputText
                  id="firstName"
                  className="custom-form-input"
                  placeholder="Enter First Name"
                  invalid={showError}
                  value={customerDetails.firstName}
                  name="firstName"
                  onChange={handleCustomerInputChange}
                />
                {showError && !customerDetails.firstName && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-3">
                <label htmlFor="lastName" className="custom-form-label">
                  Last Name:{" "}
                </label>
                <InputText
                  id="lastName"
                  className="custom-form-input"
                  placeholder="Enter Last Name"
                  invalid={showError}
                  value={customerDetails.lastName}
                  name="lastName"
                  onChange={handleCustomerInputChange}
                />
                {/* {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                } */}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-xl-0 mb-3">
                <label
                  htmlFor="mobileNumber"
                  className="custom-form-label form-required"
                >
                  Mobile Number:{" "}
                </label>
                <InputText
                  id="mobileNumber"
                  className="custom-form-input"
                  placeholder="Enter Mobile Number"
                  invalid={showError}
                  value={customerDetails.mobileNumber}
                  name="mobileNumber"
                  keyfilter="num"
                  onChange={handleCustomerInputChange}
                />
                {showError && !customerDetails.mobileNumber && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-0 mb-0">
                <label
                  htmlFor="email"
                  className="custom-form-label form-required"
                >
                  Email:{" "}
                </label>
                <InputText
                  id="email"
                  className="custom-form-input"
                  placeholder="Enter Email"
                  invalid={showError}
                  value={customerDetails.email}
                  name="email"
                  keyfilter="email"
                  onChange={handleCustomerInputChange}
                />
                {showError && !customerDetails.email && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
                <small className="text-danger form-error-msg">
                  {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email) &&
                  customerDetails.email
                    ? "Enter valid email"
                    : ""}
                </small>
                <small className="text-danger form-error-msg">
                  {emailExists ? "Email already exists" : ""}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="filter_area">
          <h6 className="section_part_heading">Travel details</h6>

          <div className="row">
            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-4 mb-xl-0 mb-3">
                <label
                  htmlFor="departTerminal"
                  className="custom-form-label form-required"
                >
                  Depart Terminal:{" "}
                </label>
                <Dropdown
                  id="departTerminal"
                  value={{ name: travelDetails.departureTerminal }}
                  onChange={(e) =>
                    setTravelDetails({
                      ...travelDetails,
                      departureTerminal: e.value?.name,
                    })
                  }
                  options={
                    selectedAirport && Array.isArray(selectedAirport.terminals)
                      ? selectedAirport.terminals?.map((ter) => {
                          return { name: ter };
                        })
                      : []
                  }
                  optionLabel="name"
                  placeholder="Select Terminal"
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />

                {showError && !travelDetails.departureTerminal && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-0 mb-3">
                <label
                  htmlFor="arrivalTerminal"
                  className="custom-form-label form-required"
                >
                  Arrival Terminal:{" "}
                </label>
                <Dropdown
                  id="arrivalTerminal"
                  value={{ name: travelDetails.arrivalTerminal }}
                  onChange={(e) =>
                    setTravelDetails({
                      ...travelDetails,
                      arrivalTerminal: e.value?.name,
                    })
                  }
                  options={
                    selectedAirport && Array.isArray(selectedAirport.terminals)
                      ? selectedAirport.terminals?.map((ter) => {
                          return { name: ter };
                        })
                      : []
                  }
                  optionLabel="name"
                  placeholder="Select Terminal"
                  className="w-full w-100 custom-form-dropdown"
                  invalid={showError}
                />

                {showError && !travelDetails.arrivalTerminal && (
                  <small className="text-danger form-error-msg">
                    This field is required
                  </small>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4 col-sm-6">
              <div className="custom-form-group mb-sm-0 mb-0">
                <label htmlFor="inBoundFlight" className="custom-form-label">
                  Inbound Flight/Vessel:{" "}
                </label>
                <InputText
                  id="inBoundFlight"
                  className="custom-form-input"
                  name="inBoundFlight"
                  placeholder="Enter Inbound"
                  invalid={showError}
                  value={travelDetails.inBoundFlight}
                  onChange={handleInputTravelDetailChange}
                />

                {/* {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                } */}
              </div>
            </div>
          </div>
        </div>

        <div className="filter_area">
          <h6 className="section_part_heading">Vehicle details</h6>

          {vehiclesDetails.map((vehicle, index) => (
            <div className="row">
              <div className="col-12 col-xl-4 col-sm-6">
                <div className="custom-form-group mb-sm-4 mb-3">
                  <label
                    htmlFor={`regNo-${index}`}
                    className="custom-form-label form-required"
                  >
                    Registration Number:{" "}
                  </label>
                  <InputText
                    id={`regNo-${index}`}
                    className="custom-form-input"
                    placeholder="Enter Registration No."
                    invalid={showError}
                    value={vehicle.regNo}
                    name="regNo"
                    onChange={(event) =>
                      handleInputVechicleDetailChange(index, event)
                    }
                  />
                  {showError && !vehicle.regNo && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 col-xl-4 col-sm-6">
                <div className="custom-form-group mb-sm-4 mb-3">
                  <label
                    htmlFor={`make-${index}`}
                    className="custom-form-label"
                  >
                    Make:{" "}
                  </label>
                  <InputText
                    id={`make-${index}`}
                    className="custom-form-input"
                    placeholder="Enter Make"
                    invalid={showError}
                    value={vehicle.make}
                    name="make"
                    onChange={(event) =>
                      handleInputVechicleDetailChange(index, event)
                    }
                  />
                  {/* {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    } */}
                </div>
              </div>

              <div className="col-12 col-xl-4 col-sm-6">
                <div className="custom-form-group mb-sm-4 mb-3">
                  <label
                    htmlFor={`model-${index}`}
                    className="custom-form-label"
                  >
                    Model:{" "}
                  </label>
                  <InputText
                    id={`model-${index}`}
                    className="custom-form-input"
                    placeholder="Enter Model"
                    invalid={showError}
                    value={vehicle.model}
                    name="model"
                    onChange={(event) =>
                      handleInputVechicleDetailChange(index, event)
                    }
                  />
                  {/* {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    } */}
                </div>
              </div>

              <div className="col-12 col-xl-4 col-sm-6">
                <div className="custom-form-group mb-sm-2 mb-3">
                  <label
                    htmlFor={`color-${index}`}
                    className="custom-form-label form-required"
                  >
                    Color:{" "}
                  </label>
                  <InputText
                    id={`color-${index}`}
                    className="custom-form-input"
                    placeholder="Enter Model"
                    invalid={showError}
                    value={vehicle.color}
                    name="color"
                    onChange={(event) =>
                      handleInputVechicleDetailChange(index, event)
                    }
                  />
                  {showError && !vehicle.color && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>

              <div className="col-12 mb-sm-4 mb-3">
                <Button
                  label="Add Vehicle"
                  className="aply-btn mt-3"
                  onClick={addVehicle}
                />
                {index !== 0 && (
                  <Button
                    label="Remove Vehicle"
                    severity="danger"
                    onClick={() => removeVehicle(index)}
                    className="mt-3 ml-2 mx-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="filter_area">
          <div className="row">
            <div className="col-12">
              <div className="custom-form-group mb-0">
                <div className="form-checkbox-area">
                  <Checkbox
                    inputId="cancellationCover"
                    onChange={(e) => {
                      setCheckedCancellationCover(e.checked);
                    }}
                    checked={checkedCancellationCover}
                    name="cancellationCover"
                    value="2"
                  />
                  <label htmlFor="cancellationCover" className="ml-2">
                    Cancellation Cover{" "}
                    {bookingCharge && bookingCharge?.cancellationCover > 0
                      ? "- £" + bookingCharge?.cancellationCover
                      : ""}
                  </label>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="total-price-area">
                <h5 className="total-price-text">Total :</h5>
                <h5 className="total-price">
                  {" "}
                  {loading
                    ? "calculating..."
                    : bookingCharge
                    ? "£" + bookingCharge?.totalPayable
                    : "£0"}
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end mt-4 pb-5">
          <Button
            label="CONFIRM BOOKING"
            className="aply-btn"
            loading={bookingLoading}
            onClick={handleBooking}
          />
        </div>
      </div>

      {/* User create/edit modal */}
      <Dialog
        header={addDataModalHeader}
        footer={addDataModalFooter}
        visible={showAddDataModal}
        onHide={() => {
          if (!showAddDataModal) return;
          setShowAddDataModal(false);
        }}
        className="custom-modal modal_dialog modal_dialog_sm"
      >
        <div className="modal-body p-2">
          <div className="data-view-area">
            <div className="row mt-sm-2">
              <div className="col-12">
                <div className="custom-form-group mb-3 mb-sm-4">
                  <label
                    htmlFor="airPortName"
                    className="custom-form-label form-required"
                  >
                    Air port
                  </label>
                  <InputText
                    id="firstName"
                    className="custom-form-input"
                    placeholder="Enter airport name"
                    name="firstName"
                    value={airportName}
                    onChange={(e) => setAirportName(e.target.value)}
                  />

                  {showAddError && (
                    <small className="text-danger form-error-msg">
                      This field is required
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      {/*  */}
    </>
  );
};

export default Reservation;
