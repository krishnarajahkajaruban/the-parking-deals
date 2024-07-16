import React from "react";
import Sidebar from "../../Components/Sidebar";
import Navbar from "../../Components/Navbar";

const Dashboard = () => {
    return (
        <>
            <div className="layout-container">
                <Sidebar />

                <div className="main">
                    <Navbar />

                    Dashboard Text
                </div>
            </div>
        </>
    )
}

export default Dashboard;