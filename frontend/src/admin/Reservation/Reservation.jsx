import React from "react";
import './Reservation.css';

import Preloader from "../../Preloader";

const Reservation = () => {
    return (
        <>
            <Preloader />
            <div>
                <div className="page_header_area">
                    <h4 className="page_heading">Reservation</h4>
                </div>

                <div className="page_content">
                </div>
                
            </div>
        </>
    )
}

export default Reservation;