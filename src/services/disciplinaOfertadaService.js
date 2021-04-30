import api from "./api.js";
import auth from "./authorization";
export default {
  get: () => {
    return api.get("/disciplinas-ofertadas", auth);
  },
  store: (obj) => {
    return api.post("/disciplinas-ofertadas", obj, auth);
  },
};
