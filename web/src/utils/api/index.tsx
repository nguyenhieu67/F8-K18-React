/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../plugins/axios";

interface ApiI {
  get: <T>(endpoint: string) => Promise<T>;
  post: <T>(endpoint: string, body: any) => Promise<T>;
  put: <T>(endpoint: string, body: any) => Promise<T>;
  patch: <T>(endpoint: string, body: any) => Promise<T>;
  delete: <T>(endpoint: string) => Promise<T>;
}

class Api implements ApiI {
  private async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    endpoint: string,
    body?: any,
  ): Promise<T> {
    try {
      let response: any;

      if (method === "get" || method === "delete") {
        response = await api[method](endpoint);
      } else {
        response = await api[method](endpoint, body);
      }

      return response as T;
    } catch (e: any) {
      if (e?.response?.status !== 410) {
        console.error(`Lỗi API [${method.toUpperCase()}] ${endpoint}:`, e);
      }
      throw e;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return await this.request<T>("get", endpoint);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return await this.request<T>("post", endpoint, body);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return await this.request<T>("put", endpoint, body);
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return await this.request<T>("patch", endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return await this.request<T>("delete", endpoint);
  }
}

export const fetchApi = new Api();
