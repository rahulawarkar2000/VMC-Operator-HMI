import axios from "axios";

const api = axios.create({
    baseURL: "http://vmc-operator-hmi-backend-vxs0.onrender.com/api"
});

export default api;
