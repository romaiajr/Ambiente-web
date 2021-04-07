import api from "./api.js";
export default {
  login: (obj) => {
    return api.post("/login", obj);
  },
};
