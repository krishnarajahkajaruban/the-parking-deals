import React, { useState, useEffect } from "react";
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

import { SampleData } from '../../BookingData';
import { useSelector } from "react-redux";

const Bookings = () => {
    const today = new Date();
    const [loading, setLoading] = useState(false);
    const [bookingDate, setBookingDate] = useState(null);
    const [searchKey, setSearchKey] = useState(null);
    const [bookings, setBookings] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rows, setRows] = useState(10);
    const [page, setPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [rowPerPage, setRowsPerPage] = useState([5]);

    const token = useSelector((state) => state.auth.token);

    const handleFilterByDate = (e) => {
        const date = e.value ? e.value.toLocaleDateString('en-GB') : null;
        fetchBookings(null, date);
    };

    const fetchBookings = async (bookingId, date) => {
        console.log(bookingId);   
        console.log(date);
        setLoading(true);
        const data = await SampleData.getData(token, bookingId, date);
        console.log(data.bookings);
        setBookings(data.bookings);
        setTotalRecords(data.totalRecords);
        const newRowPerPage = ([5,10,25,50].filter(x => x<Number(data.totalRecords)));
        setRowsPerPage([...newRowPerPage, Number(data.totalRecords)])
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings(null, null);
    }, []);

    const onPageChange = (event) => {
        console.log(event);
        // setPage(event.page + 1);
        // setRows(event.rows);
    };

    const dateTimeTemplate = (rowData) => {
        return `${rowData.date} ${rowData.time}`;
    };

    const getSeverity = (booking) => {
        switch (booking.status) {
            case 'Pending':
                return 'warning';

            case 'Paid':
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
                onClick={() => { setShowBookingModal(true); setSelectedBooking(rowData.details) }}
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
                <div className="page_header_area">
                    <h4 className="page_heading">Bookings</h4>
                </div>

                <div className="filter_area">
                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group mb-sm-0 mb-3">
                                <label htmlFor="bookingDate" className="custom-form-label">Filter by booking date : </label>
                                <div className="form-icon-group">
                                    <i className="bi bi-calendar2-fill input-grp-icon"></i>
                                    <Calendar id="bookingDate" value={bookingDate} onChange={(e)=>
                                        {
                                            setBookingDate(e.value); 
                                            handleFilterByDate(e); 
                                        }
                                    } placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" 
                                    maxDate={today} 
                                    className='w-100' />
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                                setSearchKey(value); 
                                                const bookingId = value ? value : null;         
                                                fetchBookings(bookingId, null);
                                        }}
                                    />
                                    {/* <Calendar id="dropOffDate" value={bookingDate} onChange={handleFilterByDate} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={today} className='w-100' /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page_content">
                {bookings && bookings?.length > 0 && (
                    <div className="dash-table-area">
                        <DataTable
                            value={bookings}
                            paginator
                            size="small"
                            rows={rows}
                            totalRecords={totalRecords}
                            // onPage={onPageChange}
                            loading={loading}
                            rowsPerPageOptions={rowPerPage}
                            tableStyle={{ minWidth: "50rem" }}
                            rowHover
                            className="dash-table"
                        >
                            <Column
                                header="Booking ID"
                                field="id"
                                style={{ width: "20%" }}
                            ></Column>
                            <Column
                                header="Date & Time"
                                body={dateTimeTemplate}
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
                    ) }
                   {loading &&  (
                        <div className="no_data_found_area">
                            {/* <img src="/assets/images/no_data_2.svg" alt="No booking data!" /> */}
                            <h6>Loading...</h6>
                        </div>
                    )}
                    {!loading && bookings && bookings?.length === 0 && (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No booking data!" />
                            <h6>No booking data!</h6>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking view modal */}
            {selectedBooking && <Dialog header={bookingModalHeader} visible={showBookingModal}
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
                                        {selectedBooking.company.companyName}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Location :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.airportName}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3 mb-lg-0">
                                    <h6 className="data-view-title">
                                        Drop Off Date & Time :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {
                                            selectedBooking.dropOffDate
                                        } & {selectedBooking.dropOffTime}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Return Date & Time :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {
                                            selectedBooking.pickUpDate
                                        } & {selectedBooking.pickUpTime}
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
                                            £ {selectedBooking.bookingQuote}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Booking Fee :</h6>
                                        <h6 className="data-view-data">
                                            £ {selectedBooking.bookingFee}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3 mb-lg-0">
                                        <h6 className="data-view-title">Discount :</h6>
                                        <h6 className="data-view-data">
                                            £ {selectedBooking.couponDiscount}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-0">
                                        <h6 className="data-view-title">Total :</h6>
                                        <h6 className="data-view-data">
                                            £ {selectedBooking.totalPayable}
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
                                        {selectedBooking.travelDetail.departureTerminal}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">
                                        Arrival Terminal :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.travelDetail.arrivalTerminal}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Inbound Flight/Vessel :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.travelDetail.inBoundFlight || "-"}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Vehicle Details</h5>
                        {selectedBooking.vehicleDetail.map((vehicle, index) => (
                            <div key={index} className="data-view-sub mt-3">
                                <h6 className="data-view-sub-head">
                                    Vehicle {index + 1}
                                </h6>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <div className="data-view mb-3">
                                            <h6 className="data-view-title">
                                                Registration Number :
                                            </h6>
                                            <h6 className="data-view-data">
                                                {vehicle.regNo}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="data-view mb-3">
                                            <h6 className="data-view-title">Make :</h6>
                                            <h6 className="data-view-data">{vehicle.make || "-"}</h6>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="data-view mb-3 mb-lg-0">
                                            <h6 className="data-view-title">Model :</h6>
                                            <h6 className="data-view-data">
                                                {vehicle.model || "-"}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <div className="data-view mb-0">
                                            <h6 className="data-view-title">Color :</h6>
                                            <h6 className="data-view-data">
                                                {vehicle.color}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Customer Details</h5>
                        {selectedBooking.user ? <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Name :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.user.title + ' ' + selectedBooking.user.firstName + ' ' + selectedBooking.user.lastname}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">
                                        Email :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.user.email}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Mobile Number :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.user.mobileNumber}
                                    </h6>
                                </div>
                            </div>
                        </div> : "Not Found!"}
                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Vendor Details</h5>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Vendor :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.company.companyName}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">
                                        Email :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.company.email}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Mobile Number :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBooking.company.mobileNumber}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>}
            {/*  */}
        </>
    )
}

export default Bookings;