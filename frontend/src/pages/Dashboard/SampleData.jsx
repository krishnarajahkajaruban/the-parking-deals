export const SampleData = {
    getData() {
        return [
            {
                "id": 1000,
                "date": "2015-09-13",
                "time": "10:30",
                "status": "Accepted"
            },
            {
                "id": 1001,
                "date": "2015-09-15",
                "time": "12:30",
                "status": "Cancelled"
            },
            {
                "id": 1002,
                "date": "2015-09-17",
                "time": "14:00",
                "status": "Accepted"
            },
            {
                "id": 1003,
                "date": "2015-09-18",
                "time": "16:30",
                "status": "Cancelled"
            },
            {
                "id": 1004,
                "date": "2015-09-19",
                "time": "09:00",
                "status": "Accepted"
            },
            {
                "id": 1005,
                "date": "2015-09-20",
                "time": "11:15",
                "status": "Cancelled"
            },
            {
                "id": 1006,
                "date": "2015-09-21",
                "time": "13:45",
                "status": "Accepted"
            },
            {
                "id": 1007,
                "date": "2015-09-22",
                "time": "15:30",
                "status": "Cancelled"
            },
            {
                "id": 1008,
                "date": "2015-09-23",
                "time": "10:00",
                "status": "Accepted"
            },
            {
                "id": 1009,
                "date": "2015-09-24",
                "time": "12:45",
                "status": "Cancelled"
            },
            {
                "id": 1010,
                "date": "2015-09-13",
                "time": "10:30",
                "status": "Accepted"
            },
            {
                "id": 1011,
                "date": "2015-09-15",
                "time": "12:30",
                "status": "Cancelled"
            },
            {
                "id": 1012,
                "date": "2015-09-17",
                "time": "14:00",
                "status": "Accepted"
            },
            {
                "id": 1013,
                "date": "2015-09-18",
                "time": "16:30",
                "status": "Cancelled"
            },
            {
                "id": 1014,
                "date": "2015-09-19",
                "time": "09:00",
                "status": "Accepted"
            },
            {
                "id": 1015,
                "date": "2015-09-20",
                "time": "11:15",
                "status": "Cancelled"
            },
            {
                "id": 1016,
                "date": "2015-09-21",
                "time": "13:45",
                "status": "Accepted"
            },
            {
                "id": 1017,
                "date": "2015-09-22",
                "time": "15:30",
                "status": "Cancelled"
            },
            {
                "id": 1018,
                "date": "2015-09-23",
                "time": "10:00",
                "status": "Accepted"
            },
            {
                "id": 1019,
                "date": "2015-09-24",
                "time": "12:45",
                "status": "Cancelled"
            }
        ];
    },

    getBookingsSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getBookingsMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getBookingsLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getBookingsXLarge() {
        return Promise.resolve(this.getData());
    },

    getBookings(params) {
        const queryParams = params
            ? Object.keys(params)
                .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/bookings?' + queryParams).then((res) => res.json());
    }
};
