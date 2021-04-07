import api from "./api.js";
export default {
  get: () => {
    return api.get("/disciplinas");
  },
  store: (obj) => {
    return api.post("/disciplinas", obj);
  },
  destroy: (obj) => {
    return api.delete("/disciplinas", { data: obj });
  },
};
