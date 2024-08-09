import api from "./api";

export const SampleData = {
    getData(page = 1, limit = 10, status = '', date = '', token) {
        return api.get(`/api/common-role/get-all-bookings`, {
            params: {
                page,
                limit,
                status,
                date,
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            // Transform the response data to match the structure required by the DataTable
            const bookings = res.data.data.map(booking => ({
                id: booking.bookingId,
                date: new Date(booking.createdAt).toLocaleDateString(),
                time: new Date(booking.createdAt).toLocaleTimeString(),
                status: booking.status,
                details: booking,
            }));
            return { bookings, totalRecords: res.data.totalCount };
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
