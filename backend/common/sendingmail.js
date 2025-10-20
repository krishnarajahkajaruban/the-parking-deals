const User = require('../models/userModel');
const sendEmail = require('./mailService');

const sendEmailToUser = async (booking, user, type) => {
    const company = await User.findById(booking.companyId)
        .select("email companyName serviceType")
        .lean()
        .exec();

    if (!company) {
        throw new Error("Company not found");
    }

    return sendEmail(
        user.email,
        `Booking ${type === "Cancelled"
            ? "Cancelled!"
            : type === "Failed"
                ? "Failed!"
                : "Confirmed!"
        }`,
        `
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link
                  href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                  rel="stylesheet">
              <title>The Parking Deals</title>
          </head>
  
          <body>
          <style>
                  * {
                      box-sizing: border-box;
                      font-family: "Poppins", sans-serif !important;
                      scroll-behavior: smooth;
                      margin: 0;
                      padding: 0;
                  }
  
                  .mt-1 {
                      margin-top: .25rem !important;
                  }
  
                  .mt-2 {
                      margin-top: .5rem !important;
                  }
  
                  .mt-3 {
                      margin-top: 1rem !important;
                  }
  
                  .mt-4 {
                      margin-top: 1.5rem !important;
                  }
  
                  .mt-5 {
                      margin-top: 3rem !important;
                  }
  
                  .mb-1 {
                      margin-bottom: .25rem !important;
                  }
  
                  .mb-2 {
                      margin-bottom: .5rem !important;
                  }
  
                  .mb-3 {
                      margin-bottom: 1rem !important;
                  }
  
                  .mb-4 {
                      margin-bottom: 1.5rem !important;
                  }
  
                  .mb-5 {
                      margin-bottom: 3rem !important;
                  }
  
                  .text-bold {
                      font-weight: 600 !important;
                  }
  
                  .text-center {
                      text-align: center;
                  }
  
                  .font-weight-normal {
                      font-weight: 400 !important;
                  }
  
                  .booking_info_area ul {
                      padding-left: 40px;
                  }
  
                  .booking_info_area ul li {
                      font-size: 14px;
                      color: #000;
                      margin-bottom: 5px;
                  }
  
                  .booking_info_area {
                      position: relative;
                      padding: 20px;
                  }
  
                  .booking_info_header {
                      width: 100%;
                      position: relative;
                      background-color: #e7e7fa;
                      padding: 15px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border-radius: 10px;
                  }
  
                  .booking_info_header img {
                      height: 60px;
                      object-fit: contain;
                  }
  
                  .booking_info_title {
                      font-size: 25px;
                      color: #000;
                      font-weight: 700;
                      margin: 20px 0 30px 0;
                  }
  
                  .booking_info_area p {
                      font-size: 14px;
                      color: #000;
                      font-weight: 400;
                  }
  
                  .booking_head {
                      font-size: 20px;
                      color: #000;
                      margin-bottom: 20px;
                  }
  
                  .booking_sub_head {
                      font-size: 16px;
                      color: #000;
                      margin-bottom: 15px;
                  }

                 .text-highlight {
                    background-color: #ccffff;
                    max-width: max-content;
                    padding: 5px 8px;
                    border: 1px solid red;

                }

                .text-decoration-underline {
                    text-decoration: underline;
                }

                .text-red {
                    color: red;
                }

                h4{
                    font-size: 17px;
                }
  
                  .booking_info_area a {
                      color: #d12788;
                      text-wrap: nowrap;
                  }
  
                  .booking_footer_text {
                      font-size: 16px;
                      font-weight: 400;
                  }
  
                  .booking_accept_area {
                      display: flex;
                      gap: 15px;
                      flex-wrap: wrap;
                      align-items: center;
                      justify-content: center;
                  }
  
                  .table-container {
                      width: 100%;
                      overflow-x: auto;
                  }
  
                  table {
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 14px;
                  }
  
                  thead th {
                      background-color: #f2f2f2;
                      text-align: left;
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  tbody th {
                      background-color: #f9f9f9;
                      text-align: left;
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  tbody td {
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  @media screen and (max-width: 600px) {
  
                      table,
                      tbody,
                      th,
                      td,
                      tr {
                          display: block;
                          width: 100%;
                      }
  
                      tbody th,
                      tbody td {
                          text-align: left;
                          padding-left: 15px;
                          padding-right: 15px;
                          position: relative;
                      }
  
                      tbody th::before,
                      tbody td::before {
                          content: attr(data-label);
                          position: absolute;
                          left: 0;
                          width: 100%;
                          padding-left: 10px;
                          font-weight: bold;
                          text-align: left;
                      }
                  }
              </style>
              <div class="booking_info_area">
                  <div class="booking_info_header">
                      <img src="https://www.theparkingdeals.co.uk/assets/images/logo.png" alt="The Parking Deals">
                  </div>
                  <h3 class="booking_info_title">Booking ${type === "Cancelled"
            ? "Cancelled!"
            : type === "Failed"
                ? "Failed!"
                : "Confirmed!"
        }</h3>
                  <p class="mb-4">Dear ${user.firstName},</p>
  
                  <p class="mb-3">
                      Thank you for booking with
                      <b> ${company.companyName}</b>
                      through us. You will find your booking details and
                      next steps below. You can
                      view, amend or print your booking online by visiting our Manage my booking page.
                  </p>
  
                  <h4 class="booking_head">
                      Booking ${type === "Cancelled"
            ? "Cancelled!"
            : type === "Failed"
                ? "Failed!"
                : "Confirmed!"
        }:&nbsp;
                      <span>${booking.bookingId}</span>
                  </h4>
  
                  <div class="table-container">
                      <table>
                          <tbody>
                              <tr>
                                  <th>Booked By</th>
                                  <td>${user.title} ${user.firstName} ${user.lastname || ""
        }</td>
                                  <th>Flying From</th>
                                  <td>${booking.airportName}</td>
                              </tr>
                              <tr>
                                  <th>Service</th>
                                  <td>${company.companyName}</td>
                                  <th>Inbound Flight</th>
                                  <td>${booking.travelDetail.inBoundFlight || "-"
        }</td>
                              </tr>
                              <tr>
                                  <th>Service Type</th>
                                  <td>${company.serviceType}</td>
                                  <th>Extras</th>
                                  <td>Cancellation Cover: ${booking.cancellationCoverFee ? "Yes" : "No"
        }</td>
                              </tr>
                              <tr>
                                  <th>From</th>
                                  <td>${booking.dropOffDate} ${booking.dropOffTime
        }</td>
                                  <th>Inbound Terminal</th>
                                  <td>${booking.travelDetail.arrivalTerminal
        }</td>
                              </tr>
                              <tr>
                                  <th>To</th>
                                  <td>${booking.pickUpDate} ${booking.pickUpTime
        }</td>
                                  <th>Outbound Terminal</th>
                                  <td>${booking.travelDetail.departureTerminal
        }</td>
                              </tr>
                              ${booking.vehicleDetail
            .map(
                (vehicle) => `
                              <tr>
                                  <th colspan="4" class="text-center">Vehicle Details</th>
                              </tr>
                              <tr>
                                  <th>Reg No</th>
                                  <td>${vehicle.regNo}</td>
                                  <th>Color</th>
                                  <td>${vehicle.color}</td>
                              </tr>
                              <tr>
                                  <th>Make</th>
                                  <td>${vehicle.make || "-"}</td>
                                  <th>Model</th>
                                  <td>${vehicle.model || "-"}</td>
                              </tr>`
            )
            .join("")}
                              <tr>
                                  <th colspan="4" class="text-center">Total Amount: £${booking.totalPayable
        }</th>
                              </tr>
                          </tbody>
                      </table>
                      
                  </div>
  
                <p class="mt-4">
                    Note:
                    The Parking Deals acts as booking agents only and do not store or handle customer vehicles. Your service
                    delivery contract will be with
                    <span>${company.companyName}.</span>
                    You must follow the instructions below and contact the service provider to
                    arrange your service. For any
                    issues regarding the parking service (delay, damage etc.) please contact your service provider.
                </p>

                <p class="mt-2">
                    <b>
                        Complaint Number: <a href="tel::07777135649">07777135649</a>
                    </b>
                </p>
                <p class="mt-2">
                    <b>
                        Complaint Email: <a href="mailto:info@theparkingdeals.co.uk">info@theparkingdeals.co.uk</a>
                    </b>
                </p>

                <h4 class="booking_head mt-5">
                    Instructions:
                </h4>

                <!-- <h5 class="booking_sub_head mt-3">
                    Telephone your friendly driver:
                    <span>07534185858 or 07534185856</span>
                </h5> -->

                <p>We require you to call us 20-30 minutes prior to your arrival so we can arrange a driver for you.</p>

                <h5 class="booking_sub_head mt-4">
                    Directions and Instructions:
                </h5>

                ${((company.companyName).toLowerCase() === "luton 247 meet & greet" || (company.companyName).toLowerCase() === "airport parking bay meet & greet luton") ? (
                    `
                        <p class="mb-3 text-bold">Meet & Greet service</p>

                        <p class="mb-2">
                            Secure off-site parking
                        </p>

                        <p class="mb-2">
                            Repable, punctual & professional staff
                        </p>

                        <p class="mb-2">
                            24/7 service
                        </p>

                        <p class="mb-2">
                            A <span class="text-bold">£10</span> exit fee is payable upon return (card or cash accepted)
                        </p>

                        <p class="mb-2">
                            <span class="text-bold">£20</span> per additional day applies for overstays
                        </p>

                        <p class="mb-2">
                            Vehicles may be moved up to 4–5 miles to our other secure car park compound during busy periods
                            for operational reasons
                        </p>


                        <p class="mb-3 mt-4 text-bold">Meet & Greet – Customer Instructions</p>

                        <p class="mb-2">
                            Authorised Operator at Luton Airport | Secure Off-Site Parking
                        </p>

                        <p class="mb-2">
                            What is Off-Site Meet & Greet?
                        </p>

                        <p class="mb-2 ms-3 text-bold">
                            Drop your car at Car Park 1 – Level 3
                        </p>

                        <p class="mb-2 ms-3">
                            Our driver parks it in our private, off-site facility
                        </p>

                        <p class="mb-2 ms-3">
                            We return your car to the same location upon your return
                        </p>

                        <p class="mb-2 ms-3">
                            No need for shuttles – terminal convenience at a better rate
                        </p>


                        <p class="mb-3 mt-4 text-bold">Drop-Off Instructions:</p>

                        <p class="mb-2 text-bold">
                            Call us 30 minutes before arrival:
                            <a href="tel:07534 185856" class="text-bold font-17">07534 185856</a> / <a href="tel:07534 185858"
                                class="text-bold font-17">07534 185858</a>
                        </p>

                        <p class="mb-2">
                            Follow signs to <span class="text-bold text-underlined">Car Park 1, Level 3</span>
                        </p>

                        <p class="mb-2">
                            Look for the <span class="text-bold">"Offsite Meet & Greet"</span> signage and our Airport Parking Bay desk
                        </p>

                        <p class="mb-2">
                            Park in any available bay and meet our staff in hi-vis
                        </p>

                        <p class="mb-2">
                            Show booking confirmation to our staff
                        </p>

                        <p class="mb-2">
                            Sign the handover form and retain your copy
                        </p>


                        <p class="mb-3 mt-4 text-bold">Return Instructions:</p>

                        <p class="mb-2">
                            Call us twice:
                        </p>

                        <p class="mb-2">
                            When your flight lands
                        </p>

                        <p class="mb-2">
                            Once you’ve cleared Customs
                        </p>

                        <p class="mb-2">
                            Your vehicle will be returned to <span class="text-bold">Car Park 1 – Level 3</span>
                        </p>

                        <p class="mb-2">
                            <span class="text-bold">£10</span> exit fee is required for the airport car
                            park – payable by card or cash
                        </p>

                        <p class="mb-2">
                            Late returns are charged £20 per additional calendar day
                        </p>


                        <p class="mb-3 mt-4 text-bold">Vehicle Conditions:</p>

                        <p class="mb-2">
                            Vehicle must be taxed, MOT-certified, and roadworthy
                        </p>

                        <p class="mb-2">
                            Tyres must meet legal tread depth
                        </p>

                        <p class="mb-2">
                            All valuables must be removed – we do not accept liability for items left in the vehicle
                        </p>

                        <p class="mb-2">
                            Ensure washer fluid and fuel are topped up
                        </p>

                        <p class="mb-2">
                            Keep a spare key with you
                        </p>

                        <p class="mb-2">
                            <span class="text-underlined">
                                Note:Since we are a booking agency, we deal with changing reservations, dates, and other details. If you
                                would like more information, please send us an email.
                            </span>
                            <br>
                            <a class="text-bold" href="mailto:info@theparkingdeals.co.uk">(info@theparkingdeals.co.uk)</a>
                        </p>

                        <p class="mb-3 mt-4 text-bold">Disclaimer :</p>

                        <p class="text-bold mb-2">
                            We act as booking agent and we do not take vehicles from any airport. The service provider takes the vehicle
                            and they park it in their own car park. You need to call the service provider on your departure and return
                            day. Any issues regarding parking service (Delay, Damage etc. ) must be discussed with the service provider.
                        </p>

                        <p class="text-bold mb-2">
                            Any complaints over delay or damages must be sent via email. <br>
                            <a class="text-bold" href="mailto:info@airportparkingbay.co.uk">(info@airportparkingbay.co.uk)</a>
                        </p>

                        <p class="mb-3 mt-4">
                            Contact Details (24/7): <br>
                            <a href="tel:07534 185856" class="text-bold font-17">07534 185856</a> / <a href="tel:07534 185858"
                                class="text-bold font-17">07534 185858</a>
                        </p>
                    `
                ) : company.companyName.toLowerCase() === "airport parking bay park & ride" ? (
                    `
                        <p class="mb-3 text-bold">Park & Ride service</p>

                        <p class="mb-2">
                            1 mile from Luton Airport
                        </p>

                        <p class="mb-2">
                            Airport transfer included
                        </p>

                        <p class="mb-2">
                            Frequent drop-off and pick-up at the terminal
                        </p>

                        <p class="mb-2">
                            Secure car park
                        </p>

                        <p class="mb-2">
                            Customer must leave their vehicle key with us for secure storage and handling
                        </p>

                        <p class="mb-2">
                            Vehicles may be moved up to 4–5 miles to our other secure car park during busy periods
                        </p>

                        <p class="mb-2">
                            <span class="text-bold">£20</span> per additional day will be charged for overstays
                        </p>


                        <p class="mb-3 mt-4 text-bold">Park & Ride – Customer Instructions</p>

                        <p class="mb-2">
                            Secure Gated Parking – Luton Airport
                        </p>

                        <p class="mb-2 mt-4 text-bold">
                            Before You Arrive:
                        </p>

                        <p class="mb-3">
                            Car Park Address: <br>
                            <span class="text-bold font-17">No. 2 Guildford Street, Luton, LU1 2NR </span><br>
                            <a
                                href="https://www.google.com/maps/search/51.880825,+-0.411919?entry=tts&g_ep=EgoyMDI1MDYxNy4wIPu8ASoASAFQAw%3D%3D&skid=ccb5b830-56e9-440c-89e0-a6d42df4142b">
                                Google Maps
                            </a>
                        </p>

                        <p class="mb-2">
                            Look for the yellow "Private Car Park" sign on the left before the roundabout
                        </p>

                        <p class="mb-2 text-bold">
                            Call us 30 minutes before arrival:
                            <a href="tel:07534 185856" class="text-bold font-17">07534 185856</a> / <a href="tel:07534 185858"
                                class="text-bold font-17">07534 185858</a>
                        </p>


                        <p class="mb-3 mt-4 text-bold">On Arrival:</p>

                        <p class="mb-2">
                            Park in any space inside the gated compound
                        </p>

                        <p class="mb-2">
                            Stay with your luggage while waiting for the shuttle
                        </p>

                        <p class="mb-2">
                            Hand over your vehicle key to our staff for secure parking
                        </p>

                        <p class="mb-2">
                            Vehicles may be moved up to 4–5 miles to our other secure car park during busy periods
                        </p>

                        <p class="mb-2">
                            Shuttle transfer takes approx. 5–10 minutes
                        </p>

                        <p class="mb-2">
                            Max 4 passengers per vehicle
                        </p>

                        <p class="mb-2">
                            No child seats provided – please bring your own if needed
                        </p>


                        <p class="mb-3 mt-4 text-bold">Return Instructions:</p>

                        <p class="mb-2">
                            Call us twice:
                        </p>

                        <p class="mb-2">
                            When your flight lands
                        </p>

                        <p class="mb-2">
                            Once you’ve cleared Customs
                        </p>

                        <p class="mb-2">
                            You will be collected from <span class="text-bold">Car Park 1 – Level 0</span> (same drop-off point)
                        </p>

                        <p class="mb-2">
                            We’ll return you to the car park for vehicle and key collection
                        </p>


                        <p class="mt-4 mb-3 text-bold">
                            Important Notes:
                        </p>

                        <p class="mb-2">
                            Arrive at least 4 hours before your flight
                        </p>

                        <p class="mb-2">
                            Allow 30–45 minutes extra during busy times
                        </p>

                        <p class="mb-2">
                            All valuables must be removed – we do not accept liability for items left in the vehicle
                        </p>

                        <p class="mb-2">
                            Vehicles over 2m in height will incur a £50 surcharge
                        </p>

                        <p class="mb-2">
                            Late returns will incur £20 per additional day
                        </p>

                        <p class="mb-2">
                            <span class="text-underlined">
                                Note:Since we are a booking agency, we deal with changing reservations, dates, and other details. If you
                                would like more information, please send us an email.
                            </span>
                            <br>
                            <a class="text-bold" href="mailto:info@theparkingdeals.co.uk">(info@theparkingdeals.co.uk)</a>
                        </p>

                        <p class="mb-3 mt-4 text-bold">Disclaimer :</p>

                        <p class="text-bold mb-2">
                            We act as booking agent and we do not take vehicles from any airport. The service provider takes the vehicle
                            and they park it in their own car park. You need to call the service provider on your departure and return
                            day. Any issues regarding parking service (Delay, Damage etc. ) must be discussed with the service provider.
                        </p>

                        <p class="text-bold mb-2">
                            Any complaints over delay or damages must be sent via email.<br>
                            <a class="text-bold" href="mailto:info@airportparkingbay.co.uk">(info@airportparkingbay.co.uk)</a>
                        </p>

                        <p class="mb-2 mt-4">
                            Contact Details (24/7): <br>
                            <a href="tel:07534 185856" class="text-bold font-17">07534 185856</a> / <a href="tel:07534 185858"
                                class="text-bold font-17">07534 185858</a>
                        </p>

                        <p class="mb-2">
                            Admin & bookings:
                            <a class="text-bold" href="mailto:info@airportparkingbay.co.uk">info@airportparkingbay.co.uk</a>
                        </p>
                    `
                ) : company.companyName.toLowerCase() === "kangaroo parking" ? (
                    `
                        <h4 class="text-red mb-3">
                            Important: Please note that you are advised to call the service provider on 07413818425 quoting your booking reference
                            number when you are 20-30 minutes away from the airport.
                        </h4>

                        <h4 class="text-red mb-3">
                            ULEZ policy
                        </h4>

                        <h4 class="text-red mb-3">
                            If your vehicle does not meet the emissions standards, you will have to pay a charge of £12.50. Please make sure to
                            setup AUTO PAY when coming to the airport to avoid any penalty tickets as your car will move in between our compounds
                            during the stay. The operator will not be liable in case you receive a penalty for not paying the ULEZ charge.
                        </h4>

                        <p class="text-red mb-4">
                            All the vehicles must have Up to date tax and MOT, we are not liable for any charges occurred due to above. Please check
                            your tax and mot before hand over the car to us.
                        </p>

                        <p class="mb-3 text-bold">Meet & Greet service</p>

                        <p class="mb-3 text-bold">Terminal 2 - Departure Instructions</p>

                        <p class="mb-3 text-decoration-underline text-bold text-highlight">"Customer has to pay for the entry and exit fee".</p>

                        <p class="mb-2">
                            From the M25 exit at Junction 14, follow the signs for Terminals 1, 2 & 3 all the way round following onto the
                            Western Perimeter Road.
                            Go through the main tunnel to the Central Terminal Area for Terminals 1, 2 & 3.
                        </p>

                        <p class="mb-2">
                            Exiting the tunnel, keep right, passing the Central Bus Station, joining the final approaches to Terminal 2 on
                            Cosmopolitan Way.
                            Please keep to the right, as the road to Terminal 2 will move away from building before turning back as the road
                            ramps up to Terminal 2 Departures & the Short Stay 2 car park on Constellation Way.
                        </p>

                        <p class="mb-2">
                            Once you are on the rising ramp, continue to keep right as the ramp will lead directly into the "Short stay car
                            park" entry barriers.
                        </p>

                        <p class="mb-2">
                            Please make sure you are in lane 5 or 6, (towards the ticket machine), which will take you to Level 4 of the
                            Short
                            Stay car park.
                            Take a ticket at the barrier and enter the carp ark.
                        </p>

                        <p class="mb-2">
                            Once you enter the car park on Level 4, keep to the RIGHT following the signs for 'Off Airport Parking Meet &
                            Greet'
                            and then please park your car in "Row B".
                        </p>

                        <p class="mb-2">
                            Here you will see our chauffeurs waiting for you.
                        </p>

                        <p class="mt-5 mb-3 text-bold">Terminal 2 Return Instructions</p>

                        <p class="mb-2">
                            On your return, once you have collected your luggage and are about to clear Customs, please call the number
                            provided
                            when your car was dropped off.
                        </p>

                        <p class="mb-2 mb-5">
                            Make your way to the same place where you dropped the vehicle off, (Level 4 of the Short Stay car park) and your
                            car
                            will be ready and waiting for you in Row B next to the lift/pay machine
                        </p>

                        <p class="mb-3 text-bold">Terminal 3 - sat-nav postcode: TW6 1QG</p>

                        <p class="mb-3 text-bold">Terminal 3 - Departure Instructions</p>

                        <p class="mb-3 text-decoration-underline text-bold text-highlight">"Customer has to pay for the entry and exit fee".</p>

                        <p class="mb-2">
                            From the M25 exit at Junction 14, follow the signs for Terminals 1, 2 & 3 all the way round following onto the
                            Western Perimeter Road.
                        </p>

                        <p class="mb-2">
                            Go through the main tunnel to the Central Terminal Area for Terminals 1, 2 & 3.
                        </p>

                        <p class="mb-2">
                            Exiting the tunnel, keep in the 1st lane and follow signs for Terminal 3 Short Stay Carpark (Carpark 3).
                        </p>

                        <p class="mb-2">
                            Take a ticket from the barrier and follow signs to Level 4, then please park your car in "Row A".
                        </p>

                        <p class="mb-5">
                            Here you will see our chauffeurs waiting for you.
                        </p>

                        <p class="mb-3 text-bold">Terminal 3 Return Instructions</p>

                        <p class="mb-2">
                            On your return, once you have collected your luggage and are about to clear Customs, please call the number
                            provided
                            when your car was dropped off.
                        </p>

                        <p class="mb-5">
                            As you arrive in the arrivals, just before the Exit door on the Right Hand Side, please take the lift to Level 4
                            Short Stay Car Park and your car will be ready and waiting for you in ROW A.
                        </p>

                        <p class="mb-3 text-bold">Terminal 4 - sat-nav postcode: TW6 3XA</p>

                        <p class="mb-3 text-bold">Terminal 4 - Departure Instructions</p>

                        <p class="mb-4 text-decoration-underline text-bold text-highlight">"Customer has to pay for the entry and exit fee".</p>

                        <p class="mb-2">
                            Please follow directions to the Short Stay car park and then drive up to Level 2. Look for the "Off Airport Meet
                            and
                            Greet' sign at Row F, bay number 50 to 60.
                        </p>

                        <p class="mb-2">
                            Please have your email booking confirmation ready, together with your return flight details.
                        </p>

                        <p class="mb-5">
                            Here you will see our chauffeurs waiting for you.
                        </p>

                        <p class="mb-3 text-bold">Terminal 4 Return Instructions.</p>

                        <p class="mb-5">
                            On your return, once you have collected your luggage and are about to clear Customs, please call the number
                            provided
                            when your car was dropped off. Walk back to the Short Stay car park (Level 2, Row F,Bay number 50 to 60 ) where
                            your
                            car will be ready and waiting for you.
                        </p>

                        <p class="mb-3 text-bold">Terminal 5 - sat-nav postcode: TW6 2GA</p>

                        <p class="mb-3 text-bold">Terminal 5 - Departure Instructions</p>

                        <p class="mb-4 text-decoration-underline text-bold text-highlight">"Customer has to pay for the entry and exit fee".</p>

                        <p class="mb-2">
                            Please follow the signs for the "Short Stay car park", which is located on the right hand side of the ramp, as
                            you
                            take the exit for Terminal 5 from the roundabout.
                        </p>

                        <p class="mb-2">
                            On arrival at the Short Stay car park, please move to the left hand lane, following directions to "LEVEL 4".
                        </p>

                        <p class="mb-2">
                            Take a ticket from the barrier and make your way to Zones "R-S". Please Park your car in these designated areas,
                            sign posted as "Off Airport Meet & Greet"
                        </p>

                        <p class="mb-5">
                            Here you will see our chauffeurs waiting for you.
                        </p>

                        <p class="mb-3 text-bold">Terminal 5 Return Instructions</p>

                        <p class="mb-2">
                            On your return, once you have collected your luggage and are about to clear Customs, please call the number
                            provided
                            when your car was dropped off.
                        </p>

                        <p class="mb-2">
                            Make your way to where you dropped the car off, (Level 4, Short Stay car park), where your car will be ready and
                            waiting for you in Row R OR S.
                        </p>
                    `
                ) : (
                    `
                        <p class="mb-3 text-bold">Arrival Procedure</p>
                        <p>
                            Please call us 20 minutes prior arriving to the airport on
                            <span>${company.mobileNumber}</span>.
                            <br>
                            Please follow signs for Multi-Storey car park (LU2 9QT Height Restrictions 2.1m or 6ft 8in) and drive to the
                            barrier, you need to take a
                            ticket after the barrier follow the sign for Level 3 or off airport parking meet & greet drop off point pull
                            into a bay, where you will find our
                            driver waiting for you, and please give your ticket and the key to the driver. Will ask you to check your
                            vehicle and sign the paperwork for
                            handover.
                        </p>

                        <p class="mb-3 mt-4 text-bold">Return Procedure</p>
                        <p>
                            On your safe retum, we require you to call us twice on 07534185858 or 07534185856. Once as soon as you land
                            and the other as soon
                            as you collected your luggage.
                        </p>
                        <p class="mt-2">
                            You will be required to pay per £5.OO (15mins) Change to validate car park Entry & Exit Fee.
                        </p>
                    `
                )}

                <p class="mb-3 mt-4 text-bold">ATTENTION</p>
                <p>
                    If you return after midnight you have to pay additional day charge
                </p>

                <h5 class="booking_sub_head mt-4">
                    After 15 Minutes: Normal Airport tariffs apply.
                </h5>

                <p>
                    For any amendments or any changes while you abroad, please email
                    <a href="mailto::${company.email}">:${company.email}</a>
                </p>

                <h5 class="booking_sub_head mt-4">
                    Warning: <span class="font-weight-normal">Please note that unless your car:</span>
                </h5>

                <ul>
                    <li>Have a valid road tax and contains a valid road tax for your return date</li>
                    <li>has tyre tread on each tyre that is within the legal limit</li>
                    <li>or is in any other way unsafe to drive</li>
                </ul>

                <p class="mt-3 mb-3">
                    the driver will not be able to take your car and you will have to make other arrangements to park your car.
                    Your contract will be
                    deemed to have started and you will not be able to claim a refund.
                </p>

                <p>
                    Please also ensure that your vehicle has water in the washer bottle and that you have not run your fuel down
                    to the minimum as
                    although our car park is close to the airport we will have to drive your car off the airport itself.
                </p>

                <h4 class="booking_head mt-5">
                    Essential Information:
                </h4>

                <p class="mb-3">
                    A booking may be cancelled up to 48 hours prior to drop off date except on certain non-flexible offers and
                    same day bookings which are
                    non-refundable. All cancellations will incur a £15 administration fee unless cancellation cover is
                    purchased at time of booking.
                </p>

                <p class="mb-3">
                    You must allow sufficient time to drop off the vehicle and complete airport departure procedures. Please
                    take in to account traffic delays,
                    breakdowns or semce delays during busy periods. If you are late or early, please inform Service Provider as
                    soon as possible. Last
                    minute changes or no advance notice may result in delays to your service.
                </p>

                <p class="mb-3">
                    Any parking is at your own risk and subject to service provider's terms and conditions, so we ask that you
                    don't keep any valuables in
                    your car. Check your vehicle carefully at pickup and report any issues to driver and ensure these are logged
                    on the paperwork before
                    leaving. Claims cannot be considered once your vehicle has left the terminal or car park. You can view our
                    full terms on our website
                </p>

                <p>
                    If you have any further queries or if you need any help with your booking, please contact us on
                    <a href="tel:tel:07777135649">tel:07777135649</a>
                </p>

                <h6 class="mt-5 booking_footer_text">
                    The Parking Deals is a trading name of Air Travel Extras Limited. The Parking Deals uses 3rd party payment
                    processing
                    companies to accept payments. Therefore, you may see their name on your bank/card statements.
                </h6>

                <h6 class="mt-3 booking_footer_text mb-4">
                    <b>
                        We use cookies to improve your experience on our site. By continuing to browse the site, you agree to
                        our use of
                        <a href="https://www.theparkingdeals.co.uk/terms-and-conditions" rel="noopener"
                            target="_blank">cookies</a>
                        &nbsp;&&nbsp;
                        <a href="https://www.theparkingdeals.co.uk/privacy-policy" rel="noopener"
                            target="_blank">privacy-policy</a>
                    </b>
                </h6>

                <hr class="mb-3 ">

                <h4 class="booking_head mb-2">
                    Contact Us
                </h4>

                <p>
                    <b>
                        <a href="mailto:info@theparkingdeals.co.uk">
                            info@theparkingdeals.co.uk
                        </a>
                    </b>
                </p>

                <p class="mt-2">
                    <b><a href="tel:07777135649">07777135649</a></b>
                </p>

                <hr class="mt-4">

                <h4 class="booking_head mt-4 mb-2 text-center">
                    We Accept
                </h4>

                <div class="booking_accept_area">
                    <!-- <img src="https://www.paypalobjects.com/digitalassets/c/website/logo/full-text/pp_fc_hl.svg" height="25"
                        alt="Pay Pal"> -->
                    <img src="https://i.ibb.co/tmGWs0x/6220ac7d912013c51947f9c6.png" height="50" alt="Stripe">
                </div>
            </div>
        </body>
        `
    );
};

const sendEmailToCompany = async (booking, user, type) => {
    const company = await User.findById(booking.companyId)
        .select("email companyName serviceType")
        .lean()
        .exec();

    if (!company) {
        throw new Error("Company not found");
    }

    return sendEmail(
        company.email,
        `${type === "Cancelled"
            ? "Parking Slot Booking Cancelled!"
            : type === "Failed"
                ? "Parking Slot Booking Failed!"
                : "Parking slot has been Booked!"
        }`,
        `
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link
                  href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                  rel="stylesheet">
              <title>The Parking Deals</title>
          </head>
  
          <body>
          <style>
                  * {
                      box-sizing: border-box;
                      font-family: "Poppins", sans-serif !important;
                      scroll-behavior: smooth;
                      margin: 0;
                      padding: 0;
                  }
  
                  .mt-1 {
                      margin-top: .25rem !important;
                  }
  
                  .mt-2 {
                      margin-top: .5rem !important;
                  }
  
                  .mt-3 {
                      margin-top: 1rem !important;
                  }
  
                  .mt-4 {
                      margin-top: 1.5rem !important;
                  }
  
                  .mt-5 {
                      margin-top: 3rem !important;
                  }
  
                  .mb-1 {
                      margin-bottom: .25rem !important;
                  }
  
                  .mb-2 {
                      margin-bottom: .5rem !important;
                  }
  
                  .mb-3 {
                      margin-bottom: 1rem !important;
                  }
  
                  .mb-4 {
                      margin-bottom: 1.5rem !important;
                  }
  
                  .mb-5 {
                      margin-bottom: 3rem !important;
                  }
  
                  .text-bold {
                      font-weight: 600 !important;
                  }
  
                  .text-center {
                      text-align: center;
                  }
  
                  .font-weight-normal {
                      font-weight: 400 !important;
                  }
  
                  .booking_info_area ul {
                      padding-left: 40px;
                  }
  
                  .booking_info_area ul li {
                      font-size: 14px;
                      color: #000;
                      margin-bottom: 5px;
                  }
  
                  .booking_info_area {
                      position: relative;
                      padding: 20px;
                  }
  
                  .booking_info_header {
                      width: 100%;
                      position: relative;
                      background-color: #e7e7fa;
                      padding: 15px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border-radius: 10px;
                  }
  
                  .booking_info_header img {
                      height: 60px;
                      object-fit: contain;
                  }
  
                  .booking_info_title {
                      font-size: 25px;
                      color: #000;
                      font-weight: 700;
                      margin: 20px 0 30px 0;
                  }
  
                  .booking_info_area p {
                      font-size: 14px;
                      color: #000;
                      font-weight: 400;
                  }
  
                  .booking_head {
                      font-size: 20px;
                      color: #000;
                      margin-bottom: 20px;
                  }
  
                  .booking_sub_head {
                      font-size: 16px;
                      color: #000;
                      margin-bottom: 15px;
                  }
  
                  .booking_info_area a {
                      color: #d12788;
                      text-wrap: nowrap;
                  }
  
                  .booking_footer_text {
                      font-size: 16px;
                      font-weight: 400;
                  }
  
                  .booking_accept_area {
                      display: flex;
                      gap: 15px;
                      flex-wrap: wrap;
                      align-items: center;
                      justify-content: center;
                  }
  
                  .table-container {
                      width: 100%;
                      overflow-x: auto;
                  }
  
                  table {
                      width: 100%;
                      border-collapse: collapse;
                      font-size: 14px;
                  }
  
                  thead th {
                      background-color: #f2f2f2;
                      text-align: left;
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  tbody th {
                      background-color: #f9f9f9;
                      text-align: left;
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  tbody td {
                      padding: 10px;
                      border: 1px solid #ddd;
                  }
  
                  @media screen and (max-width: 600px) {
  
                      table,
                      tbody,
                      th,
                      td,
                      tr {
                          display: block;
                          width: 100%;
                      }
  
                      tbody th,
                      tbody td {
                          text-align: left;
                          padding-left: 15px;
                          padding-right: 15px;
                          position: relative;
                      }
  
                      tbody th::before,
                      tbody td::before {
                          content: attr(data-label);
                          position: absolute;
                          left: 0;
                          width: 100%;
                          padding-left: 10px;
                          font-weight: bold;
                          text-align: left;
                      }
                  }
              </style>
  
              <div class="booking_info_area">
                  <div class="booking_info_header">
                      <img src="https://www.theparkingdeals.co.uk/assets/images/logo.png" alt="The Parking Deals">
                  </div>
                  
                  <h4 class="booking_head">
                      Booking ${type === "Cancelled"
            ? "Cancelled!"
            : type === "Failed"
                ? "Failed!"
                : "Confirmed!"
        }:&nbsp;
                      <span>${booking.bookingId}</span>
                  </h4>
  
                  <div class="table-container">
                      <table>
                          <tbody>
                              <tr>
                                  <th>Booked By</th>
                                  <td>${user.title} ${user.firstName} ${user.lastname || ""
        }</td>
                                  <th>Flying From</th>
                                  <td>${booking.airportName}</td>
                              </tr>
                              <tr>
                                  <th>Service</th>
                                  <td>${company.companyName}</td>
                                  <th>Inbound Flight</th>
                                  <td>${booking.travelDetail.inBoundFlight || "-"
        }</td>
                              </tr>
                              <tr>
                                  <th>From</th>
                                  <td>${booking.dropOffDate} ${booking.dropOffTime
        }</td>
                                  <th>Inbound Terminal</th>
                                  <td>${booking.travelDetail.arrivalTerminal
        }</td>
                              </tr>
                              <tr>
                                  <th>To</th>
                                  <td>${booking.pickUpDate} ${booking.pickUpTime
        }</td>
                                  <th>Outbound Terminal</th>
                                  <td>${booking.travelDetail.departureTerminal
        }</td>
                              </tr>
                              <tr>
                                  <th>Mobile Number</th>
                                  <td>${user.mobileNumber}</td>
                                  <th>Service Type</th>
                                  <td>${company.serviceType}</td>
                              </tr>
                              ${booking.vehicleDetail
            .map(
                (vehicle) => `
                              <tr>
                                  <th colspan="4" class="text-center">Vehicle Details</th>
                              </tr>
                              <tr>
                                  <th>Reg No</th>
                                  <td>${vehicle.regNo}</td>
                                  <th>Color</th>
                                  <td>${vehicle.color}</td>
                              </tr>
                              <tr>
                                  <th>Make</th>
                                  <td>${vehicle.make || "-"}</td>
                                  <th>Model</th>
                                  <td>${vehicle.model || "-"}</td>
                              </tr>`
            )
            .join("")}
                              <tr>
                                  <th colspan="4" class="text-center">Total Amount: £${booking.bookingQuote
        }</th>
                              </tr>
                          </tbody>
                      </table>
                      
                  </div>
  
                  <h6 class="mt-5 booking_footer_text">
                      The Parking Deals is a trading name of Air Travel Extras Limited. The Parking Deals uses 3rd party payment
                      processing
                      companies to accept payments. Therefore, you may see their name on your bank/card statements.
                  </h6>
  
                  <h6 class="mt-3 booking_footer_text mb-4">
                      <b>
                          We use cookies to improve your experience on our site. By continuing to browse the site, you agree to
                          our use of
                          <a href="https://www.theparkingdeals.co.uk/terms-and-conditions" rel="noopener"
                              target="_blank">cookies</a>
                          &nbsp;&&nbsp;
                          <a href="https://www.theparkingdeals.co.uk/privacy-policy" rel="noopener"
                              target="_blank">privacy-policy</a>
                      </b>
                  </h6>
  
                  <hr class="mb-3 ">
  
                  <h4 class="booking_head mb-2">
                      Contact Us
                  </h4>
  
                  <p>
                      <b>
                          <a href="mailto:info@theparkingdeals.co.uk">
                              info@theparkingdeals.co.uk
                          </a>
                      </b>
                  </p>
  
                  <p class="mt-2">
                      <b><a href="tel:07777135649">07777135649</a></b>
                  </p>
  
                  <hr class="mt-4">
              </div>
          </body>
                `
    );
};


module.exports = { sendEmailToUser, sendEmailToCompany };