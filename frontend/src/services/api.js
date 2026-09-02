import axios from "axios";

const api = axios.create({
    baseURL: "https://vmc-operator-hmi-backend-vxs0.onrender.com/api"
});

export default api;
