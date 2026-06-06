/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../plugins/axios";

interface ApiI {
  get: <T>(endpoint: string) => Promise<T | null>;
  post: <T>(endpoint: string, body: any) => Promise<T | null>;
  put: <T>(endpoint: string, body: any) => Promise<T | null>;
  delete: <T>(endpoint: string) => Promise<T | null>;
}

class Api implements ApiI {
  private async request<T>(
    method: "get" | "post" | "put" | "delete",
    endpoint: string,
    body?: any,
  ): Promise<T | null> {
    try {
      let response: any;

      if (method === "get" || method === "delete") {
        response = await api[method](endpoint);
      } else {
        response = await api[method](endpoint, body);
      }

      return response as T;
    } catch (e: any) {
      console.error(`Lỗi API [${method.toUpperCase()}] ${endpoint}:`, e);

      const errorMsg =
        e.response?.data?.message || "Có lỗi xảy ra khi kết nối server!";
      alert(errorMsg);

      return null;
    }
  }

  async get<T>(endpoint: string): Promise<T | null> {
    return await this.request<T>("get", endpoint);
  }

  async post<T>(endpoint: string, body: any): Promise<T | null> {
    return await this.request<T>("post", endpoint, body);
  }

  async put<T>(endpoint: string, body: any): Promise<T | null> {
    return await this.request<T>("put", endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T | null> {
    return await this.request<T>("delete", endpoint);
  }
}

export const fetchApi = new Api();
