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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const VendorBookings = () => {
    const {id} = useParams();
    const today = new Date();
    const [loading, setLoading] = useState(false);

    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterOption, setFilterOption] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [bookingData, setBookingData] = useState([]);
    const [totalInitialQuote, setTotalInitialQuote] = useState(0);
    const [dealPercentage, setDealPercentage] = useState(0);
    const [vendorName, setVendorName] = useState("");
    const [totalBalance, setTotalBalance] = useState(0);
    const dt = useRef(null);
    const token = useSelector((state) => state.auth.token);
    const [period, setPeriod] = useState("");

    const fetchData = async () => {
        if(id && token) {
            try {
                setLoading(true);
                const data = await SampleVendorData.getVendorBookingsData(token, id, period);
                setBookingData(data.bookings);
                setDealPercentage(data.dealPercentage);
                setVendorName(data.companyName);
                setTotalInitialQuote(data.totalBookingQuote);
                setTotalBalance(data.totalBalance);
            } catch (error) {
                console.error("Failed to fetch vendor bookings data:", error);
            }finally{
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        fetchData();
    }, [id, token, period]);

    useEffect(() => {
        if (filterOption) {
            if (filterOption?.name === 'Custom' && startDate && endDate) {
                setPeriod(`${startDate?.toLocaleDateString('en-GB')}-${endDate?.toLocaleDateString('en-GB')}`);
            } else if(filterOption?.name !== 'Custom'){
                setPeriod(filterOption?.name);
            }else{
                setPeriod("");
            };
        }else{
            setPeriod("");
        };
    }, [filterOption, startDate, endDate]);



    // const exportToPDF = () => {
    //     const doc = new jsPDF();

    //     const columns = [
    //         { title: "Booking ID", dataKey: "bookingId" },
    //         { title: "Booking Quote", dataKey: "bookingQuote" },
    //         { title: "Deal Percentage", dataKey: "dealPercentage" },
    //         { title: "Balance", dataKey: "balance" }
    //     ];

    //     const data = bookingData.map(item => ({
    //         bookingId: item.bookingId,
    //         bookingQuote: parseFloat(item.bookingQuote || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    //         dealPercentage: parseFloat(dealPercentage || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    //         balance: parseFloat(item.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    //     }));

    //     doc.autoTable({
    //         head: [columns.map(col => col.title)],
    //         body: data.map(row => columns.map(col => row[col.dataKey])),
    //         margin: { top: 10 },
    //         foot: [
    //             ["", "", "Total Booking Quote", totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
    //             ["", "", "Total Balance", totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })]
    //         ]
    //     });

    //     doc.save('VendorBookings.pdf');
    // };


    const exportToPDF = () => {
        const doc = new jsPDF();
    
        const columns = [
            { title: "Booking ID", dataKey: "bookingId" },
            { title: "Booking Quote", dataKey: "bookingQuote" },
            { title: "Deal Percentage", dataKey: "dealPercentage" },
            { title: "Balance", dataKey: "balance" }
        ];
    
        const data = bookingData.map(item => ({
            bookingId: item.bookingId,
            bookingQuote: parseFloat(item.bookingQuote || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            dealPercentage: parseFloat(item.dealPercentage || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            balance: parseFloat(item.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }));
    
        // Generate the table without the footer
        doc.autoTable({
            head: [columns.map(col => col.title)],
            body: data.map(row => columns.map(col => row[col.dataKey])),
            margin: { top: 10 },
        });
    
        // Get the total number of pages
        const pageCount = doc.internal.getNumberOfPages();
    
        // Add the footer only on the last page
        doc.setPage(pageCount);
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    
        doc.text("Total Booking Quote", 14, pageHeight - 30);
        doc.text(totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 150, pageHeight - 30);
        doc.text("Total Balance", 14, pageHeight - 15);
        doc.text(totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 150, pageHeight - 15);
    
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
                    <h6 className="text-pink">{vendorName}</h6>
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
                                disabled={bookingData.length === 0}
                                onClick={exportToPDF}
                            />
                        </div>
                    </div>
                </div>

                <div className="page_content">
                    {bookingData && bookingData?.length > 0 && (
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
                                    header="Booking Date"
                                    field="date"
                                    style={{ width: "20%" }}
                                ></Column>

                                <Column
                                    header="Booking quote"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData.bookingQuote
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(rowData.bookingQuote).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    footer={<span className="text_no_wrap flex_end">{totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>

                                <Column
                                    header="Deal Percentage"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        dealPercentage
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(dealPercentage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    // footer={<span className="text_no_wrap flex_end">{totalDealPercentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>

                                <Column
                                    header="Balance"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData?.balance
                                            ? <span className="text_no_wrap flex_end">
                                                {parseFloat(rowData?.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : 0}
                                    style={{ width: "25%" }}
                                    footer={<span className="text_no_wrap flex_end">{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>
                            </DataTable>
                        </div>
                    )} 
                    {loading &&  (
                        <div className="no_data_found_area">
                            <h6>Loading...</h6>
                        </div>
                    )}

                    {!loading && bookingData && bookingData?.length === 0 && (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No customer data!" />
                            <h6>No Booking data!</h6>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default VendorBookings;