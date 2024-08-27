import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";
import { Link } from "react-router-dom";

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
import { useSelector } from "react-redux";
import api from "../../api";


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
        // { name: 'User' },
        { name: 'Admin' },
    ];

    const initialUserInfo = {
        firstName: '',
        lastname: '',
        email: '',
        mobileNo: '',
        password: '',
        confirmPassword: '',
        Role: ""
    }

    const [userInfo, setUserInfo] = useState(initialUserInfo);
    const token = useSelector((state) => state.auth.token);
    const [rowPerPage, setRowsPerPage] = useState([5]);

    const fetchUsers = async () => {
        setLoading(true);
        const data = await SampleData.getData('all', token);
        setUserData(data.users);
        setTotalRecords(data.totalRecords);
        const newRowPerPage = ([5,10,25,50].filter(x => x<Number(data.totalRecords)));
        setRowsPerPage([...newRowPerPage, Number(data.totalRecords)])
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const register = async (signUpInfo) => {
        setLoading(true);
        try {
          console.log(signUpInfo);
          const response = await api.post("/api/admin/create-admin-role", signUpInfo, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
          if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'User Created.',
                detail: "You have successfully created a new user.",
                life: 3000
            });
        }
        setShowUserModal(false);
        fetchUsers();
        } catch (err) {
          console.log(err);
          toast.current.show({
            severity: 'error',
            summary: 'Failed to Create User',
            detail: err.response.data.error,
            life: 3000
          });
        }finally{
            setLoading(false);
        };
      };

    const updateUserInfo = async (Info) => {
        setLoading(true);
        try {
          const response = await api.put(`/api/admin/update-admin-user/${selectedUserId}`, Info, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
          if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'User Updated.',
                detail: "You have successfully updated.",
                life: 3000
            });
        }
        setShowUserModal(false);
        fetchUsers();
        } catch (err) {
          console.log(err);
          toast.current.show({
            severity: 'error',
            summary: 'Failed to Update!',
            detail: err.response.data.error,
            life: 3000
          });
        }finally{
            setLoading(false);
        };
      };

    const handleCreateUser = async(e) => {
        e.preventDefault();
        if (!userInfo.email || !userInfo.firstName || !userInfo.password || !userInfo.confirmPassword || !userInfo.Role) {
            setShowError(true);
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Please fill all required fields!",
              life: 3000
            });
            return;
          }
          if (userInfo.password !== userInfo.confirmPassword) {
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Password & Confirm Password do not match!",
              life: 3000
            });
            return;
          }
          if (userInfo.password.length < 8) {
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Password must be atleast 8 characters long!",
              life: 3000
            });
            return;
          }

          const { confirmPassword, ...updatedUserInfo } = userInfo;
          await register(updatedUserInfo);

        setUserInfo(initialUserInfo);
    }

    const handleUpdateUser = async(e) => {
        e.preventDefault();
        if (!userInfo.email || !userInfo.firstName || !userInfo.Role) {
            setShowError(true);
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Please fill all required fields!",
              life: 3000
            });
            return;
          }
          const { confirmPassword, password, ...updatedUserInfo } = userInfo;
          await updateUserInfo(updatedUserInfo);

        setUserInfo(initialUserInfo); 
    }

    const handleDeleteUser = (userId) => {
        confirmDialog({
            message: 'Are you sure you want to delete the data?',
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
            await api.delete(`/api/admin/delete-admin-user/${userId}`, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
            });
            toast.current.show({
                severity: 'success',
                summary: 'Deleted!',
                detail: "You have successfully deleted!.",
                life: 3000
            });
              fetchUsers();
          } catch (err) {
            console.log(err);
              toast.current.show({
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
                <Button
                    icon="bi bi-pencil-square"
                    className="data-view-button"
                    onClick={() => {
                        setUserInfo({
                            firstName: rowData.firstName,
                            lastname: rowData.lastName|| '',
                            email: rowData.email,
                            mobileNo: rowData.mobileNumber || '',
                            password: '',
                            confirmPassword: '',
                            Role: rowData.role 
                        })
                        setShowUserModal(true);
                        setDataState('Edit');
                        setSelectedUserId(rowData.details?._id);
                    }}
                />

                <Button
                    icon="bi bi-trash3"
                    className="data-delete-button"
                    onClick={() => handleDeleteUser(rowData.details?._id)}
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
                            setUserInfo(initialUserInfo);
                        }}
                    />
                </div>

                <div className="page_content">
                    {userData?.length > 0 && (
                        <div className="dash-table-area">
                            <DataTable
                                loading={loading}
                                value={userData}
                                paginator
                                size="small"
                                rows={rows}
                                totalRecords={totalRecords}
                                rowsPerPageOptions={rowPerPage}
                                tableStyle={{ minWidth: "50rem" }}
                                rowHover
                                className="dash-table"
                            >
                                <Column header="First name" field="firstName" style={{ width: "20%" }} ></Column>

                                <Column header="Last name" field="lastName" style={{ width: "20%" }} ></Column>

                                <Column header="Email" body={emailBody} style={{ width: "20%" }} ></Column>

                                <Column header="Mobile no." body={mobileNumberBody} style={{ width: "15%" }} ></Column>

                                <Column header="Role" field="role" style={{ width: "10%" }}></Column>

                                <Column body={actionBodyTemplate} alignHeader={'center'} className="" header="Action" style={{ width: "15%" }}></Column>
                            </DataTable>
                        </div>
                    )} 
                    {loading &&  (
                        <div className="no_data_found_area">
                            <h6>Loading...</h6>
                        </div>
                    )}
                    {!loading && userData && userData?.length === 0 && (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No user data!" />
                            <h6>No user data!</h6>
                        </div>
                    )}
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
                                    <Dropdown id="title" value={{ name: userInfo.Role }} onChange={(e) => setUserInfo({ ...userInfo, Role: e.value?.name })} options={roles} optionLabel="name"
                                        placeholder="Select role" className="w-full w-100 custom-form-dropdown" showClear />
                                    {(showError && !userInfo.Role) &&
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

                                    {(showError && !userInfo.firstName) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="lastName" className="custom-form-label">
                                        Last name
                                    </label>
                                    <InputText
                                        id="lastName"
                                        className="custom-form-input"
                                        placeholder="Enter last name"
                                        name="lastname"
                                        value={userInfo.lastname}
                                        onChange={handleInputChange}
                                    />

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

                                    {(showError && !userInfo.email) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="mobileNo" className="custom-form-label">
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

                                </div>
                            </div>

                            {dataState !== "Edit" && 
                            <>
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

                                        {(showError && !userInfo.password) &&
                                            <small className="text-danger form-error-msg">
                                                This field is required
                                            </small>
                                        }
                                        {(userInfo.password && userInfo.password.length<8) &&
                                            <small className="text-danger form-error-msg">
                                                Password must be at least 8 characters long
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

                                        {(showError && !userInfo.confirmPassword) &&
                                            <small className="text-danger form-error-msg">
                                                This field is required
                                            </small>
                                        }

                                        {(userInfo.confirmPassword !== userInfo.password && userInfo.confirmPassword) &&
                                            <small className="text-danger form-error-msg">
                                                Password and Confirm password do not match
                                            </small>
                                        }
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default Users;