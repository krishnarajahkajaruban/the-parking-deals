import React, { useState } from 'react';
import './VendorList.css';
import './VendorList-responsive.css';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Tilt from 'react-parallax-tilt';

import { InputText } from "primereact/inputtext";
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

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
                                    <button className='edit-float-btn'>
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
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
                                                                <h6><i class="bi bi-calendar-check-fill me-2"></i> 12/06/2024</h6>
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <h6><i class="bi bi-clock-fill me-2"></i> 11:20</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6">
                                                    <div className="results-option-data-area">
                                                        <h5>Pickup Detail</h5>
                                                        <div className="row">
                                                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                                                <h6><i class="bi bi-calendar-check-fill me-2"></i> 12/06/2024</h6>
                                                            </div>
                                                            <div className="col-12 col-md-6">
                                                                <h6><i class="bi bi-clock-fill me-2"></i> 11:20</h6>
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

            <Footer />
        </>
    )
}

export default VendorList;