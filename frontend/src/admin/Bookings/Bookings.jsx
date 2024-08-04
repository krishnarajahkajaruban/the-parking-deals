import React, { useState, useEffect, useRef } from "react";
import './Bookings.css';

import { Calendar } from 'primereact/calendar';
import { Ripple } from 'primereact/ripple';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { BookingData } from "./SampleData";

const Bookings = () => {
    const today = new Date();
    const [loading, setLoading] = useState(false);
    const [bookingDate, setBookingDate] = useState(null);
    const [searchKey, setSearchKey] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [rows, setRows] = useState(10);

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

    const searchBodyTemplate = (rowData) => {
        return (
            <Button
                icon="bi bi-eye-fill"
                className="data-view-button"
                data-bs-toggle="modal"
                data-bs-target="#bookingDetailModal"
            />
        );
    };
    return (
        <>
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
                            onPage={onPageChange}
                            loading={loading}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{ minWidth: "50rem" }}
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
                                body={searchBodyTemplate}
                                header="Info"
                                style={{ width: "10%" }}
                            ></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Bookings;