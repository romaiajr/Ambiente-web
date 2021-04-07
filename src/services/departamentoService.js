import api from "./api.js";
export default {
  get: () => {
    return api.get("/departamentos");
  },
  store: (obj) => {
    return api.post("/departamentos", obj);
  },
  destroy: (obj) => {
    return api.delete("/departamentos", { data: obj });
  },
};
