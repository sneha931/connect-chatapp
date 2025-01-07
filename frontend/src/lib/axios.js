import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:import.meta.env.MODE === "development"?"http://localhost:8000/api":"https://connect-chatapp-pb6c.onrender.com/api",
    withCredentials:true,
})
