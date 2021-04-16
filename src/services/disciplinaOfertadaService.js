import api from "./api.js";
export default {
  get: () => {
    return api.get("/disciplinas-ofertadas");
  },
  store: (obj) => {
    return api.post("/disciplinas-ofertadas", obj);
  },
  destroy: (obj) => {
    return api.delete("/disciplinas-ofertadas", { data: obj });
  },
};
