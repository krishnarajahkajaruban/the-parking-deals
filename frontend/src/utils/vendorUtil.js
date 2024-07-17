import api from "../api";
import { setAirports, setQuotes } from "../state";

const airports = [
    { name: 'Luton' }
];

const quotes = [
    {
        _id: "6695cc3066ed88bb45742d72",
        name: "Luton 247 Meet & Greet",
        logo:"https://parkingdealsuk.com/storage/images/2d8140f4b6d3175fd7e2e3bd7b6eb433.png",
        finalQuote: 159.00,
        type: "Meet and Greet",
        rating: 4.6,
        quote:0,
        cancellationCover: true,
        facilities: [
            "Excellent for meet and greet",
            "Drop off and pick up at the terminal.",
            "Reliable, Punctual & professional staff",
            "Airport levy charges not included"
        ]
    },
    {
        _id: "6697cfb1a1b01f7e75778761",
        name: "Airport Parking Bay Meet & Greet Luton",
        logo:"https://parkingdealsuk.com/storage/images/faf39cd77da85eb710e37b218ec2ddab.jpeg",
        finalQuote: 155.00,
        type: "Meet and Greet",
        rating: 5.0,
        quote:0,
        cancellationCover: true,
        facilities: [
            "Uniformed Insured chauffeurs",
            "Pickup & Drop Off at the terminal.",
            "No buses, No Waiting. Meet and Greet",
            "Airport levy charges not included"
        ]
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