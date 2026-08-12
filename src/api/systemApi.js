import axios from "axios";

const API_URL = "/api/system/status";

export const getSystemStatus = () => axios.get(API_URL);