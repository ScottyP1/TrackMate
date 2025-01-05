import axios from "axios";
const axiosInstance = axios.create({
    baseURL: '/api', // Backend URL
});


export default axiosInstance;