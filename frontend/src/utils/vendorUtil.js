import api from "../api";
import { setAirports } from "../state";

export const fetchAllAirports = async (dispatch) => {
    try {
        const response = await api.get("/api/user/get-all-airports");
        console.log(response.data);
        dispatch(setAirports(response.data));
    }catch (err) {
        console.log(err);
    }
};

// export const getAvailableQuotes = async (dispatch) => {
//     try {
//         const response = await api.get("/api/user/find-vendor-detail");
//         console.log(response.data);
//         dispatch(setQuotes(response.data));
//     }catch (err) {
//         console.log(err);
//     }
// }