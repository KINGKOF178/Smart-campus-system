import axios from "axios";

const API_URL = "/api/reports";

export const getReport = () => axios.get(API_URL);