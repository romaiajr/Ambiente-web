import api from "./api.js";
import auth from "./authorization";

export default {
  store: (obj) => {
    return api.post("/problemas", obj, auth);
  },
};
