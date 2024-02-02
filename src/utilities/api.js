// api.js
import axios from "axios";

export const getFunnels = () =>
  axios.get(`http://25.18.88.64:8000/api/funnels`);

export const deleteFunnel = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/funnels/${id}`);

export const addFunnel = (funnelName) =>
  axios.post(`http://25.18.88.64:8000/api/funnels/store`, {
    funnel_name: funnelName,
  });

export const getUsers = () => axios.get(`http://25.18.88.64:8000/api/users`);

export const addUser = (dialogInputObject) =>
  axios.post(`http://25.18.88.64:8000/api/users/store`, {
    name: dialogInputObject.name,
    email: dialogInputObject.email,
    password: dialogInputObject.password,
    role: dialogInputObject.role,
  });

export const editUser = (dialogInputObject, id) =>
  axios.put(`http://25.18.88.64:8000/api/users/update/${id}`, {
    name: dialogInputObject.name,
    email: dialogInputObject.email,
    role: dialogInputObject.role,
  });

export const deleteUser = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/users/${id}`);

export const getDomains = () =>
  axios.get(`http://25.18.88.64:8000/api/domains`);

export const deleteDomain = (id) =>
  axios.delete(`http://25.18.88.64:8000/api/domains/${id}`);

export const addDomain = (domain) =>
  axios.post(`http://25.18.88.64:8000/api/domains/store`, {
    domain_name: domain.name,
    user_name: domain.user,
  });
