import axios from "axios";

const API_URL = "/api/rooms";

export const getRooms = () => axios.get(API_URL);

export const addRoom = (room) =>
  axios.post(API_URL, room);

export const updateRoom = (id, room) =>
  axios.put(`${API_URL}/${id}`, room);

export const deleteRoom = (id) =>
  axios.delete(`${API_URL}/${id}`);

export const getBuildings = () =>
  axios.get("/api/buildings");

export const getFloors = () =>
  axios.get("/api/floors");