import axios from "axios";

const API_URL = "/api/floors";

export const getFloors = () => axios.get(API_URL);

export const addFloor = (floor) =>
  axios.post(API_URL, floor);

export const updateFloor = (id, floor) =>
  axios.put(`${API_URL}/${id}`, floor);

export const deleteFloor = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const getBuildings = () =>
  axios.get("/api/buildings");