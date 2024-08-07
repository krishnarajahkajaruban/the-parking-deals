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

import { SampleUserData } from "./SampleUserData";

const Users = () => {
    const toast = useRef(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showUserModal, setShowUserModal] = useState(false);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [userData, setUserData] = useState(null);
    const [dataState, setDataState] = useState('Add');
    const [selectedUserId, setSelectedUserId] = useState(null);

    const roles = [
        { name: 'Moderator' },
        { name: 'User' },
        { name: 'Admin' },
    ];

    const initialUserInfo = {
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        password: '',
        confirmPassword: '',
        role: roles[0]
    }

    const [userInfo, setUserInfo] = useState(initialUserInfo);

    useEffect(() => {
        const data = SampleUserData.getUsersData
        setUserData(data);
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const handleCreateUser = (e) => {
        e.preventDefault();
        setShowError(true);
        setLoading(true);

        try {
            setShowError(false);
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'User Created.',
                        detail: "You have successfully created a new user.",
                        life: 3000
                    });
                }
                setShowUserModal(false);
                setLoading(false);
            }, 1200);
        } catch (err) {
            setShowError(false);
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error creating user.',
                    detail: err,
                    life: 3000
                });
            }
        }
    }

    const handleUpdateUser = (e) => {
        e.preventDefault();
        setShowError(true);
        setLoading(true);

        try {
            setShowError(false);
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'User Updated.',
                        detail: "You have successfully updated the user details.",
                        life: 3000
                    });
                }
                setShowUserModal(false);
                setLoading(false);
            }, 1200);
        } catch (err) {
            setShowError(false);
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error updating user.',
                    detail: err,
                    life: 3000
                });
            }
        }
    }

    const handleDeleteUser = (userId) => {
        confirmDialog({
            message: 'Are you sure you want to delete the user data?',
            header: 'User Delete Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deleteUser(userId);
            },
        });
    }

    const deleteUser = async (userId) => {
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
                    icon="bi bi-pencil-square"
                    className="data-view-button"
                    onClick={() => {
                        setShowUserModal(true);
                        setDataState('Edit');
                        setSelectedUserId(rowData.id);
                    }}
                />

                <Button
                    icon="bi bi-trash3"
                    className="data-delete-button"
                    onClick={() => handleDeleteUser(rowData.id)}
                />
            </div>
        );
    };

    const userModalHeader = () => {
        return (
            <div className="modal-header p-2">
                <h1 className="modal-title fs-5" id="bookingDetailModalLabel">
                    {dataState === 'Add' ? 'Create' : 'Edit'}&nbsp;user detail
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUserModal(false)}
                ></button>
            </div>
        )
    }

    const userModalFooter = () => {
        return (
            <div className="custom_modal_footer p-2">
                <Button
                    label="Cancel"
                    severity="secondary"
                    className="modal_btn"
                    onClick={() => setShowUserModal(false)}
                />
                <Button
                    label={loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}
                    className="submit-button modal_btn"
                    loading={loading}
                    onClick={dataState === 'Add' ? handleCreateUser : handleUpdateUser}
                />
            </div>
        )
    }

    /* For password */
    const header = <div className="font-bold mb-3">Password Strength</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="ps-4 mt-0 mb-0 pb-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li className="mb-0">Minimum 8 characters</li>
            </ul>
        </>
    );
    /*  */

    return (
        <>
            <Preloader />
            <Toast ref={toast} />

            <div>

                <div className="page_header_area">
                    <h4 className="page_heading">Users</h4>
                    <Button
                        label="Add user"
                        icon="bi bi-plus-circle"
                        className="btn_primary"
                        onClick={() => {
                            setShowUserModal(true);
                            setDataState('Add');
                        }}
                    />
                </div>

                <div className="page_content">
                    <div className="dash-table-area">
                        <DataTable
                            value={userData}
                            paginator
                            size="small"
                            rows={rows}
                            totalRecords={totalRecords}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{ minWidth: "50rem" }}
                            rowHover
                            className="dash-table"
                        >
                            <Column header="First name" field="firstName" style={{ width: "20%" }} ></Column>

                            <Column header="Last name" field="lastName" style={{ width: "20%" }} ></Column>

                            <Column header="Email" field="email" style={{ width: "20%" }} ></Column>

                            <Column header="Mobile no." field="mobileNo" style={{ width: "15%" }} ></Column>

                            <Column header="Role" field="role" style={{ width: "10%" }}></Column>

                            <Column body={actionBodyTemplate} alignHeader={'center'} className="" header="Action" style={{ width: "15%" }}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* User create/edit modal */}
            <Dialog header={userModalHeader} footer={userModalFooter} visible={showUserModal}
                onHide={() => { if (!showUserModal) return; setShowUserModal(false); }}
                className="custom-modal modal_dialog modal_dialog_md">
                <div className="modal-body p-2">
                    <div className="data-view-area">
                        <div className="row mt-sm-2">
                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="title" className="custom-form-label form-required">
                                        Role
                                    </label>
                                    <Dropdown id="title" value={{ name: userInfo.role }} onChange={(e) => setUserInfo({ ...userInfo, role: e.value?.name })} options={roles} optionLabel="name"
                                        placeholder="Select role" className="w-full w-100 custom-form-dropdown" showClear />
                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="firstName" className="custom-form-label form-required">
                                        First name
                                    </label>
                                    <InputText
                                        id="firstName"
                                        className="custom-form-input"
                                        placeholder="Enter first name"
                                        name="firstName"
                                        value={userInfo.firstName}
                                        onChange={handleInputChange}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="lastName" className="custom-form-label form-required">
                                        Last name
                                    </label>
                                    <InputText
                                        id="lastName"
                                        className="custom-form-input"
                                        placeholder="Enter last name"
                                        name="lastName"
                                        value={userInfo.lastName}
                                        onChange={handleInputChange}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="email" className="custom-form-label form-required">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        keyfilter="email"
                                        className="custom-form-input"
                                        placeholder="Enter email address"
                                        name="email"
                                        value={userInfo.email}
                                        onChange={handleInputChange}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="mobileNo" className="custom-form-label form-required">
                                        Mobile no.
                                    </label>
                                    <InputText
                                        id="mobileNo"
                                        keyfilter={"num"}
                                        className="custom-form-input"
                                        placeholder="Enter mobile no."
                                        name="mobileNo"
                                        value={userInfo.mobileNo}
                                        onChange={handleInputChange}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="password" className="custom-form-label form-required">
                                        Password
                                    </label>

                                    <Password
                                        id="password"
                                        className="custom-form-input"
                                        name="password"
                                        value={userInfo.password}
                                        onChange={handleInputChange}
                                        header={header}
                                        footer={footer}
                                        placeholder="************"
                                        toggleMask
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="confirmPassword" className="custom-form-label form-required">
                                        Confirm Password
                                    </label>

                                    <Password
                                        id="confirmPassword"
                                        className="custom-form-input"
                                        name="confirmPassword"
                                        value={userInfo.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="************"
                                        feedback={false}
                                        toggleMask
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default Users;