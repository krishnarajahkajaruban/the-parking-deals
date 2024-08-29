import React, { useEffect, useState, useRef } from "react";
import './Reservation.css';

import { Link, useNavigate } from "react-router-dom";

import Preloader from "../../Preloader";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Editor } from "primereact/editor";
import { Calendar } from 'primereact/calendar';


const Reservation = () => {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    const times = [
        { time: '00:00' },
        { time: '00:30' },
        { time: '01:00' },
        { time: '01:30' },
        { time: '02:00' },
        { time: '02:30' },
        { time: '03:00' },
        { time: '03:30' },
        { time: '04:00' },
        { time: '04:30' },
        { time: '05:00' },
        { time: '05:30' },
        { time: '06:00' },
        { time: '06:30' },
        { time: '07:00' },
        { time: '07:30' },
        { time: '08:00' },
        { time: '08:30' },
        { time: '09:00' },
        { time: '09:30' },
        { time: '10:00' },
        { time: '10:30' },
        { time: '11:00' },
        { time: '11:30' },
        { time: '12:00' },
        { time: '12:30' },
        { time: '13:00' },
        { time: '13:30' },
        { time: '14:00' },
        { time: '14:30' },
        { time: '15:00' },
        { time: '15:30' },
        { time: '16:00' },
        { time: '16:30' },
        { time: '17:00' },
        { time: '17:30' },
        { time: '18:00' },
        { time: '18:30' },
        { time: '19:00' },
        { time: '19:30' },
        { time: '20:00' },
        { time: '20:30' },
        { time: '21:00' },
        { time: '21:30' },
        { time: '22:00' },
        { time: '22:30' },
        { time: '23:00' },
        { time: '23:30' },
    ];

    const airports = [
        { name: 'Luton' },
        { name: 'Air ways' }
    ]

    const vendors = [
        { name: 'Airport Parking Bay' },
        { name: 'Luton 247' }
    ]

    const today = new Date();

    /* Quote details */
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

    /* Travel details */
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
    const [inBoundFlight, setInBoundFlight] = useState("");

    /* Customer details */
    const titles = [
        { name: 'Mr.' },
        { name: 'Mrs.' },
        { name: 'Ms.' },
        { name: 'Miss.' },
    ];

    const initalCustomerDetails = {
        title: titles[0].name,
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
    };

    const [customerDetails, setCustomerDetails] = useState(initalCustomerDetails);

    /* Vechile details */
    const initialVehiclesDetails = [
        {
            regNo: "",
            color: "",
            make: "",
            model: ""
        }
    ];
    const [vehiclesDetails, setVehiclesDetails] = useState(initialVehiclesDetails);

    const [checkedCancellationCover, setCheckedCancellationCover] = useState(false);
    const [bookingCharge, setBookingCharge] = useState();

    const handleDropOffDateChange = (e) => {
        const newDropOffDate = e.value;
        setDropOffDate(newDropOffDate);
        setDropOffDateStr(newDropOffDate.toLocaleDateString('en-GB'));

        if (newDropOffDate) {
            const newPickupDate = new Date(newDropOffDate);
            newPickupDate.setDate(newPickupDate.getDate() + 7);
            setPickupDate(newPickupDate);
            setPickupDateStr(newPickupDate.toLocaleDateString('en-GB'));
        } else {
            setPickupDate(null);
            setPickupDate("");
        }
    };

    const parseTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);
        return date;
    };

    const selectedTimeTemplate = (option, props) => {
        if (option) {
            const time = parseTime(option.time);
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return props.placeholder;
    };

    const timeTemplate = (option) => {
        const time = parseTime(option.time);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        setVehiclesDetails([...vehiclesDetails, { regNo: '', make: '', model: '', color: '' }]);
    };

    const removeVehicle = (index) => {
        const newVehicleDetails = vehiclesDetails.filter((_, i) => i !== index);
        setVehiclesDetails(newVehicleDetails);
    };

    const handleCustomerInputChange = async (e) => {
        const { name, value } = e.target;
        setCustomerDetails({ ...customerDetails, [name]: value });
    };

    return (
        <>
            <Preloader />
            <div>
                <div className="page_header_area">
                    <h4 className="page_heading">Reservation</h4>
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Quote details</h6>
                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="airport" className="custom-form-label">Select airport: </label>
                                <Dropdown id='airport' value={selectedAirport} onChange={(e) => setSelectedAirport(e.value)} options={airports} optionLabel="name" placeholder="Select a Airport"
                                    className="w-full w-100 custom-form-dropdown" invalid={showError} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="dropOffDate" className="custom-form-label">Drop off date: </label>
                                <Calendar id="dropOffDate" value={dropOffDate} onChange={handleDropOffDateChange} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={today} className='w-100' invalid={showError} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="dropOffTime" className="custom-form-label">Drop off time: </label>
                                <Dropdown
                                    id='dropOffTime'
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
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="pickupDate" className="custom-form-label">Pickup date: </label>
                                <Calendar id="pickupDate" value={pickupDate} onChange={(e) => { setPickupDate(e.value); setPickupDateStr(e.value.toLocaleDateString('en-GB')) }} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={dropOffDate} disabled={!dropOffDate} className='w-100' invalid={showError} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="pickupTime" className="custom-form-label">Pickup time: </label>
                                <Dropdown
                                    id='pickupTime'
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
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="couponCode" className="custom-form-label">Coupon Code: </label>
                                <InputText id="couponCode" className="custom-form-input" placeholder='Enter promo code' invalid={showError}
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-0">
                                <label htmlFor="vendor" className="custom-form-label">Select vendor: </label>
                                <Dropdown id='vendor' value={selectedVendor} onChange={(e) => setSelectedVendor(e.value)} options={vendors} optionLabel="name" placeholder="Select a Vendor"
                                    className="w-full w-100 custom-form-dropdown" invalid={showError} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Customer details</h6>

                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="title" className="custom-form-label">Title: </label>
                                <Dropdown id='title' value={{ name: customerDetails.title }} onChange={(e) => setCustomerDetails({ ...customerDetails, title: e.value?.name })}
                                    options={titles} optionLabel="name" placeholder="Select"
                                    className="w-full w-100 custom-form-dropdown" invalid={showError} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="firstName" className="custom-form-label">First Name: </label>
                                <InputText id="firstName" className="custom-form-input" placeholder='Enter First Name' invalid={showError}
                                    value={customerDetails.firstName} name="firstName"
                                    onChange={handleCustomerInputChange} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-3">
                                <label htmlFor="lastName" className="custom-form-label">Last Name: </label>
                                <InputText id="lastName" className="custom-form-input" placeholder='Enter Last Name' invalid={showError}
                                    value={customerDetails.lastName} name="lastName"
                                    onChange={handleCustomerInputChange} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-xl-0 mb-3">
                                <label htmlFor="mobileNumber" className="custom-form-label">Mobile Number: </label>
                                <InputText id="mobileNumber" className="custom-form-input" placeholder='Enter Mobile Number' invalid={showError}
                                    value={customerDetails.mobileNumber} name="mobileNumber" keyfilter="num"
                                    onChange={handleCustomerInputChange} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-0">
                                <label htmlFor="email" className="custom-form-label">Email: </label>
                                <InputText id="email" className="custom-form-input" placeholder='Enter Email' invalid={showError}
                                    value={customerDetails.email} name="email" keyfilter="email"
                                    onChange={handleCustomerInputChange} />
                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Travel details</h6>

                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-4 mb-xl-0 mb-3">
                                <label htmlFor="departTerminal" className="custom-form-label">Depart Terminal: </label>
                                <Dropdown id='departTerminal' value={departTerminal} onChange={(e) => setDepartTerminal(e.value)} options={depart_terminals} optionLabel="name" placeholder="Select Terminal"
                                    className="w-full w-100 custom-form-dropdown" invalid={showError} />

                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-3">
                                <label htmlFor="arrivalTerminal" className="custom-form-label">Arrival Terminal: </label>
                                <Dropdown id='arrivalTerminal' value={arrivalTerminal} onChange={(e) => setArrivalTerminal(e.value)} options={arrival_terminals} optionLabel="name" placeholder="Select Terminal"
                                    className="w-full w-100 custom-form-dropdown" invalid={showError} />

                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-0">
                                <label htmlFor="inBoundFlight" className="custom-form-label">Inbound Flight/Vessel: </label>
                                <InputText id="inBoundFlight" className="custom-form-input" placeholder='Enter Inbound' invalid={showError}
                                    value={inBoundFlight}
                                    onChange={(e) => setInBoundFlight(e.target.value)} />

                                {showError &&
                                    <small className="text-danger form-error-msg">This field is required</small>
                                }
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
                                    <label htmlFor={`regNo-${index}`} className="custom-form-label">Registration Number: </label>
                                    <InputText id={`regNo-${index}`} className="custom-form-input" placeholder='Enter Registration No.' invalid={showError}
                                        value={vehicle.regNo} name="regNo"
                                        onChange={(event) => handleInputVechicleDetailChange(index, event)} />
                                    {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor={`make-${index}`} className="custom-form-label">Make: </label>
                                    <InputText id={`make-${index}`} className="custom-form-input" placeholder='Enter Make' invalid={showError}
                                        value={vehicle.make} name="make"
                                        onChange={(event) => handleInputVechicleDetailChange(index, event)} />
                                    {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor={`model-${index}`} className="custom-form-label">Model: </label>
                                    <InputText id={`model-${index}`} className="custom-form-input" placeholder='Enter Model' invalid={showError}
                                        value={vehicle.model} name="model"
                                        onChange={(event) => handleInputVechicleDetailChange(index, event)} />
                                    {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-2 mb-3">
                                    <label htmlFor={`color-${index}`} className="custom-form-label">Color: </label>
                                    <InputText id={`color-${index}`} className="custom-form-input" placeholder='Enter Model' invalid={showError}
                                        value={vehicle.color} name="color"
                                        onChange={(event) => handleInputVechicleDetailChange(index, event)} />
                                    {showError &&
                                        <small className="text-danger form-error-msg">This field is required</small>
                                    }
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

                        <div className="col-12">
                            <div className="total-price-area">
                                <h5 className="total-price-text">Total :</h5>
                                <h5 className="total-price">£ {bookingCharge?.totalPayable || 0}</h5>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-end mt-4 pb-5">
                    <Button
                        label="CONFIRM BOOKING"
                        className="aply-btn"
                    />
                </div>
            </div>
        </>
    )
}

export default Reservation;