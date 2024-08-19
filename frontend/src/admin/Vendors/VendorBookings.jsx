import React, { useState, useEffect, useRef } from "react";
import '../../pages/Dashboard/Dashboard.css';
import '../../pages/Dashboard/Dashboard-responsive.css';
import Preloader from "../../Preloader";

import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { SampleVendorData } from "./SampleVendorData";

const VendorBookings = () => {
    const today = new Date();
    const [loading, setLoading] = useState(false);

    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterOption, setFilterOption] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [bookingData, setBookingData] = useState([]);
    const [totalInitialQuote, setTotalInitialQuote] = useState(0);
    const [totalDealPercentage, setTotalDealPercentage] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);
    const dt = useRef(null);

    useEffect(() => {
        const data = SampleVendorData.getVendorBookingsData();

        if (Array.isArray(data)) {
            setBookingData(data);

            const initialQuoteTotal = data.reduce((sum, item) => sum + parseFloat(item.initialQuote || 0), 0);
            const dealPercentageTotal = data.reduce((sum, item) => sum + parseFloat(item.dealPercentage || 0), 0);
            const balanceTotal = data.reduce((sum, item) => sum + (parseFloat(item.initialQuote || 0) - parseFloat(item.dealPercentage || 0)), 0);

            setTotalInitialQuote(initialQuoteTotal);
            setTotalDealPercentage(dealPercentageTotal);
            setTotalBalance(balanceTotal);
        } else {
            console.error("Error", data);
            setBookingData([]);
        }
    }, []);

    const exportToPDF = () => {
        const doc = new jsPDF();

        const columns = [
            { title: "Booking ID", dataKey: "bookingId" },
            { title: "Initial Quote", dataKey: "initialQuote" },
            { title: "Deal Percentage", dataKey: "dealPercentage" },
            { title: "Balance", dataKey: "balance" }
        ];

        const data = bookingData.map(item => ({
            bookingId: item.bookingId,
            initialQuote: parseFloat(item.initialQuote || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            dealPercentage: parseFloat(item.dealPercentage || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            balance: (parseFloat(item.initialQuote || 0) - parseFloat(item.dealPercentage || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }));

        doc.autoTable({
            head: [columns.map(col => col.title)],
            body: data.map(row => columns.map(col => row[col.dataKey])),
            margin: { top: 10 },
            foot: [
                ["", "", "Total Initial Quote", totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
                ["", "", "Total Deal Percentage", totalDealPercentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
                ["", "", "Total Balance", totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })]
            ]
        });

        doc.save('VendorBookings.pdf');
    };

    const filterOptions = [
        { name: 'This week' },
        { name: 'This month' },
        { name: 'This year' },
        { name: 'Last week' },
        { name: 'Last month' },
        { name: 'Last year' },
        { name: 'Custom' },
    ];

    return (
        <>
            <Preloader />
            <div>
                <div className="page_header_area">
                    <h4 className="page_heading">Bookings</h4>
                    <h6 className="text-pink">Luton 247 Meet & Greet</h6>
                </div>

                <div className="filter_area">
                    <div className="row">
                        <div className="col-12 col-xl-4 col-sm-6">
                            <div className="custom-form-group custom mb-sm-0 mb-3">
                                <label htmlFor="filterOption" className="custom-form-label">Filter by: </label>
                                <div className="form-icon-group">
                                    <i className="bi bi-funnel-fill input-grp-icon"></i>
                                    <Dropdown id="filterOption" value={filterOption} onChange={(e) => setFilterOption(e.value)} options={filterOptions} optionLabel="name"
                                        placeholder="Select option" className="w-full w-100 custom-form-dropdown" showClear />
                                </div>
                            </div>
                        </div>

                        {filterOption?.name === 'Custom' && (
                            <>
                                <div className="col-12 col-xl-4 col-sm-6">
                                    <div className="custom-form-group mb-sm-0 mb-3">
                                        <label htmlFor="bookingDate" className="custom-form-label">Select start date: </label>
                                        <div className="form-icon-group">
                                            <i className="bi bi-calendar-range-fill input-grp-icon"></i>
                                            <Calendar id="bookingDate" value={startDate} onChange={(e) => setStartDate(e.value)} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" maxDate={today} className='w-100' />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-xl-4 col-sm-6">
                                    <div className="custom-form-group mb-sm-0 mb-3">
                                        <label htmlFor="bookingDate" className="custom-form-label">Select end date: </label>
                                        <div className="form-icon-group">
                                            <i className="bi bi-calendar-range-fill input-grp-icon"></i>
                                            <Calendar id="bookingDate" value={endDate} onChange={(e) => setEndDate(e.value)} disabled={!startDate} placeholder='dd/mm/yyyy' dateFormat="dd/mm/yy" minDate={startDate} className='w-100' />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="row mt-3">
                        <div className="ext-end">
                            <Button
                                label="Export as PDF"
                                icon="bi bi-filetype-pdf"
                                className="btn_primary"
                                onClick={exportToPDF}
                            />
                        </div>
                    </div>
                </div>

                <div className="page_content">
                    {bookingData?.length > 0 ? (
                        <div className="dash-table-area">
                            <DataTable
                                ref={dt}
                                // paginator
                                // rows={rows}
                                // totalRecords={totalRecords}
                                // rowsPerPageOptions={[5, 10, 25, 50]}
                                value={bookingData}
                                size="small"
                                tableStyle={{ minWidth: "50rem" }}
                                rowHover

                                showGridlines
                                id="datatable"
                                className="dash-table"
                            >
                                <Column
                                    body={(rowData, { rowIndex }) => <span>{rowIndex + 1}.</span>}
                                    style={{ width: "5%" }}
                                ></Column>

                                <Column
                                    header="Booking ID"
                                    field="bookingId"
                                    style={{ width: "20%" }}
                                ></Column>

                                <Column
                                    header="Initial quote"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData.initialQuote
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(rowData.initialQuote).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    footer={<span className="text_no_wrap flex_end">{totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>

                                <Column
                                    header="Deal Percentage"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData.dealPercentage
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(rowData.dealPercentage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    footer={<span className="text_no_wrap flex_end">{totalDealPercentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>

                                <Column
                                    header="Balance"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData.initialQuote
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(rowData.initialQuote - rowData.dealPercentage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    footer={<span className="text_no_wrap flex_end">{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>
                            </DataTable>
                        </div>
                    ) : (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No booking data!" />
                            <h6>No booking data!</h6>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default VendorBookings;