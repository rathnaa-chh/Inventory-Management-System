import ApiClient from "./client";

export const categoryApi = {
  getAll: () => ApiClient.get("/categories"),
};