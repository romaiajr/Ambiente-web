import api from "./api.js";
export default {
  get: () => {
    return api.get("/disciplinas");
  },
  store: (obj) => {
    return api.post("/disciplinas", obj);
  },
  destroy: (obj) => {
    return api.delete(`/disciplinas/${obj}`, { data: obj });
  },
  getOne: (obj) => {
    return api.get(`/disciplinas/${obj}`);
  },
  update: (obj) => {
    return api.patch(`/disciplinas/${obj.id}`, {
      name: obj.name,
      workload: obj.workload,
    });
  },
};
