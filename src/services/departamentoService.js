import api from "./api.js";
import auth from "./authorization";
export default {
  get: () => {
    return api.get("/departamentos", auth);
  },
  store: (obj) => {
    return api.post("/departamentos", obj, auth);
  },
  destroy: (obj) => {
    return api.delete(`/departamentos/${obj}`, auth);
  },
  getOne: (obj) => {
    return api.get(`/departamentos/${obj}`, auth);
  },
  update: (obj) => {
    var dataToUpdate = { name: obj.name };
    return api.put(`/departamentos/${obj.id}`, dataToUpdate, auth);
  },
};
