import api from "./api.js";
import auth from "./authorization";
export default {
  get: () => {
    return api.get("/semestres", auth);
  },
  store: (obj) => {
    return api.post("/semestres", obj, auth);
  },
  destroy: (obj) => {
    return api.delete(`/semestres/${obj}`, auth);
  },
  getOne: (obj) => {
    return api.get(`/semestres/${obj}`, auth);
  },
  update: (obj) => {
    var dataToUpdate = {
      end_date: obj.end_date,
    };
    return api.put(`/semestres/${obj.id}`, dataToUpdate, auth);
  },
};
