var token = sessionStorage.getItem("token");
var auth = {
  headers: {
    headers: { 'Content-Type': 'multipart/form-data' },
    Authorization: `Bearer ${token}`,
  },
};

export default auth;
