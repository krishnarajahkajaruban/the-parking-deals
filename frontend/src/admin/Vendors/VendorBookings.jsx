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
    const { id } = useParams();
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

    const user = useSelector((state) => state.auth.user)

    const [bookingStartDate, setBookingStartDate] = useState("");
    const [bookingEndDate, setBookingEndDate] = useState("");

    const fetchData = async () => {
        if (id && token) {
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
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        fetchData();
    }, [id, token, period]);

    useEffect(() => {
        if (filterOption) {
            setBookingDate(filterOption.name);
        }
    }, [filterOption]);

    useEffect(() => {
        if (filterOption) {
            if (filterOption?.name === 'Custom' && startDate && endDate) {
                setPeriod(`${startDate?.toLocaleDateString('en-GB')}-${endDate?.toLocaleDateString('en-GB')}`);
            } else if (filterOption?.name !== 'Custom') {
                setPeriod(filterOption?.name);
            } else {
                setPeriod("");
            };
        } else {
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

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getStartOfWeek = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    const getStartOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getStartOfYear = (date) => {
        return new Date(date.getFullYear(), 0, 1);
    };

    const getEndOfWeek = (date) => {
        const startOfWeek = getStartOfWeek(new Date(date));
        return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6));
    };

    const getEndOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };

    const getEndOfYear = (date) => {
        return new Date(date.getFullYear(), 11, 31);
    };

    const setBookingDate = async () => {
        let bookingPeriod = filterOption?.name;
        console.log(bookingPeriod)
        let start;
        let end;
        const today = new Date();

        if (bookingPeriod === 'This week') {
            start = getStartOfWeek(today);
            end = getEndOfWeek(today);
        } else if (bookingPeriod === 'This month') {
            start = getStartOfMonth(today);
            end = getEndOfMonth(today);
        } else if (bookingPeriod === 'This year') {
            start = getStartOfYear(today);
            end = getEndOfYear(today);
        } else if (bookingPeriod === 'Last week') {
            const lastWeekStart = getStartOfWeek(today);
            start = new Date(lastWeekStart.setDate(lastWeekStart.getDate() - 7));
            end = new Date(lastWeekStart.setDate(start.getDate() + 6));
        } else if (bookingPeriod === 'Last month') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            start = getStartOfMonth(lastMonth);
            end = getEndOfMonth(lastMonth);
        } else if (bookingPeriod === 'Last year') {
            const lastYear = new Date(today.getFullYear() - 1, 0, 1);
            start = getStartOfYear(lastYear);
            end = getEndOfYear(lastYear);
        } else if (bookingPeriod === 'Custom') {
            if (!startDate || !endDate) {
                setBookingStartDate('');
                setBookingEndDate('');
                return;
            } else if (startDate instanceof Date && !isNaN(startDate) && endDate instanceof Date && !isNaN(endDate)) {
                start = startDate;
                end = endDate;
            } else {
                console.error("startDate or endDate is invalid for Custom period");
                return;
            }
        } else {
            console.error("Invalid period selected");
            return;
        }

        setBookingStartDate(formatDate(start));
        setBookingEndDate(formatDate(end));
    };


    const exportToPDF = async () => {
        const doc = new jsPDF();

        // const logoUrl = "https://www.theparkingdeals.co.uk/assets/images/logo.png";
        const logoUrl = "/assets/images/logo.png";
        const logoBase64 = await loadImageToBase64(logoUrl);

        const logoWidth = 50;
        const logoHeight = 20;

        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        const logoX = (pageWidth - logoWidth) / 2;

        doc.addImage(logoBase64, 'PNG', logoX, 10, logoWidth, logoHeight);

        const username = user?.firstName + " " + user?.lastname;
        const printDate = formatDate(new Date());

        doc.setFontSize(10);
        doc.text(`Generated by: ${username}`, 14, logoHeight + 22);

        const dateWidth = doc.getTextWidth(`Generated date: ${printDate}`);
        doc.text(`Generated date: ${printDate}`, pageWidth - dateWidth - 14, logoHeight + 22);

        doc.text(`Invoice date range: ${bookingStartDate} - ${bookingEndDate}`, 14, logoHeight + 32);

        const columns = [
            { title: "Booking ID", dataKey: "bookingId" },
            { title: "Booking Date", dataKey: "bookingDate" },
            { title: "Booking amount", dataKey: "bookingQuote" },
            { title: "Deal Percentage", dataKey: "dealPercentage" },
            { title: "Final payable for Vendor", dataKey: "balance" }
        ];

        const data = bookingData.map(item => ({
            bookingId: item.bookingId ? item.bookingId : '------',
            bookingDate: item.date ? item.date : '------',
            bookingQuote: `£ ${parseFloat(item.bookingQuote || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            dealPercentage: parseFloat(dealPercentage || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            balance: `£ ${parseFloat(item.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }));

        // Generate the table without the footer
        doc.autoTable({
            head: [columns.map(col => col.title)],
            body: data.map(row => columns.map(col => row[col.dataKey])),
            margin: { top: 60 },
        });

        // Get the total number of pages
        const pageCount = doc.internal.getNumberOfPages();

        // Add the footer only on the last page
        doc.setPage(pageCount);
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

        // Get the Y position after the table is rendered
        let finalY = doc.autoTable.previous.finalY || 60;

        // Add the totals after the table height
        doc.text("Total Booking amount from Customer", 14, finalY + 10);
        doc.text(`£ ${totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, finalY + 10);

        doc.text("Total Payable for Vendor", 14, finalY + 20);
        doc.text(`£ ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 150, finalY + 20);

        doc.save('VendorBookings.pdf');
    };

    const loadImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    };


    const filterOptions = [
        { name: 'This week' },
        { name: 'This month' },
        { name: 'This year' },
        { name: 'Last week' },
        { name: 'Last month' },
        { name: 'Last year' },
        { name: 'Custom' }
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
                                    <Dropdown id="filterOption"
                                        value={filterOption}
                                        onChange={(e) => {
                                            const selectedPeriod = e.value;
                                            console.log("Selected Period:", selectedPeriod);
                                            setFilterOption(selectedPeriod);
                                            setBookingDate();
                                        }}
                                        options={filterOptions}
                                        optionLabel="name"
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
                                            <Calendar id="bookingDate"
                                                value={startDate}
                                                onChange={(e) => {
                                                    setStartDate(e.value);
                                                    setBookingStartDate(formatDate(e.value));
                                                }}
                                                placeholder='dd/mm/yyyy'
                                                dateFormat="dd/mm/yy"
                                                maxDate={today} className='w-100'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-xl-4 col-sm-6">
                                    <div className="custom-form-group mb-sm-0 mb-3">
                                        <label htmlFor="bookingDate" className="custom-form-label">Select end date: </label>
                                        <div className="form-icon-group">
                                            <i className="bi bi-calendar-range-fill input-grp-icon"></i>
                                            <Calendar
                                                id="bookingDate"
                                                value={endDate}
                                                onChange={(e) => {
                                                    setEndDate(e.value);
                                                    setBookingEndDate(formatDate(e.value));
                                                }}
                                                disabled={!startDate}
                                                placeholder='dd/mm/yyyy'
                                                dateFormat="dd/mm/yy"
                                                minDate={startDate}
                                                className='w-100'
                                            />
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
                                    header="Booking amount"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData.bookingQuote
                                            ? <span className="text_no_wrap flex_end">
                                                £ {parseFloat(rowData.bookingQuote).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : '£ 0'
                                    }
                                    style={{ width: "15%" }}
                                    footer={
                                        <span className="text_no_wrap flex_end">
                                            £ {totalInitialQuote.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    }
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
                                    style={{ width: "20%" }}
                                // footer={<span className="text_no_wrap flex_end">{totalDealPercentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                ></Column>

                                <Column
                                    header="Final payable for Vendor"
                                    alignHeader="right"
                                    body={(rowData) =>
                                        rowData?.balance
                                            ? <span className="text_no_wrap flex_end">
                                                £ {parseFloat(rowData.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                            : '£ 0'
                                    }
                                    style={{ width: "20%" }}
                                    footer={
                                        <span className="text_no_wrap flex_end">
                                            £ {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    }
                                ></Column>
                            </DataTable>
                        </div>
                    )}
                    {loading && (
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