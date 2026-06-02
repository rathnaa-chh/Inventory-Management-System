import ApiClient from "./client";

export const categoryApi = {
  getAll: () => ApiClient.get("/categories"),
  
  create: (data: any) => ApiClient.post("/categories", data),

  update: (id: number, data: any) =>
    ApiClient.put(`/categories/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/categories/${id}`),
};