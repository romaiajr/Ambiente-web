import api from "./api.js";
export default {
  get: () => {
    return api.get("/departamentos");
  },
  store: (obj) => {
    return api.post("/departamentos", obj);
  },
  destroy: (obj) => {
    return api.delete(`/departamentos/${obj}`, { data: obj });
  },
  getOne: (obj) => {
    return api.get(`/departamentos/${obj}`);
  },
  update: (obj) => {
    return api.patch(`/departamentos/${obj.id}`, { name: obj.name });
  },
};
