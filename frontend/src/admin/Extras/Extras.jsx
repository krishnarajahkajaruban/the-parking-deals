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
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { getBookingChargesWithCouponCodeAndCorrespondingDiscount } from "../../utils/chargesAndCouponCode";

const Extras = () => {
    const toast = useRef(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showErrorNew, setShowErrorNew] = useState(false);
    const [loadingNew, setLoadingNew] = useState(false);
    const [dataState, setDataState] = useState('Add');

    const [promoCode, setPromoCode] = useState('');
    const [promoPercentage, setPromoPercentage] = useState('');

    const [hasPromoCode, setHasPromoCode] = useState(true);
    const [hasBookingFare, setHasBookingFare] = useState(true);
    const [showPromocode, setShowPromocode] = useState(true);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [couponCodeAndDiscount, setCouponCodeAndDiscount] = useState(null);
    const [bookingFare, setBookingFare] = useState(null);
    const reduxCouponCodeDiscountObj = useSelector(
        (state) => state.bookingChargeCouponCode.couponCode
    );
    const reduxBookingFareObj = useSelector(
        (state) => state.bookingChargeCouponCode.bookingCharge
    );

    const initialCouponCodeDiscount = {
        couponCode: couponCodeAndDiscount ? couponCodeAndDiscount.couponCode :"",
        discount: couponCodeAndDiscount ? couponCodeAndDiscount.discount :0,
        // bannerStatus: false
    };
    // const [couponCodeDiscountObj, setCouponCodeDiscountObj] = useState(null);
    // const [bookingFareObj, setBookingFareObj] = useState(null);

  useEffect(() => {
    if (reduxCouponCodeDiscountObj) setCouponCodeAndDiscount(reduxCouponCodeDiscountObj);
  }, [reduxCouponCodeDiscountObj]);

  useEffect(() => {
    if (reduxBookingFareObj) setBookingFare(reduxBookingFareObj);
  }, [reduxBookingFareObj]);

//   useEffect(() => {
//     if (couponCodeAndDiscount) setCouponCodeDiscountObj(couponCodeAndDiscount);
//   }, [couponCodeAndDiscount]);

  useEffect(() => {
    getBookingChargesWithCouponCodeAndCorrespondingDiscount(dispatch);
  }, [dispatch]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponCodeAndDiscount({...couponCodeAndDiscount,
            [name]: value
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingFare({...bookingFare,
            [name]: value
        });
    };

    const handleCreatePromoCode = () => {
        setHasPromoCode(true);
    }

    const handleEditPromoCode = () => {
        setDataState('Edit');
    }

    const updateCoupponCodeDiscount = async (data) => {
        setLoading(true);
        try {
          const response = await api.post("/api/admin/update-coupon-code-discount", data, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
          if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Promo code detail Updated.',
                detail: "You have successfully updated your promo code detail.",
                life: 3000
            });
        }
        // setCouponCodeDiscountObj(initialCouponCodeDiscount);
        getBookingChargesWithCouponCodeAndCorrespondingDiscount(dispatch);
        setHasPromoCode(true);
        setDataState('Add');
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

      const updateBookingFare = async (data) => {
        setLoadingNew(true);
        try {
          const response = await api.post("/api/admin/update-booking-fare", data, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
          if (toast.current) {
            toast.current.show({
                severity: 'success',
                summary: 'Booking fare detail Updated.',
                detail: "You have successfully updated your booking fare detail.",
                life: 3000
            });
        }
        // setCouponCodeDiscountObj(initialCouponCodeDiscount);
        getBookingChargesWithCouponCodeAndCorrespondingDiscount(dispatch);
        setHasBookingFare(true);
        } catch (err) {
          console.log(err);
          toast.current.show({
            severity: 'error',
            summary: 'Failed to Update!',
            detail: err.response.data.error,
            life: 3000
          });
        }finally{
            setLoadingNew(false);
        };
      };

    const handleUpdatePromoCode = async(e) => {
        e.preventDefault();
        setShowError(false);
        if (!couponCodeAndDiscount.couponCode || !couponCodeAndDiscount.discount) {
            setShowError(true);
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Please fill all required fields!",
              life: 3000
            });
            return;
          }
        await updateCoupponCodeDiscount(couponCodeAndDiscount);

    }

    const handleUpdateBookingCharge = async(e) => {
        e.preventDefault();
        setShowErrorNew(false);
        if (!bookingFare.bookingFee || !bookingFare.cancellationCoverFee) {
            setShowErrorNew(true);
            toast.current.show({
              severity: 'error',
              summary: 'Error in Submission',
              detail: "Please fill all required fields!",
              life: 3000
            });
            return;
          }
        await updateBookingFare(bookingFare);

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
                                        value={couponCodeAndDiscount?.couponCode || ""} name="couponCode"
                                        onChange={handleInputChange} />

                                    {(showError && !couponCodeAndDiscount.couponCode) &&
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
                                        name="discount"
                                        value={couponCodeAndDiscount?.discount || 0}
                                        onValueChange={handleInputChange}
                                        maxFractionDigits={2}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        suffix="%"
                                    />

                                    {(showError && !couponCodeAndDiscount.discount) &&
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
                                    <h6 className="extras_value">{couponCodeAndDiscount ? couponCodeAndDiscount.couponCode : ""}</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Offer percentege :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">{couponCodeAndDiscount ? couponCodeAndDiscount.discount : 0}%</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Show promo code</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <InputSwitch checked={couponCodeAndDiscount ? couponCodeAndDiscount.bannerStatus :false} className="custom_switch" onChange={(e) =>{
                                        // setCouponCodeDiscountObj({...couponCodeDiscountObj, bannerStatus:e.value});
                                    updateCoupponCodeDiscount({bannerStatus:e.value})}} />
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
                                        {/* <Button
                                            icon="bi bi-trash3"
                                            className="data-delete-button"
                                            onClick={handleDeletePromocode}
                                        /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Booking Fares</h6>

                    {(hasBookingFare === false ) ? (
                        <div className="row">
                            <div className="col-12">
                                <h6 className="data_head">Edit Booking Fares</h6>
                            </div>
                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor="promoCode" className="custom-form-label form-required">Booking Fee: </label>
                                    <InputNumber
                                        id="bookingFee"
                                        className="custom-form-input"
                                        placeholder="Booking Fee"
                                        name="bookingFee"
                                        value={bookingFare.bookingFee}
                                        onValueChange={handleChange}
                                        maxFractionDigits={2}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        prefix="£"
                                    />

                                    {(showErrorNew && !bookingFare.bookingFee) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <div className="custom-form-group mb-sm-4 mb-3">
                                    <label htmlFor="promoPercentage" className="custom-form-label form-required">Cancellation Cover Fee: </label>

                                    <InputNumber
                                        id="cancellationCoverFee"
                                        className="custom-form-input"
                                        placeholder="Cancellation Cover Fee"
                                        name="cancellationCoverFee"
                                        value={bookingFare.cancellationCoverFee}
                                        onValueChange={handleChange}
                                        maxFractionDigits={2}
                                        useGrouping={false}
                                        mode="decimal"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        prefix="£"
                                    />

                                    {(showErrorNew && !bookingFare.cancellationCoverFee) &&
                                        <small className="text-danger form-error-msg">
                                            This field is required
                                        </small>
                                    }
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="text-start">
                                    <Button
                                        label={"Update"}
                                        className="aply-btn"
                                        loading={loadingNew}
                                        onClick={handleUpdateBookingCharge}
                                    />
                                    
                                        <Button
                                            label="Cancel"
                                            className="ms-2"
                                            severity="danger"
                                            onClick={() => setHasBookingFare(true)}
                                        />
                                    
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="show_promo_area">
                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Booking Feee :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">£ {bookingFare ? bookingFare.bookingFee : 0}</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Cancellation Cover Fee :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">£ {bookingFare ? bookingFare.cancellationCoverFee : 0}</h6>
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
                                            onClick={()=>setHasBookingFare(false)}
                                        />
                                        {/* <Button
                                            icon="bi bi-trash3"
                                            className="data-delete-button"
                                            onClick={handleDeletePromocode}
                                        /> */}
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