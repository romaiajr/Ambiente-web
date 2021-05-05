import api from "./api.js";
import auth from "./authorization";
export default {
  get: () => {
    return api.get("/system-logs", auth);
  },
};
