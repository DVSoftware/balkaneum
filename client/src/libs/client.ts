import axios from 'axios';

export const defaultClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});