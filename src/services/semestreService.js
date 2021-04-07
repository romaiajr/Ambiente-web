import api from "./api.js";
export default {
  get: () => {
    return api.get("/semestres");
  },
  store: (obj) => {
    return api.post("/semestres", obj);
  },
  destroy: (obj) => {
    return api.delete("/semestres", { data: obj });
  },
};
