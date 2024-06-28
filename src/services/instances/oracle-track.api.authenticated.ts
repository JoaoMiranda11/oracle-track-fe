import { store } from "@/contexts/redux/store";
import { logout } from "@/contexts/redux/user/user.slice";
import axios from "axios";

const OracleTrackAuthenticatedApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ORACLE_API_URL || "http://localhost:4000",
  withCredentials: true,
});

OracleTrackAuthenticatedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default OracleTrackAuthenticatedApi;
