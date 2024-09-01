import api from "../api";
import { setAirports, setQuotes } from "../state";

const airports = [
    { name: 'Luton' }
];

const quoteForDay = (quote, day) => {
    const incrementPerDay = 5;
    const extraIncrementPerDay = 10;
    const thresholdDay = 30;
    if (day === 0) {
        day = 1;
    }

    if (day === 1) {
        return quote;
    }

    let totalIncrement;

    if (day <= thresholdDay) {
        totalIncrement = (day - 1) * incrementPerDay;
    } else {
        totalIncrement = (thresholdDay - 1) * incrementPerDay + (day - thresholdDay) * extraIncrementPerDay;
    }

    return quote + totalIncrement;
};


const settingQuotes = (day) => {
    return [
        {
            _id: "6695cc3066ed88bb45742d72",
            name: "Luton 247 Meet & Greet",
            logo: "https://parkingdealsuk.com/storage/images/2d8140f4b6d3175fd7e2e3bd7b6eb433.png",
            // finalQuote: Math.floor(quoteForDayForLuton247(day)*100)/100,
            type: "Meet and Greet",
            rating: 4.6,
            quote: 0,
            cancellationCover: true,
            facilities: [
                "Excellent for meet and greet",
                "Drop off and pick up at the terminal.",
                "Reliable, Punctual & professional staff",
                "Airport levy charges not included"
            ],
            overView: <div><p><strong>Transfers</strong></p>

                <p>Opening times 24 Hours / 7 Days.</p>

                <p>Drop off at the terminal.</p>

                <p>Your keys will stay with the car park whilst you are away.</p>

                <p>&nbsp;</p>

                <p><strong>Why Book This Parking Space?</strong></p>

                <p>You leave your keys.</p>

                <p>No transfer time <em>(meet &amp; greet service)</em>.</p>

                <p>Simply drive to the terminal and will collect your car allowing you to reach checkin within minutes.</p>

                <p>He will then photograph your car and drive it to our parking compound nearby.&nbsp;</p>

                <p>Chauffeur will meet you at the terminal building at the designated area to collect your car.&nbsp;</p>

                <p>All drivers are mature, uniformed, carry I.D. and are fully insured to drive your vehicle.</p>

                <p>&nbsp;</p>

                <p><strong>Disabled info</strong></p>

                <p>No transfers are needed meet and greet will be an excellent alternative for disabled customers who would find it difficult to use transfer buses. Your car is collected from the terminal when you leave, and brought back to you at the terminal on return.</p>

                <p>&nbsp;</p>

                <p><strong>Additional Info</strong></p>

                <p>Tyres are required to meet the legal limits.</p>

                <p>Vehicle must have valid road tax.</p>

                <p>Have sufficient petrol as it is parked off airport.</p>

                <p>Vehicle must have valid MOT.</p>

                <p>Vehicle must be safe to drive.</p>

                <p>&nbsp;</p>

                <p><strong>Vehicle Restrictions</strong></p>

                <p>Parking is for cars only and cars must fit in to a standard sized parking space (2.4m wide x 4.8m long).</p>

                <p>Very large vehicles and minibuses may be refused if prior arrangements are not made.</p>

                <p>&nbsp;</p>

                <p><strong>Insurance</strong></p>

                <p>All drivers are fully insured to drive your vehicle.</p>

                <p>Airport&nbsp; levy charges included</p>

                <p>&nbsp;</p>

                <p>&nbsp;</p>

                <p>&nbsp;</p></div>,
            dropOffProcedure: <div><p>On the day of your departure you will be welcomed by our fully uniformed chauffeurs wearing identification. All our chauffeurs have full liability insurance cover to drive your vehicle. Just give our company a call&nbsp;twenty&nbsp;minutes before arrival at Luton airport and your chauffeur will meet you&nbsp;in the short stay car park at the designated meet &amp; greet point at&nbsp; <strong>Terminal Car Park 1</strong>&nbsp;level 3 next to the lifts and a pay on foot machine and driver&nbsp; will briefly check your vehicle and details and then park your car securely in our secure car park compound leaving you to check in without the worry and hassle of struggling with heavy luggage from the distance of the airport car park. When you book our meet and greet service you can have peace of mind and there is no need to allow extra time to travel. Your chauffeur will have photo card ID and the details of your booking. They will check your car for any existing damage and mark it on our booking form. They will then reconfirm with you the details you provided about your return to check if they are correct. On signing the booking form you will be handed a copy containing the information that we have collected your car along with our contact details. If you are running early or late it is important to give as much notice as possible on the departure number. We strongly advise passengers to plan with sufficient travel time to London Luton airport as significant increase of traffic may occur on airport access roads.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the M25</strong></p>

                <p>Access to London Luton airport from the west is possible through several routes. If approaching via Dunstable follow the airport signs. Alternative approaches include travelling via M40/M25 to join the M1 and then exit via junction 10. Exit the M25 at junction 21 for the access to the M1.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the M1</strong></p>

                <p>London Luton airport is only 30 minutes from North London 15 minutes from the M25 and 5 minutes from the M1. The airport is just two miles from the M1 motorway. Exit the M1 at Junction 10. The route to the airport is clearly signposted.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the East and A1</strong></p>

                <p>Access to London Luton airport from the east and A1 is via the A505 dual carriageway through Hitchin. The airport lies just off the A505 and is clearly signposted.</p>

                <p>Airport&nbsp; levy charges included</p></div>,
            pickUpProcedure: <div><p>On the day of your departure you will be welcomed by our fully uniformed chauffeurs wearing identification. All our chauffeurs have full liability insurance cover to drive your vehicle. Just give our company a call&nbsp;twenty&nbsp;minutes before arrival at Luton airport and your chauffeur will meet you&nbsp;in the short stay car park at the designated meet &amp; greet point at&nbsp; <strong>Terminal Car Park 1</strong>&nbsp;level 3 next to the lifts and a pay on foot machine and driver&nbsp; will briefly check your vehicle and details and then park your car securely in our secure car park compound leaving you to check in without the worry and hassle of struggling with heavy luggage from the distance of the airport car park. When you book our meet and greet service you can have peace of mind and there is no need to allow extra time to travel. Your chauffeur will have photo card ID and the details of your booking. They will check your car for any existing damage and mark it on our booking form. They will then reconfirm with you the details you provided about your return to check if they are correct. On signing the booking form you will be handed a copy containing the information that we have collected your car along with our contact details. If you are running early or late it is important to give as much notice as possible on the departure number. We strongly advise passengers to plan with sufficient travel time to London Luton airport as significant increase of traffic may occur on airport access roads.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the M25</strong></p>

                <p>Access to London Luton airport from the west is possible through several routes. If approaching via Dunstable follow the airport signs. Alternative approaches include travelling via M40/M25 to join the M1 and then exit via junction 10. Exit the M25 at junction 21 for the access to the M1.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the M1</strong></p>

                <p>London Luton airport is only 30 minutes from North London 15 minutes from the M25 and 5 minutes from the M1. The airport is just two miles from the M1 motorway. Exit the M1 at Junction 10. The route to the airport is clearly signposted.</p>

                <p>&nbsp;</p>

                <p><strong>To and From the East and A1</strong></p>

                <p>Access to London Luton airport from the east and A1 is via the A505 dual carriageway through Hitchin. The airport lies just off the A505 and is clearly signposted.</p>

                <p>Airport&nbsp; levy charges included</p></div>
        },
        {
            _id: "6697cfb1a1b01f7e75778761",
            name: "Airport Parking Bay Meet & Greet Luton",
            logo: "https://parkingdealsuk.com/storage/images/faf39cd77da85eb710e37b218ec2ddab.jpeg",
            // finalQuote: Math.floor(quoteForDayForAirportParkingBay(day)*100)/100,
            type: "Meet and Greet",
            rating: 5.0,
            quote: 0,
            cancellationCover: true,
            facilities: [
                "Uniformed Insured chauffeurs",
                "Pickup & Drop Off at the terminal.",
                "No buses, No Waiting. Meet and Greet",
                "Airport levy charges not included"
            ],
            overView: <div><p><strong><em>Transfers</em></strong></p>

                <p>Opening times: 24 Hours / 7 Days</p>

                <p>Estimated journey time to airport: Drop off at the terminal</p>

                <p>Your keys will stay with the car park whilst you are away.</p>

                <p>You leave your keys</p>

                <p>No Transfer time (Meet &amp; Greet service)</p>

                <p>Special cheap price, not always available...Book Today to avoid disappointment</p>

                <p>&nbsp;chauffeur will meet you at the terminal building at the designated area to collect your car.&nbsp;</p>

                <p>When you return from your trip our chauffeur returns your car to you at the terminal.</p>

                <p>On your return, your car is only a phone call away and will be delivered back to the terminal for your convenience.&nbsp;</p>

                <p>All &nbsp;drivers are mature, uniformed, carry I.D. And are fully insured to drive your vehicle.</p>

                <p>&nbsp;</p>

                <p><em>Disabled Info</em></p>

                <p>No transfers are needed, Meet and Greet will be an excellent alternative for disabled customers who would find it difficult to use transfer buses. Your car is collected from the terminal when you leave, and brought back to you at the terminal on return.</p>

                <p><strong><em>Additional Info</em></strong></p>

                <p>Please ensure your car&nbsp;:</p>

                <p>Tyres are required to meet the legal limits</p>

                <p>Vehicle must have valid Road Tax</p>

                <p>Have sufficient petrol as it is parked off airport</p>

                <p>Vehicle must have valid MOT</p>

                <p>&nbsp;Vehicle must be safe to drive<br />
                    &nbsp;</p>

                <p><strong><em>Vehicle Restrictions<br />
                    &nbsp;</em></strong></p>

                <p>Parking is for cars only and cars must fit in to a standard sized parking space (2.4m wide x 4.8m long).&nbsp;</p>

                <p>Very large vehicles and minibuses may be refused if prior arrangements are not made.&nbsp;</p>

                <p><br />
                    <em>Insurance</em></p>

                <p>All drivers are fully insured to drive your vehicle.</p>

                <p>&nbsp;</p></div>,
            dropOffProcedure: <div><h1>Meet &nbsp;&amp; Greet Departure</h1>

                <p>On the day of your departure you will be welcomed by our fully uniformed chauffeurs wearing identification. All our chauffeurs have full liability insurance cover to drive your vehicle. Just give our company a call&nbsp;twenty&nbsp;minutes before arrival at Luton airport and your chauffeur will meet you&nbsp;in the short stay car park at the designated meet &amp; greet point at&nbsp; <strong>Terminal Car Park 1</strong>&nbsp;Level 3, next to the lifts and a Pay on Foot Machine and driver&nbsp; will briefly check your vehicle and details and then park your car securely in our secure car park compound leaving you to check in without the worry and hassle of struggling with heavy luggage from the distance of the airport car park. When you book our meet and greet service you can have peace of mind and there is no need to allow extra time to park and ride.</p>

                <p>Your chauffeur will have photo card ID and the details of your booking. They will check your car for any existing damage and mark it on our booking form. They will then re-confirm with you the details you provided about your return to check if they are correct. On signing the booking form, you will be handed a copy containing the information that we have collected your car, along with our contact details.</p>

                <h3>If you are running early or late, it is important to give as much notice as possible on the Departure number.</h3>

                <p>We strongly advise passengers to plan with sufficient travel time to London Luton Airport as significant increase of traffic may occur on airport access roads.</p>

                <p><strong>To and From the M25</strong><br />
                    Access to London Luton Airport from the West is possible through several routes. If approaching via Dunstable, follow the airport signs.</p>

                <p>Alternative approaches include travelling via M40/M25 to join the M1 and then exit via Junction 10. Exit the M25 at Junction 21 for the access to the M1.</p>

                <p><strong>To and From the M1</strong><br />
                    London Luton Airport is only 30 minutes from North London, 15 minutes from the M25 and 5 minutes from the M1.</p>

                <p>The airport is just two miles from the M1 motorway. Exit the M1 at Junction 10. The route to the airport is clearly signposted.</p>

                <p><strong>To and From the East and A1</strong><br />
                    Access to London Luton Airport from the East and A1 is via the A505 dual carriageway through Hitchin.</p>

                <p>The airport lies just off the A505 and is clearly signposted.</p>

                <p>Airport&nbsp; levy charges entry &nbsp;paid by comapany and exit fees paid by customer.</p></div>,
            pickUpProcedure: <div><h1>Meet &nbsp;&amp; Greet Departure</h1>

                <p>On the day of your departure you will be welcomed by our fully uniformed chauffeurs wearing identification. All our chauffeurs have full liability insurance cover to drive your vehicle. Just give our company a call&nbsp;twenty&nbsp;minutes before arrival at Luton airport and your chauffeur will meet you&nbsp;in the short stay car park at the designated meet &amp; greet point at&nbsp; <strong>Terminal Car Park 1</strong>&nbsp;Level 3, next to the lifts and a Pay on Foot Machine and driver&nbsp; will briefly check your vehicle and details and then park your car securely in our secure car park compound leaving you to check in without the worry and hassle of struggling with heavy luggage from the distance of the airport car park. When you book our meet and greet service you can have peace of mind and there is no need to allow extra time to park and ride.</p>

                <p>Your chauffeur will have photo card ID and the details of your booking. They will check your car for any existing damage and mark it on our booking form. They will then re-confirm with you the details you provided about your return to check if they are correct. On signing the booking form, you will be handed a copy containing the information that we have collected your car, along with our contact details.</p>

                <h3>If you are running early or late, it is important to give as much notice as possible on the Departure number.</h3>

                <p>We strongly advise passengers to plan with sufficient travel time to London Luton Airport as significant increase of traffic may occur on airport access roads.</p>

                <p><strong>To and From the M25</strong><br />
                    Access to London Luton Airport from the West is possible through several routes. If approaching via Dunstable, follow the airport signs.</p>

                <p>Alternative approaches include travelling via M40/M25 to join the M1 and then exit via Junction 10. Exit the M25 at Junction 21 for the access to the M1.</p>

                <p><strong>To and From the M1</strong><br />
                    London Luton Airport is only 30 minutes from North London, 15 minutes from the M25 and 5 minutes from the M1.</p>

                <p>The airport is just two miles from the M1 motorway. Exit the M1 at Junction 10. The route to the airport is clearly signposted.</p>

                <p><strong>To and From the East and A1</strong><br />
                    Access to London Luton Airport from the East and A1 is via the A505 dual carriageway through Hitchin.</p>

                <p>The airport lies just off the A505 and is clearly signposted.</p>

                <p>Airport&nbsp; levy charges entry &nbsp;paid by comapany and exit fees paid by customer.</p></div>
        }
    ];
}

export const fetchAllAirports = async (dispatch) => {
    dispatch(setAirports(airports));
    try {
        const response = await api.get("/api/user/get-all-airports");
        console.log(response.data);
        // dispatch(setAirports(response.data));
    } catch (err) {
        console.log(err);
    }
};

export const getAvailableQuotes = async (queryParams, dispatch, toast, setLoading, setPageLoading, setShowEditModal, day) => {
    console.log(day);
    // dispatch(setQuotes(settingQuotes(day)));
    try {
        // const response = await api.get(`/api/user/find-vendor-detail?${queryParams.toString()}`);
        const response = await api.get(`/api/common-role/find-all-vendors`);
        console.log(response.data);
        dispatch(setQuotes(response.data?.data?.map(q => {
            return {
                ...q,
                quote: quoteForDay(q.quote, q.quote, day),
                finalQuote: quoteForDay(q.finalQuote, day)
            }
        })));
        setShowEditModal && setShowEditModal(false);
    } catch (err) {
        console.log(err);
        toast?.current.show({
            severity: 'error',
            summary: 'Error occur while finding suitable parking slots!',
            detail: err.response?.data.error,

            life: 3000
        });
    } finally {
        setLoading && setLoading(false);
        setPageLoading && setPageLoading(false);
    }
}
