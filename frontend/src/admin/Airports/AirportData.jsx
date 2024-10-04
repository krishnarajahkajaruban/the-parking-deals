import api from "../../api";

export const AirportsData = {
    getAirportData() {
        return api.get('/api/common-role/get-all-airports')
            .then(res=>{
                console.log(res.data);
                return res.data?.data;
            })
            .catch(err => {
                console.error(err);
                return [];
            })
    },
};
