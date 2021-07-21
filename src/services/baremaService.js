import api from "./api.js";
import auth from "./authorization";

export default {
  get: () => {
    return api.get(`/barema-tutor`, auth);
  },
  getOne: (id) => {
    return api.get(`/barema-tutor/${id}`, auth);
  },
  store: (obj) => {
    return api.post("/barema-tutor", obj, auth);
  },
  destroy: (obj) => {
    return api.delete(`/barema-tutor/${obj}`, auth);
  },
  update: (obj, id) => {
    var dataToUpdate = { name: obj.name, itens: obj.itens };
    return api.put(`/barema-tutor/${id}`, dataToUpdate, auth);
  },
};
