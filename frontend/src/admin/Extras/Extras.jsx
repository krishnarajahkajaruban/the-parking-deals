import React, { useEffect, useState, useRef } from "react";
import Preloader from "../../Preloader";
import './Extras.css';
import "../../pages/Dashboard/Dashboard.css";

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Divider } from 'primereact/divider';
import { confirmDialog } from "primereact/confirmdialog";

const Extras = () => {
    const toast = useRef(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataState, setDataState] = useState('Add');

    const [promoCode, setPromoCode] = useState('');
    const [promoPercentage, setPromoPercentage] = useState('');

    const [hasPromoCode, setHasPromoCode] = useState(true);
    const [showPromocode, setShowPromocode] = useState(true);

    const handleCreatePromoCode = () => {
        setHasPromoCode(true);
    }

    const handleEditPromoCode = () => {
        setDataState('Edit');
    }

    const handleUpdatePromoCode = () => {
        setHasPromoCode(true);
        setDataState('Add');
    }

    const handleDeletePromocode = () => {
        confirmDialog({
            message: 'Are you sure you want to delete the promo code?',
            header: 'Delete Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: deletePromocode,
        });
    }

    const deletePromocode = () => {
        setHasPromoCode(false);
        setDataState('Add');
    }

    return (
        <>
            <Preloader />

            <div>
                <div className="page_header_area">
                    <h4 className="page_heading">Extras</h4>
                </div>
                <Toast ref={toast} />

                <div className="filter_area">
                    <h6 className="section_part_heading">Promo code</h6>

                    {(hasPromoCode === false && dataState === 'Add') || dataState === 'Edit' ? (
                        <div className="row">
                            <div className="col-12">
                                <h6 className="data_head">{dataState} Promo code</h6>
                            </div>
                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor="promoCode" className="custom-form-label form-required">Promo code: </label>
                                    <InputText id="promoCode" className="custom-form-input" placeholder='Enter promo code' invalid={showError}
                                        value={promoCode} name="promoCode"
                                        onChange={(e) => setPromoCode(e.target.value)} />

                                    {(showError) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor="promoPercentage" className="custom-form-label form-required">Promo percentage: </label>

                                    <InputNumber
                                        id="promoPercentage"
                                        className="custom-form-input"
                                        placeholder="Percentage"
                                        name="promoPercentage"
                                        value={promoPercentage}
                                        onValueChange={(e) => setPromoPercentage(e.value)}
                                        maxFractionDigits={2}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        suffix="%"
                                    />

                                    {(showError) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="text-start">
                                    <Button
                                        label={`${dataState === 'Add' ? "Create" : "Update"}`}
                                        className="aply-btn"
                                        loading={loading}
                                        onClick={dataState === 'Add' ? handleCreatePromoCode : handleUpdatePromoCode}
                                    />
                                    {dataState === 'Edit' && (
                                        <Button
                                            label="Cancel"
                                            className="ms-2"
                                            severity="danger"
                                            onClick={() => setDataState('Add')}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="show_promo_area">
                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Promo code :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">OFFR</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Offer percentege :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">10%</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Show promo code</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <InputSwitch checked={showPromocode} className="custom_switch" onChange={(e) => setShowPromocode(e.value)} />
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Action</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <div className="action_btn_area justify-content-start">
                                        <Button
                                            icon="bi bi-pencil-square"
                                            className="data-view-button"
                                            onClick={handleEditPromoCode}
                                        />
                                        <Button
                                            icon="bi bi-trash3"
                                            className="data-delete-button"
                                            onClick={handleDeletePromocode}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Extras;