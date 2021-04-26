import api from "./api.js";
export default {
  get: (obj) => {
    if (obj) {
      return api.get(`/turmas/${obj}`);
    } else return api.get("/turmas");
  },
  store: (obj) => {
    return api.post("/turmas", obj);
  },
  destroy: (obj) => {
    return api.delete(`/turmas/${obj}`, { data: obj });
  },
};
