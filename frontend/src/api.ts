import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // tu backend
    withCredentials: true
});

export default api;
