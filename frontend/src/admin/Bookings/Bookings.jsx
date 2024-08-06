import React, { useState, useEffect, useRef } from "react";
// import './Bookings.css';
import '../../pages/Dashboard/Dashboard.css';
import '../../pages/Dashboard/Dashboard-responsive.css';
import Preloader from "../../Preloader";

import { Calendar } from 'primereact/calendar';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import { BookingData } from "./SampleData";

const Bookings = () => {
    const today = new Date();
    const [loading, setLoading] = useState(false);
    const [bookingDate, setBookingDate] = useState(null);
    const [searchKey, setSearchKey] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rows, setRows] = useState(10);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const handleFilterByDate = (e) => {
        const bookdate = e.value;
    }

    useEffect(() => {
        const data = BookingData.getBookingsData
        setBookingData(data);
    }, [])

    const onPageChange = (event) => {
        setRows(event.rows);
    };

    const getSeverity = (booking) => {
        switch (booking.status) {
            case 'Pending':
                return 'warning';

            case 'Confirmed':
                return 'success';

            case 'Cancelled':
                return 'danger';

            default:
                return null;
        }
    };

    const statusBodyTemplate = (booking) => {
        return (
            <Tag value={booking.status} severity={getSeverity(booking)}></Tag>
        );
    };

    const infoBodyTemplate = (rowData) => {
        return (
            <Button
                icon="bi bi-eye-fill"
                className="data-view-button"
                onClick={() => setShowBookingModal(true)}
            />
        );
    };

    const bookingModalHeader = () => {
        return (
            <div className="modal-header p-2">
                <h1 className="modal-title fs-5" id="bookingDetailModalLabel">
                    Booking Info
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowBookingModal(false)}
                ></button>
            </div>
        )
    }

    return (
        <>
            <Preloader />
            <div>
                <h4 className="page_heading">Bookings</h4>

                <div className="filter_area">
                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-3">
                                <label htmlFor="bookingDate" className="custom-form-label">Filter by booking date : </label>
                                <div className="form-icon-group">
                                    <i className="bi bi-calendar2-fill input-grp-icon"></i>
                                    <Calendar id="bookingDate" value={bookingDate} onChange={handleFilterByDate} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={today} className='w-100' />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-3">
                                <label htmlFor="dropOffDate" className="custom-form-label">Search by booking id : </label>
                                <div className="form-icon-group">
                                    <i className="bi bi-search input-grp-icon"></i>
                                    <InputText
                                        id="searchKey"
                                        className="custom-form-input"
                                        name="searchKey"
                                        placeholder="Search here.."
                                        value={searchKey}
                                        onChange={(e) => setSearchKey(e.target.value)}
                                    />
                                    {/* <Calendar id="dropOffDate" value={bookingDate} onChange={handleFilterByDate} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={today} className='w-100' /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page_content">
                    <div className="dash-table-area">
                        <DataTable
                            value={bookingData}
                            paginator
                            size="small"
                            rows={rows}
                            totalRecords={totalRecords}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{ minWidth: "50rem" }}
                            rowHover
                            className="dash-table"
                        >
                            <Column
                                header="Booking ID"
                                field="bookingId"
                                style={{ width: "20%" }}
                            ></Column>
                            <Column
                                header="Date"
                                field="date"
                                style={{ width: "30%" }}
                            ></Column>
                            <Column
                                header="Status"
                                body={statusBodyTemplate}
                                style={{ width: "25%" }}
                            ></Column>
                            <Column
                                body={infoBodyTemplate}
                                header="Info"
                                style={{ width: "10%" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* Booking view modal */}
            <Dialog header={bookingModalHeader} visible={showBookingModal}
                onHide={() => { if (!showBookingModal) return; setShowBookingModal(false); }}
                className="custom-modal modal_dialog modal_dialog_md">
                <div className="modal-body p-2">
                    <div className="data-view-area">
                        <h5 className="data-view-head">Booking Details</h5>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Provider :</h6>
                                    <h6 className="data-view-data">
                                        Parking deals
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Location :</h6>
                                    <h6 className="data-view-data">
                                        London UK
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3 mb-lg-0">
                                    <h6 className="data-view-title">
                                        Drop Off Date & Time :
                                    </h6>
                                    <h6 className="data-view-data">
                                        10-06-2024 & 10:36 AM
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Return Date & Time :
                                    </h6>
                                    <h6 className="data-view-data">
                                        12-06-2024 & 10:20 AM
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="data-view-sub mt-3">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Booking Quote :</h6>
                                        <h6 className="data-view-data">
                                            £ 150
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Booking Fee :</h6>
                                        <h6 className="data-view-data">
                                            £ 250
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3 mb-lg-0">
                                        <h6 className="data-view-title">Discount :</h6>
                                        <h6 className="data-view-data">
                                            £ 50
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-0">
                                        <h6 className="data-view-title">Total :</h6>
                                        <h6 className="data-view-data">
                                            £ 200
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Travel Details</h5>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Depart Terminal :</h6>
                                    <h6 className="data-view-data">
                                        Terminal 1
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">
                                        Arrival Terminal :
                                    </h6>
                                    <h6 className="data-view-data">
                                        Terminal 2
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Inbound Flight/Vessel :
                                    </h6>
                                    <h6 className="data-view-data">
                                        ---
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Vehicle Details</h5>
                        <div className="data-view-sub mt-3">
                            <h6 className="data-view-sub-head">
                                Vehicle 1
                            </h6>
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">
                                            Registration Number :
                                        </h6>
                                        <h6 className="data-view-data">
                                            123456
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Make :</h6>
                                        <h6 className="data-view-data">Audi</h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3 mb-lg-0">
                                        <h6 className="data-view-title">Model :</h6>
                                        <h6 className="data-view-data">
                                            A8
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-0">
                                        <h6 className="data-view-title">Color :</h6>
                                        <h6 className="data-view-data">
                                            Black
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default Bookings;