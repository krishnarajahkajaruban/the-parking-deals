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

    const fetchCustomers = async (page, rows) => {
        setLoading(true);
        const data = await SampleData.getData(page, rows, 'User', token);
        setCustomerData(data.users);
        setTotalRecords(data.totalRecords);
        const newRowPerPage = ([5,10,25,50].filter(x => x<Number(data.totalRecords)));
        setRowsPerPage([...newRowPerPage, Number(data.totalRecords)])
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers(page, rows);
    }, [page, rows, token]);

    const handleDeleteCustomer = (customerId) => {
        confirmDialog({
            message: 'Are you sure you want to delete the customer data?',
            header: 'Customer Delete Confirmation',
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
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'User Deleted.',
                    detail: "You have successfully deleted the user.",
                    life: 3000
                });
            }
        } catch (err) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error deleting user.',
                    detail: err,
                    life: 3000
                });
            }
        }
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="action_btn_area">
                <Button
                    icon="bi bi-trash3"
                    className="data-delete-button"
                    onClick={() => handleDeleteCustomer(rowData.id)}
                />
            </div>
        );
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
                    {customerData?.length > 0 ? (
                        <div className="dash-table-area">
                            <DataTable
                                value={customerData}
                                paginator
                                size="small"
                                rows={rows}
                                totalRecords={totalRecords}
                                onPage={onPageChange}
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
                    ) : (
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