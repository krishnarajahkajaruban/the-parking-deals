import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";


const Customers = () => {
    const toast = useRef(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Preloader />

            <div>

                <div className="page_header_area">
                    <h4 className="page_heading">Customers</h4>
                </div>

                <div className="page_content">
                    <div className="dash-table-area">

                    </div>
                </div>
            </div>
        </>
    )
}

export default Customers;