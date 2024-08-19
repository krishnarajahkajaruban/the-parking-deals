import React, { useState, useEffect, useRef } from "react";
import Preloader from "../../Preloader";
import { Link, useNavigate } from "react-router-dom";
import '../../pages/Dashboard/Dashboard.css';
import '../../pages/Dashboard/Dashboard-responsive.css';

import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Editor } from "primereact/editor";

import { SampleVendorData } from "./SampleVendorData";

const Vendors = () => {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [totalRecords, setTotalRecords] = useState(0);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [vendorsData, setVendorsData] = useState(null);
    const [dataState, setDataState] = useState('Add');
    const [selectedVendorId, setSelectedVendorId] = useState(null);

    const serviceTypes = [
        { type: 'Meet and Greet' },
        { type: 'Park and Ride' },
    ];

    const [logo, setLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [name, setName] = useState('');
    const [type, setType] = useState(null);
    const [quote, setQuote] = useState(null);
    const [rating, setRating] = useState(0);
    const [dealPercentage, setDealPercentage] = useState(null);
    const [hasCancellationCover, setHasCancellationCover] = useState(false);
    const [cancellationCoverAmount, setCancellationCoverAmount] = useState(null);
    const [facilities, setFacilities] = useState([{ facility: '' }]);
    const [overView, setOverView] = useState('');
    const [dropOffProcedure, setDropOffProcedure] = useState('');
    const [pickUpProcedure, setPickUpProcedure] = useState('');

    //For image upload
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setLogo(event.target.result);

                    const file = e.target.files?.[0];
                    setLogoFile(file);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // For clear image
    const clearImage = () => {
        setLogo(null);
        setLogoFile(null);
    };

    useEffect(() => {
        const data = SampleVendorData.getVendorsData
        setVendorsData(data);
    }, []);


    const handleCreateVendor = (e) => {
        e.preventDefault();
        setShowError(true);
        setLoading(true);

        try {
            setShowError(false);
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Vendor Created.',
                        detail: "You have successfully created a new vendor.",
                        life: 3000
                    });
                }
                setShowVendorModal(false);
                setLoading(false);
            }, 1200);
        } catch (err) {
            setShowError(false);
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error creating vendor.',
                    detail: err,
                    life: 3000
                });
            }
        }
    }

    const handleUpdateVendor = (e) => {
        e.preventDefault();
        setShowError(true);
        setLoading(true);

        try {
            setShowError(false);
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Vendor Updated.',
                        detail: "You have successfully updated the vendor details.",
                        life: 3000
                    });
                }
                setShowVendorModal(false);
                setLoading(false);
            }, 1200);
        } catch (err) {
            setShowError(false);
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error updating vendor.',
                    detail: err,
                    life: 3000
                });
            }
        }
    }

    const handleDeleteVendor = (vendorId) => {
        confirmDialog({
            message: 'Are you sure you want to delete the vendor data?',
            header: 'User Delete Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deleteVendor(vendorId);
            },
        });
    }

    const deleteVendor = async (vendorId) => {
        try {
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Vendor Deleted.',
                    detail: "You have successfully deleted the vendor.",
                    life: 3000
                });
            }
        } catch (err) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error deleting vendor.',
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
                    tooltip="Edit" tooltipOptions={{ position: 'top' }}
                    onClick={() => {
                        setShowVendorModal(true);
                        setDataState('Edit');
                        setSelectedVendorId(rowData.id);
                    }}
                />

                <Button
                    icon="bi bi-trash3"
                    className="data-delete-button"
                    tooltip="Delete" tooltipOptions={{ position: 'top' }}
                    onClick={() => handleDeleteVendor(rowData.id)}
                />

                <Button
                    icon="bi bi-calendar3"
                    className="data-view-button"
                    tooltip="Bookings" tooltipOptions={{ position: 'top' }}
                    onClick={() => navigate('/vendors/bookings')}
                />
            </div>
        );
    };

    const vendorModalHeader = () => {
        return (
            <div className="modal-header p-2">
                <h1 className="modal-title fs-5" id="bookingDetailModalLabel">
                    {dataState === 'Add' ? 'Create' : 'Edit'}&nbsp;vendor detail
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowVendorModal(false)}
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
                    onClick={() => setShowVendorModal(false)}
                />
                <Button
                    label={loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}
                    className="submit-button modal_btn"
                    loading={loading}
                    onClick={dataState === 'Add' ? handleCreateVendor : handleUpdateVendor}
                />
            </div>
        )
    }

    const cancellationCoverBody = (rowData) => {
        return (
            <div className="d-flex justify-content-center">
                {rowData.cancellationCover ? (
                    <strong className="text-center text-success">Available</strong>
                ) : (
                    <strong className="text-center text-danger">Not available</strong>
                )}
            </div>
        )
    };

    const ratingBody = (rowData) => {
        return (
            <Rating value={rowData.rating} readOnly cancel={false} />
        )
    };

    const addFacility = () => {
        setFacilities([...facilities, { facility: '' }]);
    }

    const removeFacility = (index) => {
        const updatedFacilities = facilities.filter((_, i) => i !== index);
        setFacilities(updatedFacilities);
    }

    const handleFacilityChange = (index, value) => {
        const updatedFacilities = facilities.map((facility, i) =>
            i === index ? { ...facility, facility: value } : facility
        );
        setFacilities(updatedFacilities);
    }

    return (
        <>
            <Preloader />
            <Toast ref={toast} />

            <div>

                <div className="page_header_area">
                    <h4 className="page_heading">Vendors</h4>
                    <Button
                        label="Add vendor"
                        icon="bi bi-plus-circle"
                        className="btn_primary"
                        onClick={() => {
                            setShowVendorModal(true);
                            setDataState('Add');
                        }}
                    />
                </div>

                <div className="page_content">
                    {vendorsData?.length > 0 ? (
                        <div className="dash-table-area">
                            <DataTable
                                value={vendorsData}
                                paginator
                                size="small"
                                rows={rows}
                                totalRecords={totalRecords}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: "50rem" }}
                                rowHover
                                className="dash-table"
                            >
                                <Column header="Name" field="name" style={{ width: "20%" }} ></Column>

                                <Column header="Type" field="type" style={{ width: "20%" }} ></Column>

                                <Column header="Rating" body={ratingBody} style={{ width: "20%" }} ></Column>

                                <Column header="Cancellation Cover" alignHeader={'center'} body={cancellationCoverBody} style={{ width: "15%" }} ></Column>

                                <Column header="Quote" field="quote" style={{ width: "10%" }}></Column>

                                <Column body={actionBodyTemplate} alignHeader={'center'} className="" header="Action" style={{ width: "15%" }}></Column>
                            </DataTable>
                        </div>
                    ) : (
                        <div className="no_data_found_area">
                            <img src="/assets/images/no_data_2.svg" alt="No user data!" />
                            <h6>No user data!</h6>
                        </div>
                    )}
                </div>
            </div>

            {/* User create/edit modal */}
            <Dialog header={vendorModalHeader} footer={userModalFooter} visible={showVendorModal}
                onHide={() => { if (!showVendorModal) return; setShowVendorModal(false); }}
                className="custom-modal modal_dialog modal_dialog_md">
                <div className="modal-body p-2">
                    <div className="data-view-area">
                        <div className="row">
                            <div className="col-12">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <div className="form_img_upload_area">
                                        <h6 className="logo_label">Logo</h6>
                                        <div className="form_img_upload">
                                            <input
                                                type="file"
                                                accept=".jpg, .png,"
                                                className="form_img_upload_input"
                                                id="logo"
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="logo"
                                                className={`form_img_upload_label ${logo ? 'uploaded' : ''}`}
                                                style={{ backgroundImage: logo ? `url(${logo})` : `` }}
                                            >
                                                {!logo && (
                                                    <div className="upload_icon">
                                                        <i className="bi bi-camera-fill"></i>
                                                    </div>
                                                )}
                                            </label>
                                            {logo ? (
                                                <button className="upload_clear_button mt-2" onClick={clearImage}>Clear</button>
                                            ) : (
                                                <label htmlFor="profileImage" className="add_image_label mt-2">Add image</label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="name" className="custom-form-label form-required">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        className="custom-form-input"
                                        placeholder="Name"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.value)}
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
                                    <label htmlFor="type" className="custom-form-label form-required">
                                        Service type
                                    </label>
                                    <Dropdown id="type" value={type} onChange={(e) => setType(e.value)} options={serviceTypes} optionLabel="type"
                                        placeholder="Select type" className="w-full w-100 custom-form-dropdown" showClear />
                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="quote" className="custom-form-label form-required">
                                        Quote
                                    </label>
                                    <InputNumber
                                        id="quote"
                                        className="custom-form-input"
                                        placeholder="Quote"
                                        name="quote"
                                        value={quote}
                                        onValueChange={(e) => setQuote(e.value)}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
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
                                    <label htmlFor="quote" className="custom-form-label form-required">
                                        Rating
                                    </label>
                                    <InputNumber
                                        id="rating"
                                        className="custom-form-input"
                                        placeholder="Rating"
                                        name="rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.value)}
                                        maxFractionDigits={1}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        suffix="⭐"
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
                                    <label htmlFor="quote" className="custom-form-label">
                                        Cancellation cover amount
                                    </label>
                                    <InputNumber
                                        id="cancellationCoverAmount"
                                        className="custom-form-input"
                                        placeholder="Cancellation cover amount"
                                        name="cancellationCoverAmount"
                                        value={cancellationCoverAmount}
                                        onValueChange={(e) => setCancellationCoverAmount(e.value)}
                                        minFractionDigits={2}
                                        maxFractionDigits={2}
                                        disabled={!hasCancellationCover}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }

                                    <div className="d-flex align-content-center mt-2">
                                        <Checkbox inputId="cancellationCover" onChange={e => setHasCancellationCover(e.checked)} checked={hasCancellationCover}></Checkbox>
                                        <label htmlFor="cancellationCover" className="ms-2 custom-form-label cursor-pointer">Cancellation cover</label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="dealPercentage" className="custom-form-label form-required">
                                        Deal percentage
                                    </label>
                                    <InputNumber
                                        id="dealPercentage"
                                        className="custom-form-input"
                                        placeholder="Percentage"
                                        name="dealPercentage"
                                        value={dealPercentage}
                                        onChange={(e) => setDealPercentage(e.value)}
                                        maxFractionDigits={2}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        suffix="%"
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            {facilities.map((facility, index) => (
                                <div className="col-12" key={index}>
                                    <div className="custom-form-group mb-3 mb-sm-4">
                                        <label htmlFor={`name-${index}`} className="custom-form-label form-required">
                                            Facility {index + 1}
                                        </label>
                                        <InputText
                                            id={`name-${index}`}
                                            className="custom-form-input mb-2"
                                            placeholder="Facility"
                                            name={`name-${index}`}
                                            value={facility.facility}
                                            onChange={(e) => handleFacilityChange(index, e.target.value)}
                                        />

                                        <div className="d-flex">
                                            <Button
                                                className="add_more_btn submit-button plain modal_btn p-1 pe-2 ps-2 me-2"
                                                onClick={addFacility}
                                                icon="bi bi-plus-lg"
                                                severity="danger"
                                                label="Add"
                                            />
                                            {facilities.length > 1 && index !== 0 && (
                                                <Button
                                                    className="add_more_btn modal_btn p-1 pe-2 ps-2"
                                                    onClick={() => removeFacility(index)}
                                                    icon="bi bi-dash-lg"
                                                    severity="danger"
                                                    label="Remove"
                                                />
                                            )}
                                        </div>

                                        {showError &&
                                            <small className="text-danger form-error-msg">
                                                This field is required
                                            </small>
                                        }
                                    </div>
                                </div>
                            ))}

                            <div className="col-12">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="overView" className="custom-form-label form-required">
                                        Overview
                                    </label>
                                    <Editor
                                        id="overView"
                                        placeholder="Enter the overview about the company"
                                        value={overView}
                                        onTextChange={(e) => setOverView(e.htmlValue)}
                                        style={{ height: '300px' }}
                                    />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="dropOffProcedure" className="custom-form-label form-required">
                                        Drop off procedure
                                    </label>
                                    <Editor
                                        id="dropOffProcedure"
                                        placeholder="Enter the drop-off procedure for bookings"
                                        value={dropOffProcedure}
                                        onTextChange={(e) => setDropOffProcedure(e.htmlValue)}
                                        style={{ height: '300px' }} />

                                    {showError &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="custom-form-group mb-3 mb-sm-4">
                                    <label htmlFor="pickUpProcedure" className="custom-form-label form-required">
                                        Pickup procedure
                                    </label>
                                    <Editor
                                        id="pickUpProcedure"
                                        value={pickUpProcedure}
                                        placeholder="Enter the pick-up procedure for bookings"
                                        onTextChange={(e) => setPickUpProcedure(e.htmlValue)}
                                        style={{ height: '300px' }} />

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

export default Vendors;