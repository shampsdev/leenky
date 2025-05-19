import axios from "axios";
import { API_URL } from "../shared/constants";
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  maxRedirects: 0,
});
