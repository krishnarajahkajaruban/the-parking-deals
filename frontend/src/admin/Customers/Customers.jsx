import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";

import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import { SampleData } from "../../UserData";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api";
import { Tag } from "primereact/tag";

const Customers = () => {
    const toast = useRef(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [rows, setRows] = useState(10);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [customerData, setCustomerData] = useState(null);
    const [rowPerPage, setRowsPerPage] = useState([5]);
    const token = useSelector((state) => state.auth.token);

    const fetchCustomers = async () => {
        setLoading(true);
        const data = await SampleData.getData('User', token);
        setCustomerData(data.users);
        setTotalRecords(data.totalRecords);
        const newRowPerPage = ([5,10,25,50].filter(x => x<Number(data.totalRecords)));
        setRowsPerPage([...newRowPerPage, Number(data.totalRecords)])
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDeleteCustomer = (customerId, status) => {
        confirmDialog({
            message: `Are you sure you want to ${status ? "BLOCK" : "UNBLOCK"} the customer account?`,
            header: 'Customer Account Status Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deleteCustomer(customerId);
            },
        });
    }

    const deleteCustomer = async (customerId) => {
        try {
            const response = await api.patch(`/api/admin/change-user-active-status/${customerId}`, {}, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Customer Active Status Changed!',
                detail: response.data.message,
                life: 3000
            });
            fetchCustomers();
          } catch (err) {
            console.log(err);
              toast.current?.show({
                  severity: 'error',
                  summary: 'Error!',
                  detail: err.response.data.error,
                  life: 3000
              });
          }
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action_btn_area">
                <Tag
                    style={{ cursor: 'pointer' }}
                    value={rowData?.details?.active ? "BLOCK" : "UNBLOCK"}
                    severity={getSeverity(rowData?.details?.active)}
                    onClick={() => handleDeleteCustomer(rowData?.details?._id, rowData?.details?.active)}
                />
            </div>
        );
    };
    
    const getSeverity = (status) => {
        return status ? 'warning' : 'success';
    };
    
    const mobileNumberBody = (rowData) => {
        return (
            <Link to={`tel:${rowData.mobileNumber}`}>{rowData.mobileNumber}</Link>
        )
    };

    const emailBody = (rowData) => {
        return (
            <Link to={`mailto:${rowData.email}`}>{rowData.email}</Link>
        )
    };

    const onPageChange = (event) => {
        console.log(event);
        setPage(event.page + 1);
        setRows(event.rows);
    };

    return (
        <>
            <Preloader />

            <div>

                <div className="page_header_area">
                    <h4 className="page_heading">Customers</h4>
                </div>

                <div className="page_content">
                    {customerData?.length > 0 && (
                        <div className="dash-table-area">
                            <DataTable
                                loading={loading}
                                value={customerData}
                                paginator
                                size="small"
                                rows={rows}
                                totalRecords={totalRecords}
                                // onPage={onPageChange}
                                rowsPerPageOptions={rowPerPage}
                                tableStyle={{ minWidth: "50rem" }}
                                rowHover
                                className="dash-table"
                            >
                                <Column header="Title" field="title" style={{ width: "10%" }} ></Column>

                                <Column header="First name" field="firstName" style={{ width: "20%" }} ></Column>

                                <Column header="Last name" field="lastName" style={{ width: "20%" }} ></Column>

                                <Column header="Email" body={emailBody} style={{ width: "20%" }} ></Column>

                                <Column header="Mobile no." body={mobileNumberBody} style={{ width: "15%" }} ></Column>

                                <Column body={actionBodyTemplate} alignHeader={'center'} className="" header="Action" style={{ width: "15%" }}></Column>
                            </DataTable>
                        </div>
                    ) } 

                    {loading &&  (
                        <div className="no_data_found_area">
                            <h6>Loading...</h6>
                        </div>
                    )}

                    {!loading && customerData && customerData?.length === 0 && (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No customer data!" />
                            <h6>No customer data!</h6>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}

export default Customers;