import axios from "axios";

const API_URL = "/api/dashboard";

export const getDashboardData = () => axios.get(API_URL);