import api from "./api.js";
import auth from "./authorization";
export default {
  get: (obj) => {
    if (obj) {
      return api.get(`/turmas/${obj}`, auth);
    } else return api.get("/turmas", auth);
  },
  store: (obj) => {
    return api.post("/turmas", obj, auth);
  },
  destroy: (obj) => {
    return api.delete(`/turmas/${obj}`, auth);
  },
  getTutores: (obj) => {
    return api.get(`turma-tutor/${obj}`, auth);
  },
  getUserByType: () => {
    return api.get(`/users-by-type/2`, auth);
  },
  addTutor: (obj) => {
    return api.post("/turma-tutor", obj, auth);
  },
  getTurmas: () => {
    return api.get("/tutor-turma", auth);
  },
};
