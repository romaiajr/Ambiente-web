import api from "./api.js";
export default {
  get: () => {
    return api.get("/semestres");
  },
  store: (obj) => {
    return api.post("/semestres", obj);
  },
  destroy: (obj) => {
    return api.delete(`/semestres/${obj}`);
  },
  getOne: (obj) => {
    return api.get(`/semestres/${obj}`);
  },
  update: (obj) => {
    return api.patch(`/semestres/${obj.id}`, {
      end_date: obj.end_date,
    });
  },
};
