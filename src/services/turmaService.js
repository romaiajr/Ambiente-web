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
  getTutores: (obj) => {
    return api.get(`turma-tutor/${obj}`);
  },
  getUserByType: () => {
    return api.get(`/users-by-type/tutor`);
  },
  addTutor: (obj) => {
    return api.post("/turma-tutor", obj);
  },
};
