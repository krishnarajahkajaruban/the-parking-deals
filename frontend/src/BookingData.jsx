import api from "./api";

export const SampleData = {
    getData(token, bookingId, date) {
        return api.get(`/api/common-role/get-all-bookings`, {
            params: {
                ...(bookingId && {bookingId}),
                ...(date && {date}),
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            // Transform the response data to match the structure required by the DataTable
            const bookings = res.data.data.map(booking => ({
                id: booking.bookingId,
                date: new Date(booking.createdAt).toLocaleDateString('en-GB'),
                time: new Date(booking.createdAt).toLocaleTimeString(),
                status: booking.status,
                bookedBy: (booking?.user?.createdBy) ? "Admin" : "User",
                details: booking,
            }));
    
            // Add empty dummy objects based on remainingDataCount
            // const dummyBookings = Array(res.data.remainingDataCount).fill({
            //     id: null,
            //     date: '',
            //     time: '',
            //     status: '',
            //     details: {},
            // });
    
            // Combine the real bookings with the dummy ones
            // const allBookings = [...bookings, ...dummyBookings];
    
            return { bookings: bookings, totalRecords: res.data.totalCount };
        }).catch(err => {
            console.error(err);
            return { bookings: [], totalRecords: 0 };
        });
    },

    // The other functions can remain the same
    getBookingsSmall(token) {
        return this.getData(1, 10, '', '', token);
    },

    getBookingsMedium(token) {
        return this.getData(1, 50, '', '', token);
    },

    getBookingsLarge(token) {
        return this.getData(1, 200, '', '', token);
    },

    getBookingsXLarge(token) {
        return this.getData(undefined, undefined, '', '', token);
    },

    getBookings(params, token) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch(`https://www.primefaces.org/data/bookings?${queryParams}`).then((res) => res.json());
    }
};
