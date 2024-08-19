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
    }
};
