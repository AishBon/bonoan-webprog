import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const API = axios.create({
  baseURL: `${BASE_URL}/api/article`,
});

export const mapArticleFromApi = (a) => ({
  ...a,
  id: a._id ?? a.id,
  name: a.name ?? "",
  title: a.title ?? "",
  imageUrl: a.imageUrl ?? "",
  isActive: a.isActive ?? true,
  content: Array.isArray(a.content) ? a.content : [a.content ?? ""],
});

export const fetchArticles = () => API.get("/");
export const createArticle = (article) => API.post("/", article);
export const updateArticle = (id, article) => API.put(`/${id}`, article);
export const deleteArticle = (id) => API.delete(`/${id}`);
