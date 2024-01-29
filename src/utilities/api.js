// api.js
import axios from "axios";

export const getFunnels = () =>
  axios.get(`${import.meta.env.API_URL}/api/funnels`);

export const deleteFunnel = (id) =>
  axios.delete(`${import.meta.env.API_URL}/api/funnels/${id}`);

export const addFunnel = (funnelName) =>
  axios.post(`${import.meta.env.API_URL}/api/funnels/store`, {
    funnel_name: funnelName,
  });
