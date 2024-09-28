import axios, { AxiosRequestConfig } from "axios";

const localhost = true;

const urlSelect = () => {
  if (typeof window !== "undefined") {
    const ref = window.location.href;

    if (ref.includes("localhost")) return "http://localhost:3000";
    if (localhost) return "http://localhost:3000";
    return "http://localhost:3000";
  }
};

const newApi = axios.create({
  baseURL: urlSelect(),
});

newApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export abstract class ApiService {
  static async get<T>(url: string, options?: AxiosRequestConfig) {
    return (await newApi.get<T>(url, options)).data;
  }

  static async post<T>(url: string, data: any) {
    return (await newApi.post<T>(url, data)).data;
  }

  static async put<T>(url: string, data: any) {
    return (await newApi.put<T>(url, data)).data;
  }

  static async delete<T>(url: string) {
    return (await newApi.delete<T>(url)).data;
  }
}
