import api from "./api.js";
import auth from "./authorization";
export default {
  get: () => {
    return api.get("/disciplinas", auth);
  },
  store: (obj) => {
    return api.post("/disciplinas", obj, auth);
  },
  destroy: (obj) => {
    return api.delete(`/disciplinas/${obj}`, auth);
  },
  getOne: (obj) => {
    return api.get(`/disciplinas/${obj}`, auth);
  },
  update: (obj) => {
    var dataToUpdate = {
      name: obj.name,
      workload: obj.workload,
    };
    return api.put(`/disciplinas/${obj.id}`, dataToUpdate, auth);
  },
};
