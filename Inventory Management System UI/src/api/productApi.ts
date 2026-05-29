import ApiClient from "./client";

export const productApi = {
  getAll: () => ApiClient.get("/products"),

  create: (data: any) => ApiClient.post("/products", data),

  update: (id: number, data: any) =>
    ApiClient.put(`/products/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/products/${id}`),
};