import api from "./api";

export const SampleData = {
    getData(page = 1, limit = 10, type, token) {
        return api.get(`/api/admin/get-all-users`, {
            params: {
                page,
                limit,
                type
            },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(res => {
            // Transform the response data to match the structure required by the DataTable
            const users = res.data.data.map(user => ({
                title: user.title,
                firstName: user.firstName,
                lastName: user.lastname,
                email: user.email,
                mobileNumber: user.mobileNumber,
                details: user
            }));
            return { users, totalRecords: res.data.totalCount };
        }).catch(err => {
            console.error(err);
            return { users: [], totalRecords: 0 };
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
