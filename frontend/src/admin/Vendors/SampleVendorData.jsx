import api from "../../api";

export const SampleVendorData = {
    getVendorsData() {
        return api.get('/api/common-role/find-all-vendors')
            .then(res=>{
                console.log(res.data);
                return res.data?.data;
            })
            .catch(err => {
                console.error(err);
                return [];
            })
    },

    getVendorBookingsData(token, id, period) {
        return api.get(`/api/admin/find-bookings/${id}`, {
            params: {
                ...(period && { period })
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res=>{
                console.log(res.data);
                return { bookings: res.data?.data, dealPercentage: res.data.dealPercentage, companyName: res.data.companyName, totalBookingQuote: res.data.totalBookingQuote, totalBalance: res.data.totalBalance };
            })
            .catch(err => {
                console.error(err);
                return { bookings: [], dealPercentage: 0, companyName: "", totalBookingQuote: 0, totalBalance: 0 };
            })
        // return [
        //     {
        //         bookingId: 'TPD001',
        //         initialQuote: 150,
        //         bookingDate: '2024-08-19',
        //         dealPercentage: 15
        //     },
        //     {
        //         bookingId: 'TPD002',
        //         initialQuote: 200,
        //         bookingDate: '2024-08-20',
        //         dealPercentage: 10
        //     },
        //     {
        //         bookingId: 'TPD003',
        //         initialQuote: 175,
        //         bookingDate: '2024-08-21',
        //         dealPercentage: 20
        //     },
        //     {
        //         bookingId: 'TPD004',
        //         initialQuote: 225,
        //         bookingDate: '2024-08-22',
        //         dealPercentage: 5
        //     },
        //     {
        //         bookingId: 'TPD005',
        //         initialQuote: 300,
        //         bookingDate: '2024-08-23',
        //         dealPercentage: 25
        //     },
        //     {
        //         bookingId: 'TPD006',
        //         initialQuote: 275,
        //         bookingDate: '2024-08-24',
        //         dealPercentage: 15
        //     },
        //     {
        //         bookingId: 'TPD007',
        //         initialQuote: 320,
        //         bookingDate: '2024-08-25',
        //         dealPercentage: 30
        //     },
        //     {
        //         bookingId: 'TPD008',
        //         initialQuote: 250,
        //         bookingDate: '2024-08-26',
        //         dealPercentage: 12
        //     },
        //     {
        //         bookingId: 'TPD009',
        //         initialQuote: 180,
        //         bookingDate: '2024-08-27',
        //         dealPercentage: 18
        //     },
        //     {
        //         bookingId: 'TPD010',
        //         initialQuote: 220,
        //         bookingDate: '2024-08-28',
        //         dealPercentage: 10
        //     },
        //     {
        //         bookingId: 'TPD011',
        //         initialQuote: 210,
        //         bookingDate: '2024-08-29',
        //         dealPercentage: 20
        //     },
        //     {
        //         bookingId: 'TPD012',
        //         initialQuote: 190,
        //         bookingDate: '2024-08-30',
        //         dealPercentage: 8
        //     },
        //     {
        //         bookingId: 'TPD013',
        //         initialQuote: 230,
        //         bookingDate: '2024-08-31',
        //         dealPercentage: 22
        //     },
        //     {
        //         bookingId: 'TPD014',
        //         initialQuote: 260,
        //         bookingDate: '2024-09-01',
        //         dealPercentage: 17
        //     },
        //     {
        //         bookingId: 'TPD015',
        //         initialQuote: 240,
        //         bookingDate: '2024-09-02',
        //         dealPercentage: 15
        //     },
        //     {
        //         bookingId: 'TPD016',
        //         initialQuote: 300,
        //         bookingDate: '2024-09-03',
        //         dealPercentage: 25
        //     },
        //     {
        //         bookingId: 'TPD017',
        //         initialQuote: 285,
        //         bookingDate: '2024-09-04',
        //         dealPercentage: 10
        //     },
        //     {
        //         bookingId: 'TPD018',
        //         initialQuote: 195,
        //         bookingDate: '2024-09-05',
        //         dealPercentage: 5
        //     },
        //     {
        //         bookingId: 'TPD019',
        //         initialQuote: 205,
        //         bookingDate: '2024-09-06',
        //         dealPercentage: 20
        //     },
        //     {
        //         bookingId: 'TPD020',
        //         initialQuote: 310,
        //         bookingDate: '2024-09-07',
        //         dealPercentage: 30
        //     }
        // ];
    }
};
