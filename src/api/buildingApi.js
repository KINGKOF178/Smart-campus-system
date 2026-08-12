import axios from "axios";

const API_URL = "/api/buildings";

export const getBuildings = () => axios.get(API_URL);

export const addBuilding = (building) =>
  axios.post(API_URL, building);

export const deleteBuilding = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const updateBuilding = (id, building) =>
  axios.put(`${API_URL}/${id}`, building);

export const getFloors = () =>
  axios.get("/api/floors");