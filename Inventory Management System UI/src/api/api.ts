import ApiClient from "./client";

// =========================
// PRODUCTS
// =========================
export const productAPI = {
  getAll: () => ApiClient.get("/products"),

  create: (data: any) => ApiClient.post("/products", data),

  update: (id: number, data: any) =>
    ApiClient.put(`/products/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/products/${id}`)
};

// =========================
// CATEGORIES
// =========================
export const categoryAPI = {
  getAll: () => ApiClient.get("/categories")
};