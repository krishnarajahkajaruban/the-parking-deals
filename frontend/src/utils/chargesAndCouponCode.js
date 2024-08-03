import api from "../api";
import { setBookingCharge, setCouponCode } from "../state";

export const getBookingChargesWithCouponCodeAndCorrespondingDiscount = async(dispatch) => {
    try{
        const response = await api.get("/api/common-role/find-all-booking-charges-couponcode-discount");
        dispatch(setBookingCharge(response.data?.bookingCharges));
        dispatch(setCouponCode(response.data?.couponCodeDiscounts));
    }catch(err){
        console.log(err);
    }
};