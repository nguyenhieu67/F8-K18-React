/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../plugins/axios";
import type { AxiosRequestConfig } from "axios";

interface ApiI {
  get: <T>(endpoint: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T>(endpoint: string, body: any, config?: AxiosRequestConfig) => Promise<T>;
  put: <T>(endpoint: string, body: any, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T>(endpoint: string, body: any, config?: AxiosRequestConfig) => Promise<T>;
  delete: <T>(endpoint: string, config?: AxiosRequestConfig) => Promise<T>;
}

class Api implements ApiI {
  private async request<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    endpoint: string,
    body?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      let response: any;

      if (method === "get" || method === "delete") {
        response = await api[method](endpoint, config);
      } else {
        response = await api[method](endpoint, body, config);
      }

      return response as T;
    } catch (e: any) {
      if (e?.response?.status !== 410) {
        console.error(`Lỗi API [${method.toUpperCase()}] ${endpoint}:`, e);
      }
      throw e;
    }
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>("get", endpoint, undefined, config);
  }

  async post<T>(endpoint: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>("post", endpoint, body, config);
  }

  async put<T>(endpoint: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>("put", endpoint, body, config);
  }

  async patch<T>(endpoint: string, body: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>("patch", endpoint, body, config);
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return await this.request<T>("delete", endpoint, config);
  }
}

export const fetchApi = new Api();