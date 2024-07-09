import api from "../api";
import { setAirports, setQuotes } from "../state";

const airports = [
    { name: 'Birmingham Airport' },
    { name: 'Bristol Airport' },
    { name: 'Gatwick Airport' },
    { name: 'Heathrow Airport' },
    { name: 'Liverpool Airport' },
    { name: 'Luton Airport' },
    { name: 'Stansted Airport' },
    { name: 'Manchester Airport' },
    { name: 'Southend Airport' }
];

const quotes = [
    {
        _id: "668c972be10c2151fd59835c",
        name: "Lion Parking1",
        logo:"",
        quote: 83
    },
    {
        _id: 2,
        name: "Lion Parking2",
        logo:"",
        quote: 84
    },
    {
        _id: 3,
        name: "Lion Parking3",
        logo:"",
        quote: 85
    }
];

export const fetchAllAirports = async (dispatch) => {
    dispatch(setAirports(airports));
    try {
        const response = await api.get("/api/user/get-all-airports");
        console.log(response.data);
        // dispatch(setAirports(response.data));
    }catch (err) {
        console.log(err);
    }
};

export const getAvailableQuotes = async (queryParams, dispatch, toast, setLoading, setPageLoading) => {
    dispatch(setQuotes(quotes));
    try {
        const response = await api.get(`/api/user/find-vendor-detail?${queryParams.toString()}`);
        console.log(response.data);
        // dispatch(setQuotes(response.data));
    }catch (err) {
        console.log(err);
        toast?.current.show({
            severity: 'error',
            summary: 'Error occur while finding suitable parking slots!',
            detail: err.response?.data.error,
            life: 3000
        });
    }finally{
        setLoading(false);
        setPageLoading(false);
    }
}